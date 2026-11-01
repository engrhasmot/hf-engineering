import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import ClientUser from "@/models/client-user.model";
import Inquiry, { ServiceType } from "@/models/inquiry.model";
import { verifyClientToken } from "@/lib/auth";
import { sendWhatsApp } from "@/lib/whatsapp";

const ADMIN_NOTIFY_WHATSAPP = "+8801778506500";

function mapCategoryToServiceType(cat?: string): ServiceType {
  if (!cat) return "site-supervision";
  const c = cat.toLowerCase();
  if (
    c.includes("সাইট") ||
    c.includes("site") ||
    c.includes("কাস্টিং") ||
    c.includes("casting") ||
    c.includes("রড") ||
    c.includes("supervision") ||
    c.includes("পরিদর্শন")
  ) {
    return "site-supervision";
  }
  if (
    c.includes("ড্রয়িং") ||
    c.includes("drawing") ||
    c.includes("নকশা") ||
    c.includes("2d") ||
    c.includes("drafting")
  ) {
    return "2d-drafting";
  }
  if (
    c.includes("3d") ||
    c.includes("ইন্টেরিয়র") ||
    c.includes("interior") ||
    c.includes("elevation")
  ) {
    return "3d-design";
  }
  if (
    c.includes("boq") ||
    c.includes("এস্টিমেট") ||
    c.includes("estimate") ||
    c.includes("বিল")
  ) {
    return "boq-estimation";
  }
  if (
    c.includes("প্ল্যান") ||
    c.includes("অনুমোদন") ||
    c.includes("passing") ||
    c.includes("rajuk")
  ) {
    return "plan-passing";
  }
  return "consultation";
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("client_token")?.value;

    let clientUser: any = null;
    if (token) {
      const payload: any = await verifyClientToken(token);
      if (payload?.clientId) {
        await dbConnect();
        clientUser = await ClientUser.findById(payload.clientId).lean();
      }
    }

    const body = await req.json();
    const { subject, category, message, fileId, preferredDate, contactPhone, serviceType: rawServiceType } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: "আপনার বার্তা বা অনুরোধটি লিখুন" }, { status: 400 });
    }

    await dbConnect();

    const clientName = clientUser ? clientUser.name : (body.name || "Client");
    const rawPhone = contactPhone || (clientUser ? clientUser.phone : body.phone || "");
    // Ensure valid phone for Bangladeshi validation regex: /^(?:\+?880)?\d{10,11}$/
    const normalizedPhone = rawPhone.replace(/[\s-]/g, "");
    const clientPhone = /^(?:\+?880)?\d{10,11}$/.test(normalizedPhone) ? rawPhone : (clientUser?.phone || "01778506500");

    const serviceType = rawServiceType || mapCategoryToServiceType(category) || "site-supervision";

    const inquiry = await Inquiry.create({
      name: clientName,
      phone: clientPhone,
      email: clientUser?.email || "",
      serviceType,
      source: "website",
      message: `[Client Portal Request - File: ${fileId || "N/A"}]
বিষয়: ${subject || "সাধারণ অনুসন্ধান"}
ক্যাটাগরি: ${category || "General"}
পছন্দের তারিখ: ${preferredDate || "জরুরি"}
বিস্তারিত:
${message.trim()}`,
      status: "new",
    });

    // Send instant WhatsApp notification to Engr. Hasmot Ali
    try {
      const adminMsg = `📩 *নতুন ক্লায়েন্ট রিকোয়েস্ট (Client Portal)*

👤 *ক্লায়েন্ট:* ${clientName}
📱 *ফোন:* ${clientPhone}
📁 *ফাইল আইডি:* ${fileId || "N/A"}
📌 *বিষয়:* ${subject || "সাপোর্ট / সাইট ভিজিট"}
📂 *ক্যাটাগরি:* ${category || "General Inquiry"}
📅 *পছন্দের তারিখ:* ${preferredDate || "যেকোনো সময়"}

📝 *বার্তা:*
${message.trim()}

🔗 *অ্যাডমিন প্যানেল:*
https://hfengineeringbd.com/admin/inquiries`;

      await sendWhatsApp(ADMIN_NOTIFY_WHATSAPP, adminMsg);
    } catch (waErr) {
      console.error("WhatsApp notify error:", waErr);
    }

    return NextResponse.json({
      success: true,
      message: "আপনার অনুরোধটি গ্রহণ করা হয়েছে। ইঞ্জিনিয়ার মোঃ হাসমত আলী দ্রুত যোগাযোগ করবেন।",
      inquiryId: inquiry._id,
    });
  } catch (error: any) {
    console.error("Client Support Ticket Error:", error);
    return NextResponse.json({ error: error?.message || "অনুরোধটি পাঠানো সম্ভব হয়নি" }, { status: 500 });
  }
}
