import { useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadImage } from "@/lib/uploadImage";
import { useAlert } from "@/contexts/AlertContext";
import { Plus, Image, ArrowLeft } from "lucide-react";

// Shadcn components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

// Types
import type { Category } from "./Products";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Form validation schema
const formSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  product_image: z.instanceof(File).optional(),
  product_details: z.string().min(10, "Product details must be at least 10 characters"),
  product_price: z.coerce.number().min(0.01, "Product price is required"),
  product_quantity: z.coerce.number().min(1, "Product quantity is required"),
  product_supplier: z.string().min(2, "Supplier name is required"),
  product_category: z.string().min(1, "Product category is required"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
  onUpdated: () => void;
  categories: Category[];
};

const AddProductModal = ({ onClose, onUpdated, categories }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addAlert } = useAlert();

  // Initialize form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_price: 0,
      product_quantity: 1,
    }
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Upload image if provided
      let imageURL = "";
      if (data.product_image && data.product_image.size > 0) {
        imageURL = await uploadImage(data.product_image);
      }

      // Prepare product data
      const productData = {
        product_name: data.product_name,
        product_details: data.product_details,
        price: data.product_price,
        quantity: data.product_quantity,
        supplier: data.product_supplier,
        image: imageURL,
        category_id: data.product_category,
      };

      // Submit to API
      await axios.post(`${API_URL}/api/products`, productData, {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });

      // On success
      addAlert("success", "Product Added", "Product added successfully");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to add product:", error);
      addAlert("error", "Add Product", "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Product
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Image Upload Section */}
              <div className="md:col-span-1">
                <FormField
                  control={form.control}
                  name="product_image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        <Image className="h-4 w-4" /> 
                        Product Image (optional)
                      </FormLabel>
                      <div className="rounded-lg border border-dashed p-4 bg-muted/20 min-h-[200px] flex items-center justify-center">
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              field.onChange(e.target.files?.[0]);
                            }}
                            id="product-image-upload"
                          />
                        </FormControl>
                        <label 
                          htmlFor="product-image-upload" 
                          className="flex flex-col items-center justify-center cursor-pointer w-full h-full"
                        >
                          {field.value ? (
                            <img 
                              src={URL.createObjectURL(field.value)} 
                              alt="Product preview" 
                              className="max-h-40 max-w-full object-contain"
                            />
                          ) : (
                            <>
                              <Image className="h-12 w-12 text-muted-foreground mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload an image
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG up to 2MB
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Product Details Section */}
              <div className="md:col-span-2 space-y-4">
                <FormField
                  control={form.control}
                  name="product_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter product name" 
                          {...field} 
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="product_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Describe the product in detail..."
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="product_price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price *</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                              ₱
                            </span>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              className="pl-8"
                              {...field}
                            />
                          </div>
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
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Enter quantity"
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
                    <FormItem>
                      <FormLabel>Supplier *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter supplier name" 
                          {...field} 
                        />
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
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
