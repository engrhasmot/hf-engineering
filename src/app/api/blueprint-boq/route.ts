import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import cloudinary from "@/lib/cloudinary";
import { sendWhatsApp } from "@/lib/whatsapp";
import { getSiteUrl } from "@/lib/constants";
import BlueprintBOQ from "@/models/blueprint-boq.model";

// ─── Cloudinary Helper ───────────────────────────────────────────────────────
function uploadBufferToCloudinary(buffer: Buffer, folder: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "auto" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

// ─── BNBC & RAJUK Material Rates (2024-2025 Market Price) ────────────────────
const MARKET_RATES = {
  rod: { unit: "Kg", ratePerKg: 96, desc: "BSRM/Rahim Steel 60 Grade" },
  cement: { unit: "Bag (50kg)", ratePerBag: 540, desc: "Crown/Bashundhara OPC" },
  coarseSand: { unit: "CFT", ratePerCft: 55, desc: "Sylhet Coarse Sand" },
  fineSand: { unit: "CFT", ratePerCft: 35, desc: "Local Fine Sand (Masonry)" },
  aggregate: { unit: "CFT", ratePerCft: 140, desc: "20mm Stone Chips" },
  brick: { unit: "Pcs", ratePerPcs: 12.5, desc: "First Class Burnt Brick" },
  tile: { unit: "SFT", ratePerSft: 75, desc: "Ceramic Floor Tile (avg)" },
};

// ─── BNBC Structural Material Ratios (per 100 sqft of built area) ─────────────
// Reference: BNBC 2020 – Part 6: Structural Design, Annex Material Provisions
// RAJUK Building Construction Rules 2008 (Amended 2023)
const BNBC_RATIO = {
  residential: {
    // Rod: ~3.5 to 4.5 kg per sqft (G+3 to G+6 RC frame)
    rodKgPerSqft: 4.0,
    // Cement: ~0.25 bag per sqft (casting + masonry combined)
    cementBagPerSqft: 0.28,
    // Coarse Sand: ~0.7 cft per sqft (concrete works)
    coarseSandCftPerSqft: 0.70,
    // Fine Sand: ~0.5 cft per sqft (masonry & plaster)
    fineSandCftPerSqft: 0.50,
    // Aggregate (Stone chips): ~0.9 cft per sqft
    aggregateCftPerSqft: 0.90,
    // Bricks: ~22 pcs per sqft (9" wall, deducting openings)
    brickPcsPerSqft: 22,
  },
  commercial: {
    rodKgPerSqft: 5.5,
    cementBagPerSqft: 0.35,
    coarseSandCftPerSqft: 0.85,
    fineSandCftPerSqft: 0.60,
    aggregateCftPerSqft: 1.1,
    brickPcsPerSqft: 18,
  },
  industrial: {
    rodKgPerSqft: 7.0,
    cementBagPerSqft: 0.42,
    coarseSandCftPerSqft: 1.0,
    fineSandCftPerSqft: 0.65,
    aggregateCftPerSqft: 1.35,
    brickPcsPerSqft: 15,
  },
};

// ─── Rod breakdown by diameter (BNBC 2020 Chapter 6.8) ──────────────────────
const ROD_BREAKDOWN = {
  "16mm (Main Column/Beam)": 0.35,
  "12mm (Secondary Beam/Slab)": 0.30,
  "10mm (Slab/Staircase)": 0.20,
  "8mm (Stirrups/Ties)": 0.15,
};

// ─── Gemini Vision API Call ───────────────────────────────────────────────────
async function analyzeWithGemini(
  imageUrl: string,
  buildingType: string,
  floors: number
): Promise<{
  detectedRooms: string[];
  estimatedArea: number;
  wallLength: number;
  columnCount: number;
  openingPercentage: number;
  notes: string;
  confidence: "high" | "medium" | "low";
}> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Fallback: return a structured estimate without AI
    return {
      detectedRooms: ["Living Room", "2 Bedrooms", "Kitchen", "Bathroom", "Corridor"],
      estimatedArea: 1000,
      wallLength: 180,
      columnCount: 8,
      openingPercentage: 25,
      notes: "Manual estimation — Gemini API not configured. Using default residential template.",
      confidence: "low",
    };
  }

  const prompt = `
You are an expert structural engineer and BOQ estimator specializing in Bangladesh construction standards (BNBC 2020, RAJUK Building Rules 2008 Amended 2023).

Analyze this architectural floor plan image carefully. The building type is "${buildingType}" with ${floors} floor(s).

Please extract and return ONLY a valid JSON object with these exact fields (no markdown, no explanation):
{
  "detectedRooms": ["list of room names detected"],
  "estimatedArea": <total floor area in square feet, number only>,
  "wallLength": <total wall perimeter in running feet, number only>,
  "columnCount": <approximate number of columns/pillars visible, integer>,
  "openingPercentage": <percentage of wall area that is doors/windows, 0-40, number>,
  "notes": "<brief 1-2 sentence structural observation in English>",
  "confidence": "<one of: high, medium, low>"
}

Detection guidelines:
- Count rooms by identifying enclosed spaces with labels or standard room proportions
- Estimate area from scale indicators or relative room sizes (assume standard Bangladeshi plot: 3 katha = ~2178 sqft, 5 katha = ~3630 sqft)
- Wall length = sum of all internal + external walls in running feet
- Columns appear as filled squares/circles at intersections
- Doors/windows are shown as arcs or thin rectangles in walls
- For missing info, make your best professional estimate
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: await fetchImageAsBase64(imageUrl),
                  },
                },
                { text: prompt },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            topK: 1,
            topP: 0.8,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiData = await response.json();
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const parsed = JSON.parse(cleaned);

    return {
      detectedRooms: parsed.detectedRooms || [],
      estimatedArea: Number(parsed.estimatedArea) || 1000,
      wallLength: Number(parsed.wallLength) || 180,
      columnCount: Number(parsed.columnCount) || 8,
      openingPercentage: Number(parsed.openingPercentage) || 25,
      notes: parsed.notes || "",
      confidence: parsed.confidence || "medium",
    };
  } catch (err) {
    console.error("[Gemini BOQ] Analysis error:", err);
    // Graceful fallback
    return {
      detectedRooms: ["Detection Failed — Manual Review Required"],
      estimatedArea: 1000,
      wallLength: 180,
      columnCount: 8,
      openingPercentage: 25,
      notes: "AI detection failed. Estimate based on standard residential template.",
      confidence: "low",
    };
  }
}

async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer).toString("base64");
}

// ─── BOQ Calculation Engine ──────────────────────────────────────────────────
function calculateBOQ(
  totalAreaSqft: number,
  floors: number,
  buildingType: keyof typeof BNBC_RATIO,
  openingPct: number
) {
  const ratio = BNBC_RATIO[buildingType] || BNBC_RATIO.residential;
  const effectiveBrickArea = 1 - openingPct / 100;

  // Raw quantities
  const rodKg = Math.round(totalAreaSqft * ratio.rodKgPerSqft);
  const rodTon = parseFloat((rodKg / 1000).toFixed(2));
  const cementBags = Math.round(totalAreaSqft * ratio.cementBagPerSqft);
  const coarseSandCft = Math.round(totalAreaSqft * ratio.coarseSandCftPerSqft);
  const fineSandCft = Math.round(totalAreaSqft * ratio.fineSandCftPerSqft);
  const aggregateCft = Math.round(totalAreaSqft * ratio.aggregateCftPerSqft);
  const brickPcs = Math.round(totalAreaSqft * ratio.brickPcsPerSqft * effectiveBrickArea);

  // Rod breakdown by diameter
  const rodBreakdown = Object.entries(ROD_BREAKDOWN).map(([label, pct]) => ({
    label,
    kg: Math.round(rodKg * pct),
    ton: parseFloat(((rodKg * pct) / 1000).toFixed(2)),
  }));

  // Cement split: 60% casting, 40% masonry & plaster
  const cementCasting = Math.round(cementBags * 0.60);
  const cementMasonry = Math.round(cementBags * 0.40);

  // Costs
  const rodCost = rodKg * MARKET_RATES.rod.ratePerKg;
  const cementCost = cementBags * MARKET_RATES.cement.ratePerBag;
  const coarseSandCost = coarseSandCft * MARKET_RATES.coarseSand.ratePerCft;
  const fineSandCost = fineSandCft * MARKET_RATES.fineSand.ratePerCft;
  const aggregateCost = aggregateCft * MARKET_RATES.aggregate.ratePerCft;
  const brickCost = brickPcs * MARKET_RATES.brick.ratePerPcs;
  const totalMaterialCost = rodCost + cementCost + coarseSandCost + fineSandCost + aggregateCost + brickCost;

  // Add ±8% variance for final range
  return {
    quantities: {
      rod: { kg: rodKg, ton: rodTon, breakdown: rodBreakdown },
      cement: { total: cementBags, casting: cementCasting, masonry: cementMasonry },
      coarseSand: { cft: coarseSandCft },
      fineSand: { cft: fineSandCft },
      aggregate: { cft: aggregateCft },
      brick: { pcs: brickPcs },
    },
    costs: {
      rod: Math.round(rodCost),
      cement: Math.round(cementCost),
      coarseSand: Math.round(coarseSandCost),
      fineSand: Math.round(fineSandCost),
      aggregate: Math.round(aggregateCost),
      brick: Math.round(brickCost),
      totalMaterial: Math.round(totalMaterialCost),
      minTotal: Math.round(totalMaterialCost * 0.92),
      maxTotal: Math.round(totalMaterialCost * 1.08),
      perSqft: Math.round(totalMaterialCost / totalAreaSqft),
    },
    rates: MARKET_RATES,
    bnbcRef: "BNBC 2020 + RAJUK Building Rules 2023",
  };
}

// ─── Main POST Handler ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let name = "", phone = "", buildingType = "residential", floorsStr = "1";
    let imageBuffer: Buffer | null = null;
    let imageMime = "image/jpeg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      name = (formData.get("name") as string) || "";
      phone = (formData.get("phone") as string) || "";
      buildingType = (formData.get("buildingType") as string) || "residential";
      floorsStr = (formData.get("floors") as string) || "1";

      const file = formData.get("blueprint") as File | null;
      if (file && file.size > 0) {
        if (file.size > 10 * 1024 * 1024) {
          return NextResponse.json({ error: "ফাইল সাইজ ১০ MB এর বেশি হতে পারবে না।" }, { status: 400 });
        }
        imageMime = file.type;
        const bytes = await file.arrayBuffer();
        imageBuffer = Buffer.from(bytes);
      }
    }

    if (!name.trim() || !phone.trim()) {
      return NextResponse.json({ error: "নাম ও ফোন নম্বর প্রয়োজন।" }, { status: 400 });
    }
    if (!imageBuffer) {
      return NextResponse.json({ error: "ড্রয়িং বা ফ্লোর প্ল্যান আপলোড করুন।" }, { status: 400 });
    }

    const floors = Math.max(1, Math.min(20, parseInt(floorsStr) || 1));
    const validTypes = ["residential", "commercial", "industrial"] as const;
    const typeSafe = validTypes.includes(buildingType as any)
      ? (buildingType as keyof typeof BNBC_RATIO)
      : "residential";

    // 1. Upload blueprint to Cloudinary
    let blueprintUrl = "";
    try {
      const uploadRes = await uploadBufferToCloudinary(imageBuffer, "hf-engineering/blueprints");
      blueprintUrl = uploadRes?.secure_url || "";
    } catch (uploadErr) {
      console.error("[Cloudinary] Blueprint upload error:", uploadErr);
      return NextResponse.json({ error: "ছবি আপলোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" }, { status: 500 });
    }

    // 2. AI Analysis via Gemini Vision
    const aiResult = await analyzeWithGemini(blueprintUrl, typeSafe, floors);
    const totalAreaSqft = aiResult.estimatedArea * floors;

    // 3. BOQ Calculation (BNBC 2020 + RAJUK 2023)
    const boq = calculateBOQ(totalAreaSqft, floors, typeSafe, aiResult.openingPercentage);

    // 4. Generate estimate number
    const estimateNo = `BOQ-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;

    // 5. Save to MongoDB
    await dbConnect();
    const record = await BlueprintBOQ.create({
      estimateNo,
      clientName: name,
      clientPhone: phone,
      blueprintUrl,
      buildingType: typeSafe,
      floors,
      aiAnalysis: {
        detectedRooms: aiResult.detectedRooms,
        estimatedAreaPerFloor: aiResult.estimatedArea,
        totalArea: totalAreaSqft,
        wallLength: aiResult.wallLength,
        columnCount: aiResult.columnCount,
        openingPercentage: aiResult.openingPercentage,
        aiNotes: aiResult.notes,
        confidence: aiResult.confidence,
      },
      boq: {
        quantities: boq.quantities,
        costs: boq.costs,
        bnbcRef: boq.bnbcRef,
      },
      marketRates: boq.rates,
      status: "completed",
    });

    // 6. WhatsApp Admin Notification
    const typeLabel = { residential: "আবাসিক", commercial: "বাণিজ্যিক", industrial: "শিল্প" }[typeSafe];
    const adminMsg = [
      `🏗️ *নতুন AI BOQ বিশ্লেষণ সম্পন্ন!*`,
      `HF Design & Engineering Solutions`,
      ``,
      `👤 ক্লায়েন্ট: *${name}*`,
      `📞 ফোন: *${phone}*`,
      `🏢 ভবনের ধরণ: *${typeLabel}* (${floors} তলা)`,
      `📐 অনুমানিক এলাকা: *${totalAreaSqft.toLocaleString()} বর্গফুট*`,
      `🔢 রড: *${boq.quantities.rod.ton} টন*`,
      `🏺 সিমেন্ট: *${boq.quantities.cement.total} ব্যাগ*`,
      `💰 মোট মালামাল খরচ: *৳${boq.costs.totalMaterial.toLocaleString()}*`,
      `📋 রেফারেন্স: ${estimateNo}`,
      ``,
      `🖼️ ব্লুপ্রিন্ট লিংক: ${blueprintUrl}`,
      `🌐 ${getSiteUrl()}/admin/material-estimates`,
    ].join("\n");

    sendWhatsApp(adminMsg, "+8801778506500").catch(err =>
      console.error("[WhatsApp] BOQ admin notification error:", err)
    );

    // 7. Client Confirmation
    const clientMsg = [
      `আসসালামুয়ালাইকুম *${name}* ভাই/আপু,`,
      ``,
      `✅ আপনার ফ্লোর প্ল্যানের AI BOQ বিশ্লেষণ সম্পন্ন হয়েছে!`,
      ``,
      `📋 রেফারেন্স নম্বর: *${estimateNo}*`,
      `📐 মোট নির্মাণ এলাকা: *${totalAreaSqft.toLocaleString()} বর্গফুট*`,
      ``,
      `*প্রাথমিক মালামালের পরিমাণ (BNBC 2020):*`,
      `🔩 রড: ${boq.quantities.rod.ton} টন`,
      `🏺 সিমেন্ট: ${boq.quantities.cement.total} ব্যাগ`,
      `🏜️ বালি: ${boq.quantities.coarseSand.cft + boq.quantities.fineSand.cft} CFT`,
      `🪨 পাথর: ${boq.quantities.aggregate.cft} CFT`,
      `🧱 ইট: ${boq.quantities.brick.pcs.toLocaleString()} পিস`,
      ``,
      `💰 প্রাথমিক মালামাল খরচ: ৳${boq.costs.minTotal.toLocaleString()} – ৳${boq.costs.maxTotal.toLocaleString()}`,
      ``,
      `⚠️ এটি একটি প্রাথমিক অনুমান। বিস্তারিত BOQ ও নির্ভুল হিসাবের জন্য আমাদের ইঞ্জিনিয়ারের সাথে যোগাযোগ করুন।`,
      `📞 01778-506500`,
      `🌐 ${getSiteUrl()}`,
    ].join("\n");

    sendWhatsApp(clientMsg, phone).catch(err =>
      console.error("[WhatsApp] BOQ client confirmation error:", err)
    );

    return NextResponse.json({
      success: true,
      estimateNo,
      blueprintUrl,
      aiAnalysis: {
        detectedRooms: aiResult.detectedRooms,
        estimatedAreaPerFloor: aiResult.estimatedArea,
        totalArea: totalAreaSqft,
        wallLength: aiResult.wallLength,
        columnCount: aiResult.columnCount,
        openingPercentage: aiResult.openingPercentage,
        notes: aiResult.notes,
        confidence: aiResult.confidence,
      },
      boq: {
        quantities: boq.quantities,
        costs: boq.costs,
        rates: boq.rates,
        bnbcRef: boq.bnbcRef,
      },
    });
  } catch (error: any) {
    console.error("[Blueprint BOQ] Error:", error);
    return NextResponse.json(
      { error: error.message || "বিশ্লেষণ করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}
