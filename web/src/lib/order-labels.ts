export function orderStatusLabel(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PENDING":
      return { label: "Pending", className: "bg-amber-100 text-amber-800" };
    case "PROCESSING":
      return { label: "Processing", className: "bg-blue-100 text-blue-800" };
    case "DELIVERED":
      return { label: "Delivered", className: "bg-green-100 text-green-800" };
    case "CANCELLED":
      return { label: "Cancelled", className: "bg-red-100 text-red-800" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
}

export function paymentStatusLabel(status: string): {
  label: string;
  className: string;
} {
  switch (status) {
    case "PENDING":
      return {
        label: "Awaiting Verification",
        className: "bg-amber-100 text-amber-800",
      };
    case "COMPLETE":
      return { label: "Paid", className: "bg-green-100 text-green-800" };
    case "FAILED":
      return { label: "Failed", className: "bg-red-100 text-red-800" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
}
