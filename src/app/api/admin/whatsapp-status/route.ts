import { NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { sendWhatsApp } from "@/lib/whatsapp";

export async function GET(req: Request) {
  const token = getTokenFromRequest(req as any);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiUrl = process.env.GREENAPI_URL || "https://7105.api.greenapi.com";
  const idInst = process.env.GREENAPI_ID_INSTANCE;
  const apiToken = process.env.GREENAPI_TOKEN;
  const adminPhone = process.env.ADMIN_WHATSAPP_NUMBER || "+8801778506500";
  const provider = process.env.WHATSAPP_PROVIDER || "green-api";

  if (!apiUrl || !idInst || !apiToken) {
    return NextResponse.json({
      configured: false,
      provider,
      stateInstance: "notConfigured",
      message: "Green API credentials are not configured in environment variables.",
    });
  }

  try {
    const stateRes = await fetch(`${apiUrl}/waInstance${idInst}/getStateInstance/${apiToken}`, {
      cache: "no-store",
    });
    const stateData = await stateRes.json();
    const stateInstance = stateData.stateInstance || "unknown";

    let qrCodeBase64: string | null = null;

    if (stateInstance === "notAuthorized") {
      const qrRes = await fetch(`${apiUrl}/waInstance${idInst}/qr/${apiToken}`, {
        cache: "no-store",
      });
      const qrData = await qrRes.json();
      if (qrData.type === "qrCode" && qrData.message) {
        qrCodeBase64 = qrData.message;
      }
    }

    return NextResponse.json({
      configured: true,
      provider,
      stateInstance,
      idInstance: idInst,
      adminPhone,
      qrCodeBase64,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to contact Green API" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const token = getTokenFromRequest(req as any);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await verifyToken(token);
  if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { action, phone, message } = await req.json();

    if (action === "test") {
      const testPhone = phone || process.env.ADMIN_WHATSAPP_NUMBER || "+8801778506500";
      const testBody =
        message ||
        `✅ *এইচএফ ইঞ্জিনিয়ারিং — টেস্ট নোটিফিকেশন*\n\nআপনার হোয়াটসঅ্যাপ বট সফলভাবে কানেক্ট হয়েছে এবং কাজ করছে!\n\nসময়: ${new Date().toLocaleString(
          "en-GB",
          { timeZone: "Asia/Dhaka" }
        )}\nHF Design & Engineering Solutions`;

      const result = await sendWhatsApp(testBody, testPhone);
      return NextResponse.json(result);
    }

    if (action === "reboot") {
      const apiUrl = process.env.GREENAPI_URL || "https://7105.api.greenapi.com";
      const idInst = process.env.GREENAPI_ID_INSTANCE;
      const apiToken = process.env.GREENAPI_TOKEN;

      if (!apiUrl || !idInst || !apiToken) {
        return NextResponse.json({ error: "Not configured" }, { status: 400 });
      }

      const res = await fetch(`${apiUrl}/waInstance${idInst}/reboot/${apiToken}`, {
        method: "GET",
        cache: "no-store",
      });
      const data = await res.json();
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Operation failed" },
      { status: 500 }
    );
  }
}
