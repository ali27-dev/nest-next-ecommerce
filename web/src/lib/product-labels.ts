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
