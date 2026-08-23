export type TicketCategory = "PRODUCT" | "DELIVERY" | "PAYMENT" | "OTHER";
export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";

export interface SupportMessage {
  id: string;
  message: string;
  isFromAdmin: boolean;
  createdAt: string;
  author?: { firstName: string | null; lastName: string | null; email: string };
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  orderId: string | null;
  order?: { id: string; orderNumber: string } | null;
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}
