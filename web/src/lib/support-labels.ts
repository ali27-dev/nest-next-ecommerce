export function ticketStatusLabel(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "OPEN":
      return { label: "Open", className: "bg-amber-100 text-amber-800" };
    case "IN_PROGRESS":
      return { label: "In Progress", className: "bg-blue-100 text-blue-800" };
    case "RESOLVED":
      return { label: "Resolved", className: "bg-green-100 text-green-800" };
    case "CLOSED":
      return { label: "Closed", className: "bg-muted text-muted-foreground" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
}

export function ticketCategoryLabel(category: string): string {
  switch (category) {
    case "PRODUCT":
      return "Product";
    case "DELIVERY":
      return "Delivery";
    case "PAYMENT":
      return "Payment";
    case "OTHER":
      return "Other";
    default:
      return category;
  }
}
