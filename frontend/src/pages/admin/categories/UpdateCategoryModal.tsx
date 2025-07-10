import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { Category } from "./Categories";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

type Props = {
  category: Category;
  onClose: () => void;
  onUpdated: () => void;
};


const formSchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
});

type FormData = z.infer<typeof formSchema>;

const UpdateCategoryModal = ({ category, onClose, onUpdated }: Props) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: category.category_name,
    },
  });

  const onUpdate = async (data: FormData) => {
    try {
      const response = await axios.put(`${API_URL}/api/categories/${category.category_id}`, 
        {
          category_name: data.category_name,
        },
        {
        headers: {
          "x-api-key": API_KEY,
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      onUpdated();
      onClose();
      console.log("Category updated successfully");
    } catch (error) {
      console.error("Failed to update category:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onUpdate)} className="space-y-4">
            <FormField
              control={form.control}
              name="category_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="flex justify-between w-full">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryModal;
