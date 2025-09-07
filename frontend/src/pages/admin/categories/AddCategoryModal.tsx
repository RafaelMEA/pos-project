// frontend/src/pages/admin/categories/AddCategoryModal.tsx
const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useState } from "react";
import { Plus, X } from "lucide-react";
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

const formSchema = z.object({
  category_name: z.string().min(1, "Category name is required"),
});

type FormData = z.infer<typeof formSchema>;

type Props = {
  onClose: () => void;
  onUpdated: () => void;
};

const AddCategoryModal = ({ onClose, onUpdated }: Props) => {
  const { addAlert } = useAlert();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category_name: "",
    }
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const categoryData = {
        category_name: data.category_name,
      };

      await axios.post(
        `${API_URL}/api/categories`,
        categoryData,
        {
          headers: {
            "x-api-key": API_KEY,
            "Content-Type": "application/json",
          },
        }
      );
      
      addAlert("success", "Category Added", "Category added successfully");
      onUpdated();
      onClose();
    } catch (error) {
      console.error("Failed to add category:", error);
      addAlert("error", "Add Category", "Failed to add category");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Category
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
                {isSubmitting ? "Adding Category..." : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal;
