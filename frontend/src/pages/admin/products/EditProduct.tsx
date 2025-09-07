const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { uploadImage } from "@/lib/uploadImage";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

// components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import LoadingAnimation from "@/components/LoadingAnimation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAlert } from "@/contexts/AlertContext";

import axios from "axios";

import PictureInput from "@/components/ui/PictureInput";

export type Product = {
  product_id: number;
  product_name: string;
  product_details?: string;
  category_id: number;
  price: number;
  quantity?: number;
  supplier?: string;
  image: string;
};

import type { Category } from "./Products";

const formSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_image: z.instanceof(File).optional(),
  product_details: z.string().min(1, "Product details is required"),
  product_price: z.coerce.number().min(1, "Product price is required"),
  product_quantity: z.coerce.number().min(1, "Product quantity is required"),
  product_supplier: z.string().min(1, "Product supplier is required"),
  product_category: z.string().min(1, "Product category is required"),
});

type FormData = z.infer<typeof formSchema>;

const EditProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addAlert } = useAlert();
  
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // Fetch product and categories data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await axios.get(`${API_URL}/api/categories`, {
          headers: {
            "x-api-key": API_KEY,
          },
        });
        setCategories(categoriesResponse.data);

        // Fetch products to find the one we're editing
        const productsResponse = await axios.get(`${API_URL}/api/products`, {
          headers: {
            "x-api-key": API_KEY,
          },
        });
        
        const foundProduct = productsResponse.data.find((p: Product) => 
          p.product_id.toString() === id
        );
        
        if (foundProduct) {
          setProduct(foundProduct);
          // Set form default values
          form.reset({
            product_name: foundProduct.product_name,
            product_details: foundProduct.product_details || "",
            product_price: foundProduct.price,
            product_quantity: foundProduct.quantity || 1,
            product_supplier: foundProduct.supplier || "",
            product_category: foundProduct.category_id.toString(),
          });
        } else {
          addAlert("error", "Product Not Found", "The product you're trying to edit was not found.");
          navigate("/products");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        addAlert("error", "Error", "Failed to load product data.");
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, form, addAlert, navigate]);

  const onUpdate = async (data: FormData) => {
    if (!product) return;

    try {
      const file = data.product_image as File;
      let imageURL = product.image; // Keep existing image if no new one is uploaded

      if (file && file.size > 0) {
        imageURL = await uploadImage(file);
      }

      const productData = {
        product_name: data.product_name,
        product_details: data.product_details,
        price: data.product_price,
        quantity: data.product_quantity,
        supplier: data.product_supplier,
        image: imageURL,
        category_id: parseInt(data.product_category, 10),
      };

      const response = await axios.put(
        `${API_URL}/api/products/${product.product_id}`,
        productData,
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log(response.data);
      addAlert("success", "Update Product", "Product updated successfully");
      navigate("/products");
    } catch (error) {
      console.error("Failed to update product:", error);
      addAlert("error", "Update product", "Failed to update product");
    }
  };

  if (loading) {
    return <LoadingAnimation />;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Product</h1>
        <Button variant="outline" onClick={() => navigate("/products")}>
          Back to Products
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Update Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                <div className="">
                  <FormField
                    control={form.control}
                    name="product_image"
                    render={({ field }) => (
                      <FormItem className="flex flex-col h-full">
                        <FormLabel className="flex-[5%]">
                          Image (optional)
                        </FormLabel>
                        <FormControl className="flex-[95%]">
                          <PictureInput
                            className=""
                            onFileSelect={(file) => {
                              field.onChange(file);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="product_name"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="product_details"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Details *</FormLabel>
                        <FormControl>
                          <textarea
                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter product details"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name="product_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="e.g. 99.99"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="product_quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              placeholder="e.g. 10"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="product_supplier"
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Supplier *</FormLabel>
                        <FormControl>
                          <Input placeholder="Product supplier" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="product_category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.category_id}
                                value={category.category_id.toString()}
                              >
                                {category.category_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex w-full justify-between pt-4">
                <Button 
                  variant="outline" 
                  type="button" 
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Product</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditProduct;
