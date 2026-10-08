"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { apiAuthPost, UnauthorizedError } from "@/lib/api";
import { Order } from "@/types/order";
import { OrderSummaryPanel } from "@/components/checkout/order-summary-pannel";
import { Spinner } from "@/components/ui/spinner";

const paymentMethods = [
  {
    value: "COD",
    label: "Cash on Delivery (COD)",
    hint: "Pay in cash when your order arrives.",
  },
  {
    value: "EASY_PAISA",
    label: "EasyPaisa",
    hint: "You'll get our EasyPaisa account details on the next step.",
  },
  {
    value: "BANK_TRANSFER",
    label: "Bank Transfer",
    hint: "You'll get our bank account details on the next step.",
  },
] as const;

export default function CheckoutPage() {
  const { user, isLoggedIn } = useAuth();
  const { lines, clear } = useCart();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] =
    useState<(typeof paymentMethods)[number]["value"]>("COD");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Set once the order exists. The cart is emptied right after, which would
  // otherwise trigger the "empty cart -> /cart" redirect below and override
  // our navigation to the payment page.
  const orderPlacedRef = useRef(false);

  useEffect(() => {
    if (loading || orderPlacedRef.current) return; // don't redirect mid-submit / after order
    if (!isLoggedIn) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (lines.length === 0) {
      router.push("/cart");
    }
  }, [isLoggedIn, lines.length, loading, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Coming soon: Order has a single shippingAddress text field — a real
    // schema would split this into firstName/lastName/phone/city columns.
    // For now the delivery form folds into one formatted address string.
    const shippingAddress = [
      `${firstName} ${lastName}`,
      apartment ? `${address}, ${apartment}` : address,
      `${city}${postalCode ? ` ${postalCode}` : ""}`,
      `Phone: ${phone}`,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      for (const line of lines) {
        await apiAuthPost("/cart/items", {
          productId: line.product.id,
          quantity: line.quantity,
          size: line.size ?? undefined,
        });
      }

      const order = await apiAuthPost<Order>("/orders/checkout", {
        shippingAddress,
      });

      // The order has already atomically consumed the server cart and stock.
      // Block the empty-cart redirect, then clear the local mirror so the
      // order cannot be submitted twice.
      orderPlacedRef.current = true;
      clear();

      if (method === "COD") {
        try {
          await apiAuthPost("/payments", {
            orderId: order.id,
            paymentMethod: "COD",
          });
        } catch {
          // Order exists; the order page lets the customer finish payment.
        }
        router.push(`/orders/${order.id}?placed=1`);
      } else {
        router.push(`/checkout/pay?orderId=${order.id}&method=${method}`);
      }
      // Keep the button in its loading state until the new page takes over.
      return;
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        router.push("/login?redirect=/checkout&expired=1");
      } else {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
      setLoading(false);
    }
  }

  if (lines.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl mx-auto">
      <h1 className="text-xl md:text-2xl font-semibold mb-6">Checkout</h1>

      <form
        onSubmit={handleSubmit}
        className="grid md:grid-cols-3 gap-8 md:gap-10"
      >
        <div className="md:col-span-2 flex flex-col gap-8">
          <section>
            <h2 className="text-sm font-semibold mb-3">Contact</h2>
            <Input
              value={user?.email ?? ""}
              disabled
              className="h-11 bg-muted"
            />
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-3">Delivery</h2>
            <div className="grid grid-cols-2 gap-3">
              <Input
                required
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="h-11"
              />
              <Input
                required
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="h-11"
              />
              <Input
                required
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="h-11 col-span-2"
              />
              <Input
                placeholder="Apartment, suite, etc. (optional)"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="h-11 col-span-2"
              />
              <Input
                required
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-11"
              />
              <Input
                placeholder="Postal code (optional)"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className="h-11"
              />
              <Input
                required
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 col-span-2"
              />
            </div>
          </section>

          <section>
            <h2 className="text-sm font-semibold mb-3">Payment</h2>
            <p className="text-xs text-muted-foreground mb-3">
              All transactions are secure.
            </p>
            <div className="flex flex-col gap-2">
              {paymentMethods.map((m) => (
                <label
                  key={m.value}
                  className="flex items-start gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-colors has-[:checked]:border-foreground has-[:checked]:bg-muted/40"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    checked={method === m.value}
                    onChange={() => setMethod(m.value)}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-medium">
                      {m.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {m.hint}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </section>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full md:w-fit md:px-12"
          >
            {loading && <Spinner className="mr-2" />}
            {loading
              ? "Placing order..."
              : method === "COD"
              ? "Place Order"
              : "Continue to Payment"}
          </Button>
        </div>

        <OrderSummaryPanel />
      </form>
    </div>
  );
}
