const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useState, useEffect } from "react";
import kopiko from "@/assets/kopiko.jfif";

import { Pencil, Trash, Plus, Cross } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingAnimation from "@/components/LoadingAnimation";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";

import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./DeleteProductModal";

export type Product = {
  product_id: number;
  product_name: string;
  category_id: number;
  price: number;
  image: string;
};

export type Category = {
  category_id: number;
  category_name: string;
};

const Products = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // fetching categories
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const [products, setProducts] = useState<Product[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
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

      {loading ? (
        <LoadingAnimation />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {products.length > 0 ? (
            products.map((product) => (
              <Card className="gap-2" key={product.product_id} onClick={() => navigate(`/products/${encodeURIComponent(product.product_name.toLowerCase().replace(/\s+/g, '-'))}`, {
                state: { product, categories}
              })}>
                <CardHeader className="">
                  <img
                    src={product.image || kopiko}
                    alt={product.product_name || "Product Image"}
                    className="h-50 w-full object-cover bg-none"
                  />
                </CardHeader>
                <CardContent className="font-bold">
                  {categories.find(
                    (cat) => cat.category_id === product.category_id
                  )?.category_name || "Uncategorized"}
                </CardContent>
                <CardContent className="font-bold">
                  {product.product_name}
                </CardContent>
                <CardContent>₱{product.price}</CardContent>
                <div className="flex justify-center items-center">
                  <CardFooter>
                    <Pencil 
                      className="h-5 w-5 cursor-pointer hover:text-blue-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/products/edit/${product.product_id}`);
                      }}
                    />
                  </CardFooter>
                  <CardFooter>
                    <Trash 
                      className="h-5 w-5 cursor-pointer hover:text-red-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setShowDeleteModal(true);
                      }}
                    />
                  </CardFooter>
                </div>
              </Card>
            ))
          ) : (
            <p className="col-span-4 flex justify-center items-center">No products found.</p>
          )}
        </div>
      )}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onUpdated={fetchProducts}
          categories={categories}
        />
      )}
      {showDeleteModal && selectedProduct && (
        <DeleteProductModal
          product={selectedProduct}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          onUpdated={fetchProducts}
        />
      )}
    </div>
  );
};

export default Products;
