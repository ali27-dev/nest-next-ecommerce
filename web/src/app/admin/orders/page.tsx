export default function AdminOrdersPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Orders</h1>
      <p className="text-sm text-muted-foreground max-w-md">
        Viewing all customer orders requires a new admin-scoped endpoint on the
        backend (the current GET /orders only returns the logged-in user&apos;s
        own orders). Not built yet — no data is being faked here.
      </p>
    </div>
  );
}
