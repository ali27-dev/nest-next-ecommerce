import type { Product } from "@/types/product";

export function pieceCountLabel(value: Product["pieceCount"]): string | null {
  switch (value) {
    case "ONE_PIECE":
      return "1 Piece";
    case "TWO_PIECE":
      return "2 Piece";
    case "THREE_PIECE":
      return "3 Piece";
    default:
      return null;
  }
}

export function seasonLabel(value: Product["season"]): string | null {
  switch (value) {
    case "SUMMER":
      return "Summer";
    case "WINTER":
      return "Winter";
    case "ALL_SEASON":
      return "All Season";
    default:
      return null;
  }
}

export function stitchTypeLabel(value: Product["stitchType"]): string | null {
  switch (value) {
    case "STITCHED":
      return "Stitched";
    case "UNSTITCHED":
      return "Unstitched";
    default:
      return null;
  }
}

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
    case "FAILED":
      return { label: "Failed", className: "bg-red-100 text-red-800" };
    default:
      return { label: status, className: "bg-muted text-muted-foreground" };
  }
}

// unchanged below
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
