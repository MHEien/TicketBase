export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  type: "ticket" | "merchandise" | "fee";
  ticketType?: {
    id: string;
    name: string;
  };
  attributes?: Record<string, any>;
}

export interface CartCustomer {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}

export interface Cart {
  id: string;
  eventId: string;
  items: CartItem[];
  customer?: CartCustomer;
  subtotal: number;
  fees: number;
  taxes: number;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}
