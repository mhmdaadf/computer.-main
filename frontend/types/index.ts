export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

export interface Product {
  id: number;
  category: Category;
  name: string;
  slug: string;
  description: string;
  price: string;
  stock: number;
  brand: string;
  compatibility_tags: string[];
  image: string | null;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  subtotal: string;
}

export interface Cart {
  id: number;
  is_active: boolean;
  items: CartItem[];
  total_price: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  product: number | null;
  product_name: string;
  unit_price: string;
  quantity: number;
  compatibility_snapshot: string[];
  line_total: string;
}

export interface Order {
  id: number;
  status: "PENDING" | "PAID" | "SHIPPED" | "DELIVERED";
  total_price: string;
  address: number | null;
  shipping_full_text: string;
  created_at: string;
  items: OrderItem[];
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  full_name: string;
  is_staff?: boolean;
}

export interface Address {
  id: number;
  label: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
}
