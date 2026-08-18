import { defaultPipelineStages, pipelineStageLabel, type PipelineStageId } from "@/src/shared/pipeline-stages";

export { defaultPipelineStages, pipelineStageLabel, type PipelineStageId };

export type NavKey = "dashboard" | "conversations" | "pipeline" | "clients" | "tasks" | "quotes" | "documents" | "analytics" | "team" | "settings";

export type Client = {
  id: number;
  initials: string;
  name: string;
  phone: string;
  email: string;
  pipelineStage: PipelineStageId;
  source: string;
  product: string;
  premium: string;
  updated: string;
  owner: string;
  tone: string;
  dob: string;
  address: string;
  vehicle: string;
  vin: string;
};

export const navItems: Array<{ icon: string; label: string; key: NavKey; count?: number }> = [
  { icon: "▦", label: "Dashboard", key: "dashboard" },
  { icon: "◎", label: "Conversations", key: "conversations", count: 12 },
  { icon: "◇", label: "Pipeline", key: "pipeline" },
  { icon: "○", label: "Clients", key: "clients" },
  { icon: "✓", label: "Tasks", key: "tasks", count: 8 },
  { icon: "▱", label: "Quotes", key: "quotes" },
  { icon: "□", label: "Documents", key: "documents" },
  { icon: "⌁", label: "Analytics", key: "analytics" },
];

export const metrics = [
  { label: "New leads", value: "12", note: "Today", tone: "green", view: "clients" as NavKey },
  { label: "Quotes pending", value: "18", note: "5 due today", tone: "amber", view: "quotes" as NavKey },
  { label: "Ready to bind", value: "7", note: "+3 since yesterday", tone: "blue", view: "pipeline" as NavKey },
  { label: "Overdue tasks", value: "5", note: "Needs attention", tone: "red", view: "tasks" as NavKey },
];

export const attention = [
  { id: 1, initials: "MS", name: "Maya Singh", detail: "Quote follow-up · Aviva", time: "9:30 AM", tag: "Price objection", tone: "amber" },
  { id: 2, initials: "JL", name: "Jordan Lee", detail: "Ready to bind · Auto", time: "10:15 AM", tag: "High intent", tone: "green" },
  { id: 3, initials: "RK", name: "Ravi Kumar", detail: "Missing vehicle ownership", time: "11:00 AM", tag: "Documents", tone: "blue" },
  { id: 4, initials: "AT", name: "Amelia Thompson", detail: "Quote expires tomorrow", time: "1:30 PM", tag: "Follow-up", tone: "purple" },
];

export const conversations = [
  { id: 1, initials: "JL", name: "Jordan Lee", phone: "+1 416 555 0198", message: "Yes, I’d like to go ahead with the Aviva quote.", time: "2m", unread: 2, status: "Ready to bind", tone: "blue" },
  { id: 2, initials: "RK", name: "Ravi Kumar", phone: "+1 647 555 0104", message: "Sent a document", time: "8m", unread: 1, status: "Ownership received", tone: "green" },
  { id: 3, initials: "MS", name: "Maya Singh", phone: "+1 905 555 0122", message: "Is there anything less expensive?", time: "24m", unread: 1, status: "Price objection", tone: "amber" },
  { id: 4, initials: "SN", name: "Sofia Nguyen", phone: "+1 289 555 0151", message: "Can you call me after 4 today?", time: "42m", unread: 0, status: "Follow-up requested", tone: "purple" },
  { id: 5, initials: "DM", name: "Daniel Morgan", phone: "+1 416 555 0184", message: "Thank you, I received the documents.", time: "1h", unread: 0, status: "Policy completed", tone: "green" },
];

export const chatMessages = [
  { id: 1, side: "in", text: "Hi, I’m looking for auto insurance for a 2022 Honda Civic.", time: "9:41 AM" },
  { id: 2, side: "out", text: "Hi Jordan! I’d be happy to help. Please send your driver’s licence and vehicle ownership so we can get started.", time: "9:43 AM" },
  { id: 3, side: "in", text: "Licence_front.jpg", time: "9:49 AM", file: true },
  { id: 4, side: "in", text: "Ownership.pdf", time: "9:50 AM", file: true },
  { id: 5, side: "out", text: "Thanks! I’ve received both documents. I’ll prepare your options and get back to you shortly.", time: "9:53 AM" },
  { id: 6, side: "out", text: "Your best option is Aviva at $318/month, including $2M liability and a $1,000 collision deductible.", time: "11:22 AM" },
  { id: 7, side: "in", text: "Yes, I’d like to go ahead with the Aviva quote.", time: "11:31 AM" },
];

export const clients: Client[] = [
  { id: 1, initials: "JL", name: "Jordan Lee", phone: "+1 416 555 0198", email: "jordan.lee@email.com", pipelineStage: "ready_to_bind", source: "WhatsApp", product: "Auto", premium: "$318/mo", updated: "2 min ago", owner: "Olivia", tone: "blue", dob: "May 14, 1992", address: "88 King Street W, Toronto, ON", vehicle: "2022 Honda Civic Touring", vin: "2HGFE1F9XNH000824" },
  { id: 2, initials: "MS", name: "Maya Singh", phone: "+1 905 555 0122", email: "maya.singh@email.com", pipelineStage: "follow_up", source: "Facebook", product: "Auto", premium: "$475/mo", updated: "24 min ago", owner: "Olivia", tone: "amber", dob: "January 8, 1998", address: "1420 Lakeshore Rd, Mississauga, ON", vehicle: "2020 BMW 330i xDrive", vin: "WBA5R7C08LFH12340" },
  { id: 3, initials: "RK", name: "Ravi Kumar", phone: "+1 647 555 0104", email: "ravi.kumar@email.com", pipelineStage: "documents_received", source: "Referral", product: "Auto + Tenant", premium: "$289/mo", updated: "8 min ago", owner: "Noah", tone: "green", dob: "September 22, 1987", address: "55 Bremner Blvd, Toronto, ON", vehicle: "2019 Toyota RAV4 LE", vin: "2T3ZFREV3KW051177" },
  { id: 4, initials: "AT", name: "Amelia Thompson", phone: "+1 416 555 0177", email: "amelia.t@email.com", pipelineStage: "quote_provided", source: "Website", product: "Auto", premium: "$362/mo", updated: "1 hr ago", owner: "Olivia", tone: "purple", dob: "March 2, 1979", address: "27 Queen Street E, Toronto, ON", vehicle: "2023 Mazda CX-5 GT", vin: "JM3KFBDM7P0121833" },
  { id: 5, initials: "SN", name: "Sofia Nguyen", phone: "+1 289 555 0151", email: "sofia.n@email.com", pipelineStage: "quoting", source: "Instagram", product: "Auto", premium: "—", updated: "42 min ago", owner: "Noah", tone: "purple", dob: "July 19, 2001", address: "809 Dundas St, Oakville, ON", vehicle: "2018 Hyundai Elantra GL", vin: "KMHD84LF9JU601825" },
  { id: 6, initials: "DM", name: "Daniel Morgan", phone: "+1 416 555 0184", email: "daniel.m@email.com", pipelineStage: "policy_completed", source: "Existing client", product: "Auto + Home", premium: "$428/mo", updated: "1 hr ago", owner: "Olivia", tone: "green", dob: "November 30, 1968", address: "341 Avenue Rd, Toronto, ON", vehicle: "2021 Lexus RX350", vin: "2T2HZMDA1MC254716" },
  { id: 7, initials: "EB", name: "Ethan Brown", phone: "+1 647 555 0136", email: "ethan.b@email.com", pipelineStage: "new_lead", source: "WhatsApp", product: "Auto", premium: "—", updated: "2 hr ago", owner: "Unassigned", tone: "amber", dob: "February 6, 1995", address: "19 Yonge Street, Toronto, ON", vehicle: "2020 Kia Forte EX", vin: "3KPF54AD5LE178932" },
];

export const pipelineColumns: Array<{ pipelineStage: PipelineStageId; title: string; color: string; count: number; value: string; cards: Client[] }> = [
  { pipelineStage: "new_lead" as PipelineStageId, title: "New Lead", color: "slate", count: 12, value: "$18.4k", cards: [clients[6], { ...clients[4], name: "Nora Patel", initials: "NP", pipelineStage: "new_lead", premium: "—" }] },
  { pipelineStage: "quoting" as PipelineStageId, title: "Quoting", color: "blue", count: 18, value: "$31.7k", cards: [clients[4], { ...clients[1], name: "Lucas Martin", initials: "LM", pipelineStage: "quoting", premium: "—" }] },
  { pipelineStage: "quote_provided" as PipelineStageId, title: "Quote Provided", color: "purple", count: 9, value: "$16.9k", cards: [clients[3], clients[1]] },
  { pipelineStage: "ready_to_bind" as PipelineStageId, title: "Ready to Bind", color: "green", count: 7, value: "$14.3k", cards: [clients[0], { ...clients[2], name: "Ava Wilson", initials: "AW", pipelineStage: "ready_to_bind", premium: "$344/mo" }] },
  { pipelineStage: "binding" as PipelineStageId, title: "Binding", color: "orange", count: 2, value: "$2.9k", cards: [{ ...clients[2], pipelineStage: "binding" }] },
];

export const initialTasks = [
  { id: 1, client: "Maya Singh", initials: "MS", task: "Follow up on Aviva quote", due: "9:30 AM", date: "Today", priority: "High", status: "To do", owner: "Olivia" },
  { id: 2, client: "Jordan Lee", initials: "JL", task: "Confirm payment details", due: "10:15 AM", date: "Today", priority: "High", status: "To do", owner: "Olivia" },
  { id: 3, client: "Ravi Kumar", initials: "RK", task: "Verify vehicle ownership", due: "11:00 AM", date: "Today", priority: "Medium", status: "In progress", owner: "Noah" },
  { id: 4, client: "Amelia Thompson", initials: "AT", task: "Review expiring quote", due: "1:30 PM", date: "Today", priority: "Medium", status: "To do", owner: "Olivia" },
  { id: 5, client: "Sofia Nguyen", initials: "SN", task: "Call client after 4 PM", due: "4:15 PM", date: "Today", priority: "Low", status: "To do", owner: "Noah" },
  { id: 6, client: "Ethan Brown", initials: "EB", task: "Collect licence and ownership", due: "Yesterday", date: "Overdue", priority: "High", status: "To do", owner: "Olivia" },
];

export const quotes = [
  { id: "QT-2038", client: "Jordan Lee", company: "Aviva", monthly: "$318", annual: "$3,816", coverage: "$2M liability", deductible: "$1,000", status: "Selected", expires: "Sep 16", owner: "Olivia" },
  { id: "QT-2037", client: "Jordan Lee", company: "Pembridge", monthly: "$352", annual: "$4,224", coverage: "$2M liability", deductible: "$1,000", status: "Compared", expires: "Sep 16", owner: "Olivia" },
  { id: "QT-2036", client: "Maya Singh", company: "Aviva", monthly: "$475", annual: "$5,700", coverage: "$2M liability", deductible: "$1,500", status: "Provided", expires: "Aug 23", owner: "Olivia" },
  { id: "QT-2035", client: "Amelia Thompson", company: "Echelon", monthly: "$362", annual: "$4,344", coverage: "$2M liability", deductible: "$1,000", status: "Expiring", expires: "Tomorrow", owner: "Olivia" },
  { id: "QT-2034", client: "Ravi Kumar", company: "Intact", monthly: "$289", annual: "$3,468", coverage: "Auto + tenant", deductible: "$1,000", status: "Selected", expires: "Sep 02", owner: "Noah" },
];

export const documents = [
  { id: 1, name: "Drivers_Licence_Front.jpg", client: "Jordan Lee", type: "Driver licence", received: "Today, 9:49 AM", source: "WhatsApp", processing: "Extracted", verification: "Verified", size: "1.8 MB" },
  { id: 2, name: "Vehicle_Ownership.pdf", client: "Jordan Lee", type: "Vehicle ownership", received: "Today, 9:50 AM", source: "WhatsApp", processing: "Extracted", verification: "Needs review", size: "922 KB" },
  { id: 3, name: "ownership_ravi.jpg", client: "Ravi Kumar", type: "Vehicle ownership", received: "Today, 11:04 AM", source: "WhatsApp", processing: "Extracted", verification: "Needs review", size: "2.2 MB" },
  { id: 4, name: "void_cheque.pdf", client: "Daniel Morgan", type: "Void cheque", received: "Yesterday, 4:18 PM", source: "Upload", processing: "Complete", verification: "Verified", size: "418 KB" },
  { id: 5, name: "signed_application.pdf", client: "Daniel Morgan", type: "Signed application", received: "Yesterday, 4:42 PM", source: "E-signature", processing: "Complete", verification: "Verified", size: "3.1 MB" },
];

export const activity = [
  { time: "11:31 AM", title: "Client is ready to proceed", detail: "AI detected high intent from a WhatsApp reply", type: "ai" },
  { time: "11:22 AM", title: "Quote sent to client", detail: "Aviva · $318/month · Quote QT-2038", type: "quote" },
  { time: "9:52 AM", title: "Vehicle ownership extracted", detail: "VIN and vehicle details are ready for review", type: "document" },
  { time: "9:50 AM", title: "Vehicle ownership received", detail: "Received through WhatsApp", type: "message" },
  { time: "9:49 AM", title: "Driver licence received", detail: "Received through WhatsApp and verified", type: "message" },
  { time: "9:41 AM", title: "Lead created", detail: "New WhatsApp conversation", type: "lead" },
];

export const settingsGroups = [
  { title: "Pipeline stages", subtitle: "13 stages", items: defaultPipelineStages.map((pipelineStage) => pipelineStage.label) },
  { title: "Insurance companies", subtitle: "8 companies", items: ["Aviva", "Pembridge", "Echelon", "Intact", "CAA Insurance"] },
  { title: "Lead sources", subtitle: "7 sources", items: ["WhatsApp direct", "Facebook", "Instagram", "Referral", "Existing client"] },
  { title: "Document types", subtitle: "9 types", items: ["Driver licence", "Vehicle ownership", "Void cheque", "Winter tire photo", "Signed application"] },
];
