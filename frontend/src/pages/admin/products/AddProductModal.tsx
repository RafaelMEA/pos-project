const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { uploadImage } from "@/lib/uploadImage";

// components
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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAlert } from "@/contexts/AlertContext";

import axios from "axios";

import PictureInput from "@/components/ui/PictureInput";

import type { Category } from "./Products";

type Props = {
  onClose: () => void;
  onUpdated: () => void;
  categories: Category[];
};

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

const AddProductModal = ({ onClose, onUpdated, categories }: Props) => {
  // alert
  const { addAlert } = useAlert();

  // form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onAdd = async (data: FormData) => {
    try {

      const file = data.product_image as File;

      let imageURL = ""

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
        category_id: data.product_category,
      };

      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response.data);
      onUpdated();
      onClose();
      console.log("Product added successfully");
      addAlert("success", "Add Product", "Product added successfully");
    } catch (error) {
      console.error("Failed to add product:", error);
      addAlert("error", "Add product", "Failed to add product");
      onClose()
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 ">
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
            <DialogFooter className="flex w-full justify-between">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Product</Button>
          </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
