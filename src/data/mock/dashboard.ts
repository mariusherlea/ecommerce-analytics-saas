export const stats = [
  {
    title: "Total Revenue",
    value: "$12,480",
    change: "+12.5%",
    trend: "up",
  },
  {
    title: "Orders",
    value: "324",
    change: "+8.2%",
    trend: "up",
  },
  {
    title: "Customers",
    value: "198",
    change: "+5.1%",
    trend: "up",
  },
  {
    title: "Avg. Order Value",
    value: "$38.52",
    change: "-1.4%",
    trend: "down",
  },
] as const;

export const salesData = [
  { name: "Mon", revenue: 1200 },
  { name: "Tue", revenue: 1800 },
  { name: "Wed", revenue: 1400 },
  { name: "Thu", revenue: 2200 },
  { name: "Fri", revenue: 2600 },
  { name: "Sat", revenue: 1900 },
  { name: "Sun", revenue: 1380 },
];

export const topProducts = [
  {
    id: "1",
    name: "Premium T-Shirt",
    sales: 84,
    revenue: "$2,520",
  },
  {
    id: "2",
    name: "Minimal Hoodie",
    sales: 63,
    revenue: "$3,150",
  },
  {
    id: "3",
    name: "Black Cap",
    sales: 41,
    revenue: "$820",
  },
  {
    id: "4",
    name: "Classic Sneakers",
    sales: 29,
    revenue: "$2,900",
  },
];

export const recentOrders = [
  {
    id: "#1001",
    customer: "mario@example.com",
    status: "Paid",
    total: "$120.00",
  },
  {
    id: "#1002",
    customer: "ana@example.com",
    status: "Pending",
    total: "$89.00",
  },
  {
    id: "#1003",
    customer: "dan@example.com",
    status: "Paid",
    total: "$56.50",
  },
  {
    id: "#1004",
    customer: "elena@example.com",
    status: "Shipped",
    total: "$210.00",
  },
  {
    id: "#1005",
    customer: "alex@example.com",
    status: "Cancelled",
    total: "$45.00",
  },
];