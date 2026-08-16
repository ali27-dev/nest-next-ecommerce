"use client";

import { useEffect, useState } from "react";
import { Package, Tags, Shirt, CreditCard } from "lucide-react";
import { apiFetch, apiAuthGet } from "@/lib/api";
import { Category, Fabric, ProductListResponse } from "@/types/product";
import { Payment } from "@/types/order";

import { FullPageSpinner } from "@/components/ui/spinner";
import Link from "next/link";
import { StatCard } from "@/components/admin /stat-card";

export default function AdminDashboardPage() {
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [fabrics, setFabrics] = useState<Fabric[] | null>(null);
  const [pendingPayments, setPendingPayments] = useState<Payment[] | null>(
    null
  );

  useEffect(() => {
    apiFetch<ProductListResponse>("/products?limit=1").then((r) =>
      setProductCount(r.meta.total)
    );
    apiFetch<Category[]>("/categories").then(setCategories);
    apiFetch<Fabric[]>("/fabrics").then(setFabrics);
    apiAuthGet<Payment[]>("/payments/admin/pending")
      .then(setPendingPayments)
      .catch(() => setPendingPayments([]));
  }, []);

  const loading =
    productCount === null || !categories || !fabrics || !pendingPayments;
  if (loading) return <FullPageSpinner />;

  return (
    <div>
      <h1 className="text-sm text-muted-foreground mb-6">
        Overview of your store
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Products"
          value={productCount}
          icon={Package}
          highlight
        />
        <StatCard label="Categories" value={categories.length} icon={Tags} />
        <StatCard label="Fabrics" value={fabrics.length} icon={Shirt} />
        <StatCard
          label="Pending Payments"
          value={pendingPayments.length}
          icon={CreditCard}
        />
      </div>

      {pendingPayments.length > 0 && (
        <div className="rounded-xl border bg-background p-5 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">
              Payments Awaiting Verification
            </h2>
            <Link
              href="/admin/payments"
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            {pendingPayments.slice(0, 5).map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">
                  {p.order?.orderNumber ?? p.orderId} —{" "}
                  {p.paymentMethod.replace("_", " ")}
                </span>
                <span className="font-mono">
                  Rs {Number(p.amount).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-dashed p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Revenue trends, order volume charts, and traffic analytics need
          dedicated backend aggregation endpoints that don&apos;t exist yet — no
          data is being invented here to fill this space.
        </p>
      </div>
    </div>
  );
}
