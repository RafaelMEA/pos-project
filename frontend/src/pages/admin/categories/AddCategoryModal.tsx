const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

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

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import axios from "axios";

import { useAlert } from "@/contexts/AlertContext";

type Props = {
  onClose: () => void;
  onUpdated: () => void;
};

const formSchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
});

type FormData = z.infer<typeof formSchema>;

const AddCategoryModal = ({ onClose, onUpdated }: Props) => {
  const { addAlert } = useAlert();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onAdd = async (data: FormData) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/categories`,
        {
          category_name: data.category_name,
        },
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
      console.log("Category added successfully");
      addAlert("success", "Add Category", "Category added successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
      addAlert("error", "Add category", "Failed to add category");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onAdd)} className="space-y-4">
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
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
