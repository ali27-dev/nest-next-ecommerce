export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  size?: string;
  productId: string;
  product?: { id: string; name: string; imageUrl: string | null };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  shippingAddress: string | null;
  createdAt: string;
  orderItems: OrderItem[];
  payment?: Payment | null;
}

export interface Payment {
  id: string;
  amount: string;
  status: string;
  paymentMethod: string;
  transactionId: string | null;
  rejectionReason: string | null;
  orderId: string;
  order?: Order;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: string;
  shippingAddress: string | null;
  createdAt: string;
  orderItems: OrderItem[];
  payment?: Payment | null;
  user?: {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}
