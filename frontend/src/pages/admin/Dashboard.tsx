import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

import { PhilippinePeso, ShoppingCart, ShoppingBag, User } from "lucide-react";

const cardData = [
  {
    icon: <PhilippinePeso />,
    title: "Total Sales",
    description: "100",
    showIcon: true,
  },
  {
    icon: <ShoppingCart />,
    title: "Transaction",
    description: "100",
    showIcon: false,
  },
  {
    icon: <ShoppingBag />,
    title: "Products",
    description: "100",
    showIcon: false,
  },
  {
    icon: <User />,
    title: "Customers",
    description: "100",
    showIcon: false,
  },
];

const Dashboard = () => {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {cardData.map((item, index) => (
          <Card key={index}>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="bg-primary p-3 rounded-lg text-white">
                  {item.icon}
                </div>
                <div className="flex items-center">
                  {item.showIcon && item.icon}
                  <div className="text-2xl font-bold">{item.description}</div>
                </div>
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader className="font-bold">Recent Transactions</CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>2022-01-01</TableCell>
                  <TableCell>Cash</TableCell>
                  <TableCell>100</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <div className="flex gap-4">
            <CardHeader className="w-1/2 font-bold">
              Top Selling Products
            </CardHeader>
            <p className="w-1/3 text-right text-sm">View All</p>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>Ice Cream</TableCell>
                  <TableCell>Dessert</TableCell>
                  <TableCell>100</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="flex gap-4">
            <CardHeader className="w-1/2 font-bold">Customer</CardHeader>
            <p className="w-1/3 text-right text-sm">View All</p>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john.doe@example.com</TableCell>
                  <TableCell>1234567890</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <div className="flex gap-4">
            <CardHeader className="w-1/2 font-bold">Users</CardHeader>
            <p className="w-1/3 text-right text-sm">View All</p>
          </div>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>1</TableCell>
                  <TableCell>John Doe</TableCell>
                  <TableCell>john.doe@example.com</TableCell>
                  <TableCell>Admin</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
