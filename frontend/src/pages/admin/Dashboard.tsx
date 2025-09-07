const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { 
  PhilippinePeso, 
  ShoppingCart, 
  ShoppingBag, 
  User,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingAnimation from "@/components/LoadingAnimation";
import axios from "axios";

interface DashboardStats {
  totalSales: number;
  totalTransactions: number;
  totalProducts: number;
  totalCustomers: number;
  salesGrowth: number;
  transactionGrowth: number;
}

interface Product {
  product_id: number;
  product_name: string;
  category_id: number;
  price: number;
  quantity: number;
  image: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalTransactions: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesGrowth: 0,
    transactionGrowth: 0,
  });

  // Fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsResponse = await axios.get(`${API_URL}/api/products`, {
          headers: { "x-api-key": API_KEY },
        });
        setProducts(productsResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get(`${API_URL}/api/categories`, {
          headers: { "x-api-key": API_KEY },
        });
        setCategories(categoriesResponse.data);

        // Calculate stats
        const totalProducts = productsResponse.data.length;
        const totalSales = productsResponse.data.reduce((sum: number, product: Product) => 
          sum + (product.price * (product.quantity || 0)), 0
        );

        setStats({
          totalSales,
          totalTransactions: Math.floor(totalProducts * 0.3), // Mock data
          totalProducts,
          totalCustomers: Math.floor(totalProducts * 0.8), // Mock data
          salesGrowth: 12.5, // Mock growth data
          transactionGrowth: 8.2, // Mock growth data
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cardData = [
    {
      icon: <PhilippinePeso className="h-6 w-6" />,
      title: "Total Sales",
      value: `₱${stats.totalSales.toLocaleString()}`,
      change: `+${stats.salesGrowth}%`,
      changeType: "positive" as const,
      description: "from last month",
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Transactions",
      value: stats.totalTransactions.toLocaleString(),
      change: `+${stats.transactionGrowth}%`,
      changeType: "positive" as const,
      description: "from last month",
    },
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      title: "Products",
      value: stats.totalProducts.toLocaleString(),
      change: "+2.1%",
      changeType: "positive" as const,
      description: "from last month",
    },
    {
      icon: <User className="h-6 w-6" />,
      title: "Customers",
      value: stats.totalCustomers.toLocaleString(),
      change: "+5.4%",
      changeType: "positive" as const,
      description: "from last month",
    },
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      date: "2024-01-15",
      customer: "Walk-in Customer",
      amount: 1250.00,
      status: "completed",
    },
    {
      id: "TXN-002",
      date: "2024-01-15",
      customer: "John Doe",
      amount: 850.50,
      status: "completed",
    },
    {
      id: "TXN-003",
      date: "2024-01-14",
      customer: "Jane Smith",
      amount: 2100.75,
      status: "pending",
    },
  ];

  if (loading) {
    return <LoadingAnimation />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((item, index) => (
          <Card key={index} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {item.changeType === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={item.changeType === "positive" ? "text-green-500" : "text-red-500"}>
                  {item.change}
                </span>
                <span className="ml-1">{item.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">{transaction.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                        {transaction.date}
                      </div>
                    </TableCell>
                    <TableCell>{transaction.customer}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={transaction.status === "completed" ? "default" : "secondary"}
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₱{transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {products.slice(0, 5).map((product, index) => (
              <div key={product.product_id} className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      #{index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {product.product_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {categories.find(cat => cat.category_id === product.category_id)?.category_name || "Uncategorized"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">₱{product.price}</p>
                  <p className="text-xs text-muted-foreground">
                    Stock: {product.quantity || 0}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Categories</CardTitle>
              <Button variant="ghost" size="sm">
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.slice(0, 6).map((category) => {
                const categoryProducts = products.filter(p => p.category_id === category.category_id);
                const categoryValue = categoryProducts.reduce((sum, p) => sum + (p.price * (p.quantity || 0)), 0);
                
                return (
                  <div key={category.category_id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{category.category_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {categoryProducts.length} products
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₱{categoryValue.toLocaleString()}</p>
                      <div className="flex items-center text-xs text-green-500">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Process Transaction
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <User className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
