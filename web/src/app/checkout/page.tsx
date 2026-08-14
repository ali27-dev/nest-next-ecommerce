"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { apiAuthPost, UnauthorizedError } from "@/lib/api";
import { Order } from "@/types/order";
import { OrderSummaryPanel } from "@/components/checkout/order-summary-pannel";
import { Spinner } from "@/components/ui/spinner";

const paymentMethods = [
  { value: "COD", label: "Cash on Delivery (COD)" },
  { value: "EASY_PAISA", label: "EasyPaisa" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
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

  useEffect(() => {
    if (loading) return; // don't redirect away mid-submit
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
        });
      }

      const order = await apiAuthPost<Order>("/orders/checkout", {
        shippingAddress,
      });

      if (method === "COD") {
        await apiAuthPost("/payments", {
          orderId: order.id,
          paymentMethod: "COD",
        });
        router.push(`/orders/${order.id}?placed=1`);
      } else {
        router.push(`/checkout/pay?orderId=${order.id}&method=${method}`);
      }
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        router.push("/login?redirect=/checkout&expired=1");
        return;
      }
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (lines.length === 0) return null;

  return (
    <div className="px-6 md:px-10 py-8">
      <h1 className="text-xl font-semibold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-10">
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
                  className="flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer has-[:checked]:border-foreground"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={m.value}
                    checked={method === m.value}
                    onChange={() => setMethod(m.value)}
                  />
                  <span className="text-sm font-medium">{m.label}</span>
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
            {loading ? "Placing order..." : "Place Order"}
          </Button>
        </div>

        <OrderSummaryPanel />
      </form>
    </div>
  );
}
