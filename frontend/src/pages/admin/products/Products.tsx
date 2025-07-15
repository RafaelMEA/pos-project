import { useState } from "react";
import kopiko from "@/assets/kopiko.jfif";

import { Pencil, Trash, Plus, Cross } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import AddProductModal from "./AddProductModal";

const Products = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  return (
    <div className="mb-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      <div className="flex gap-4 items-center justify-between mb-4">
        <Input placeholder="Search product..." />
        <Button
          onClick={() => {
            setShowAddModal(true);
          }}
        >
          <Plus className="mr-1 text-white" />
          Add Product
        </Button>
        <Button>
          <Cross className="mr-1 text-white" />
          Recover Products
        </Button>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card className="gap-2">
          <CardHeader className=''>
            <img src={kopiko} alt="Kopiko" className="h-full w-full object-cover bg-none"/>
          </CardHeader>
          <CardContent className="font-bold">Category Name</CardContent>
          <CardContent className="font-bold">Kopiko</CardContent>
          <CardContent>Price</CardContent>
          <div className="flex justify-center items-center">
            <CardFooter>
              <Pencil className="h-5 w-5" />
            </CardFooter>
            <CardFooter>
              <Trash className="h-5 w-5" />
            </CardFooter>
          </div>
        </Card>
      </div>
      {showAddModal && (
        <AddProductModal onClose={() => setShowAddModal(false)} onUpdated={() => setShowAddModal(false)} />
      )}
    </div>
  );
};

export default Products;
