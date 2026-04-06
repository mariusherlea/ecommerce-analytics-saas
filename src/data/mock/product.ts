export type ProductItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "Active" | "Low Stock" | "Out of Stock";
};

export const products: ProductItem[] = [
  {
    id: "PRD-001",
    name: "Premium T-Shirt",
    category: "Sport wear",
    price: "$30.00",
    stock: 48,
    status: "Active",
  },
  {
    id: "PRD-002",
    name: "Minimal Hoodie",
    category: "Hood",
    price: "$50.00",
    stock: 12,
    status: "Low Stock",
  },
  {
    id: "PRD-003",
    name: "Black Cap",
    category: "Hood",
    price: "$20.00",
    stock: 0,
    status: "Out of Stock",
  },
  {
    id: "PRD-004",
    name: "Classic Sneakers",
    category: "Shoes",
    price: "$100.00",
    stock: 34,
    status: "Active",
  },
 
];