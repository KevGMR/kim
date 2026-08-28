export type MenuItem = {
  id: string;
  name: string;
  category: "butchery" | "kitchen";
  price: number;
  unit: "kg" | "piece";
  step: number;
};

export const MENU: MenuItem[] = [
  { id: "beef", name: "Beef, choice cuts", category: "butchery", price: 650, unit: "kg", step: 0.5 },
  { id: "goat", name: "Goat meat", category: "butchery", price: 800, unit: "kg", step: 0.5 },
  { id: "chicken-whole", name: "Whole chicken", category: "butchery", price: 700, unit: "piece", step: 1 },
  { id: "sausages", name: "Beef sausages, 500g pack", category: "butchery", price: 350, unit: "piece", step: 1 },
  { id: "grilled-chicken", name: "Grilled chicken plate", category: "kitchen", price: 450, unit: "piece", step: 1 },
  { id: "ugali-fries", name: "Ugali and fries", category: "kitchen", price: 150, unit: "piece", step: 1 },
];

export type OrderStatus = "placed" | "paid" | "preparing" | "out_for_delivery" | "delivered";

export const STATUS_SEQUENCE: OrderStatus[] = [
  "placed",
  "paid",
  "preparing",
  "out_for_delivery",
  "delivered",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Order placed",
  paid: "Payment confirmed",
  preparing: "Preparing your order",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
};

export type Order = {
  id: string;
  items: { id: string; name: string; price: number; unit: string; qty: number }[];
  total: number;
  phone: string;
  address: string;
  status: OrderStatus;
  createdAt: number;
};
