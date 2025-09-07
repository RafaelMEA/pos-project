// frontend/src/pages/admin/categories/UpdateCategoryModal.tsx
import { useState } from "react";
import { Edit, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useAlert } from "@/contexts/AlertContext";

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

import type { Category } from "./Categories";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

const formSchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  category: Category;
  onClose: () => void;
  onUpdated: () => void;
};

const UpdateCategoryModal = ({ category, onClose, onUpdated }: Props) => {
  const { addAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: category.category_name,
    }
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      await axios.put(
        `${API_URL}/api/categories/${category.category_id}`,
        { category_name: data.category_name },
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      
      addAlert("success", "Category Updated", "Category updated successfully");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to update category:", error);
      addAlert("error", "Update Category", "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Category
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleSubmit)} 
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="category_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category name" 
                      {...field} 
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
                className="w-full sm:w-auto"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving Changes..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCategoryModal;
