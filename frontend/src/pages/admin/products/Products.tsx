// frontend/src/pages/admin/products/Products.tsx
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useState, useEffect, useCallback } from "react";
import kopiko from "@/assets/kopiko.jfif";
import { Pencil, Trash, Plus, ArrowDownUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AddProductModal from "./AddProductModal";
import DeleteProductModal from "./DeleteProductModal";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

export type Product = {
  product_id: number;
  product_name: string;
  category_id: number;
  price: number;
  image: string;
  created_at?: string;
  updated_at?: string;
};

export type Category = {
  category_id: number;
  category_name: string;
};

type SortField = "product_name" | "price" | "category";
type SortDirection = "asc" | "desc";

// Custom hook for data fetching
const useProductData = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: { "x-api-key": API_KEY },
      });
      setCategories(response.data);
    } catch (err) {
      const error = err as AxiosError;
      setError("Failed to load categories");
      console.error("Error fetching categories:", error.message);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: { "x-api-key": API_KEY },
      });
      setProducts(response.data);
    } catch (err) {
      const error = err as AxiosError;
      setError("Failed to load products");
      console.error("Error fetching products:", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    categories,
    products,
    error,
    fetchCategories,
    fetchProducts
  };
};

// Product Card Component
interface ProductCardProps {
  product: Product;
  categories: Category[];
  onEdit: (productId: number) => void;
  onDelete: (product: Product) => void;
}

const ProductCard = ({ product, categories, onEdit, onDelete }: ProductCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      onClick={() => navigate(`/products/${encodeURIComponent(product.product_name.toLowerCase().replace(/\s+/g, '-'))}`, {
        state: { product, categories }
      })}
    >
      <CardHeader className="p-0 border-b">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={product.image || kopiko}
            alt={product.product_name || "Product Image"}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = kopiko;
              e.currentTarget.classList.add("object-contain", "p-4");
            }}
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2 font-medium">
          {categories.find(cat => cat.category_id === product.category_id)?.category_name || "Uncategorized"}
        </Badge>
        <h3 className="font-bold text-lg truncate mb-1" title={product.product_name}>
          {product.product_name}
        </h3>
        <p className="text-primary font-semibold text-base">
          ₱{product.price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(product.product_id);
          }}
          aria-label={`Edit ${product.product_name}`}
        >
          <Pencil className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="text-xs"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(product);
          }}
          aria-label={`Delete ${product.product_name}`}
        >
          <Trash className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

// Product List Component
interface ProductListProps {
  products: Product[];
  categories: Category[];
  onEdit: (productId: number) => void;
  onDelete: (product: Product) => void;
}

const ProductList = ({ products, categories, onEdit, onDelete }: ProductListProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {products.length > 0 ? (
      products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))
    ) : (
      <div className="col-span-4 flex flex-col items-center justify-center py-12">
        <div className="text-2xl mb-2">📭</div>
        <p className="text-lg font-medium text-gray-500">No products found</p>
        <p className="text-sm text-muted-foreground mt-1">Try adjusting your search or filters</p>
      </div>
    )}
  </div>
);

const Products = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("product_name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const {
    loading,
    categories,
    products,
    error,
    fetchCategories,
    fetchProducts
  } = useProductData();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(product => product.category_id === selectedCategory);
    }
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(product => 
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      switch(sortField) {
        case "product_name":
          return sortDirection === "asc" 
            ? a.product_name.localeCompare(b.product_name) 
            : b.product_name.localeCompare(a.product_name);
        case "price":
          return sortDirection === "asc" 
            ? a.price - b.price 
            : b.price - a.price;
        case "category":
          const categoryA = categories.find(cat => cat.category_id === a.category_id)?.category_name || "";
          const categoryB = categories.find(cat => cat.category_id === b.category_id)?.category_name || "";
          return sortDirection === "asc" 
            ? categoryA.localeCompare(categoryB) 
            : categoryB.localeCompare(categoryA);
        default:
          return 0;
      }
    });
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortField, sortDirection, categories]);

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === "asc" ? "desc" : "asc");
  };

  const handleEditProduct = (productId: number) => {
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const refreshData = () => {
    fetchProducts();
    fetchCategories();
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground mt-1">
            View, edit, and manage your product inventory
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex-1 md:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <Input 
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="md:col-span-2"
          aria-label="Search products"
        />
        
        <Select
          value={selectedCategory === "all" ? "all" : String(selectedCategory)}
          onValueChange={(value) => setSelectedCategory(value === "all" ? "all" : Number(value))}
        >
          <SelectTrigger className="md:col-span-2">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem 
                key={category.category_id} 
                value={String(category.category_id)}
              >
                {category.category_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-2 md:col-span-2">
          <Select
            value={sortField}
            onValueChange={(value) => setSortField(value as SortField)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="product_name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={toggleSortDirection}
            aria-label={`Sort ${sortDirection === "asc" ? "descending" : "ascending"}`}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-0">
                <Skeleton className="h-48 w-full rounded-none" />
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="flex justify-center p-4">
                <Skeleton className="h-8 w-8 rounded-full mr-4" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {error && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-lg font-medium mb-2">Error loading products</p>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button variant="outline" onClick={refreshData}>
            Retry
          </Button>
        </div>
      )}
      
      {!loading && !error && (
        <ProductList 
          products={filteredProducts} 
          categories={categories}
          onEdit={handleEditProduct}
          onDelete={handleDeleteProduct}
        />
      )}

      {/* Modals */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onUpdated={refreshData}
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
          onUpdated={refreshData}
        />
      )}
    </div>
  );
};

export default Products;
