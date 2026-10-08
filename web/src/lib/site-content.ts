export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "How do I place an order?",
    answer:
      "Browse products, add items to your cart, and proceed to checkout. Choose Cash on Delivery, EasyPaisa, or Bank Transfer, then confirm your shipping address to complete the order.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD), EasyPaisa, and Bank Transfer. For online payments, submit your transaction ID after checkout and our team will verify it before processing your order.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "Orders within major cities typically arrive in 3–5 business days. Remote areas may take 5–7 business days. You will receive updates as your order moves through processing and dispatch.",
  },
  {
    question: "Can I cancel my order?",
    answer:
      "Yes. You can cancel from your Orders page while the order is still pending or processing. Once an order has been dispatched, cancellation is no longer available — please contact support for help.",
  },
  {
    question: "What is your return policy?",
    answer:
      "Unworn items with original tags may be exchanged within 7 days of delivery. Items on sale, perfumes, and customized products are final sale unless defective. See our Shipping & Returns page for full details.",
  },
  {
    question: "How do I track my order?",
    answer:
      "Log in and open My Orders to see real-time status updates — pending, processing, delivered, or cancelled. For additional help, open a support ticket from your account.",
  },
  {
    question: "Do you offer size exchanges?",
    answer:
      "Yes, subject to stock availability. Contact us within 7 days of delivery with your order number and the size you need. Exchanges are free for defective or wrong items; size swaps may incur a delivery fee.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "Use the Contact page, email support@farzarastore.com, or open a support ticket from your account. Our team typically responds within 24 hours on business days.",
  },
];

export const shippingInfo = {
  delivery: [
    "Standard delivery across Pakistan in 3–7 business days.",
    "Order processing begins after payment verification (for online payments) or order confirmation (for COD).",
    "A shipping confirmation is sent when your order leaves our warehouse.",
    "Ensure your phone number and address are correct at checkout to avoid delays.",
  ],
  returns: [
    "Returns and exchanges accepted within 7 days of delivery for unworn items with tags attached.",
    "Sale items, opened perfumes, and customized products are not eligible unless defective.",
    "To start a return, contact support with your order number and reason.",
    "Refunds for approved returns are processed within 5–7 business days to the original payment method.",
  ],
  cod: [
    "Pay in cash when your order arrives at your doorstep.",
    "Please keep exact change ready when possible.",
    "COD is available for orders within Pakistan.",
  ],
};

export const contactInfo = {
  email: "support@farzarastore.com",
  phone: "+92 300 000 0000",
  whatsapp: "923000000000",
  hours: "Monday – Saturday, 10:00 AM – 7:00 PM (PKT)",
  address: "Lahore, Pakistan",
};

export const aboutContent = {
  intro:
    "Farzara Store is a Pakistan-based fashion destination offering menswear, womenswear, kids' clothing, watches, shoes, and perfumes — curated for everyday style and special occasions.",
  values: [
    {
      title: "Quality first",
      description:
        "We source fabrics and products that meet our standards for comfort, durability, and finish.",
    },
    {
      title: "Local convenience",
      description:
        "COD, EasyPaisa, and bank transfer make shopping accessible wherever you are in Pakistan.",
    },
    {
      title: "Customer care",
      description:
        "Our support team is here before and after your purchase — from sizing advice to order tracking.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Payment accounts shown on the payment page.
// TODO: replace the placeholder values below with your real account details.
// ---------------------------------------------------------------------------
export interface PaymentAccountField {
  label: string;
  value: string;
  copyable?: boolean;
}

export interface PaymentAccount {
  label: string;
  fieldLabel: string;
  fieldHint: string;
  steps: string[];
  details: PaymentAccountField[];
}

export const paymentAccounts: Record<"EASY_PAISA" | "BANK_TRANSFER", PaymentAccount> = {
  EASY_PAISA: {
    label: "EasyPaisa",
    fieldLabel: "EasyPaisa Transaction ID",
    fieldHint: "Found in the confirmation SMS or the app's transaction history.",
    steps: [
      "Open the EasyPaisa app and choose Send Money.",
      "Send the exact order total to the account below.",
      "Copy the Transaction ID from the confirmation and paste it here.",
    ],
    details: [
      { label: "Account title", value: "Farzara Store" },
      { label: "EasyPaisa number", value: "03XX-XXXXXXX", copyable: true },
    ],
  },
  BANK_TRANSFER: {
    label: "Bank Transfer",
    fieldLabel: "Bank Reference Number",
    fieldHint: "Use the reference / transaction number from your bank receipt.",
    steps: [
      "Open your banking app or visit a branch.",
      "Transfer the exact order total to the account below.",
      "Copy the reference number from the receipt and paste it here.",
    ],
    details: [
      { label: "Bank", value: "Your Bank Name" },
      { label: "Account title", value: "Farzara Store" },
      { label: "IBAN", value: "PK00XXXX0000000000000000", copyable: true },
    ],
  },
};
