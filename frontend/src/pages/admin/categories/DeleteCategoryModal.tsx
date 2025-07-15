const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import axios from "axios";

import type { Category } from "./Categories";

import LoadingAnimation from "@/components/LoadingAnimation";

import { useAlert } from "@/contexts/AlertContext";

type Props = {
  category: Category;
  onClose: () => void;
  onUpdated: () => void;
};

const DeleteCategoryModal = ({ category, onClose, onUpdated }: Props) => {
  const [loading, setLoading] = useState(false);
  const { addAlert } = useAlert();
  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_URL}/api/categories/${category.category_id}`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      console.log(response.data);
      onUpdated();
      onClose();
      console.log("Category deleted successfully");
      addAlert("success", "Delete Category", "Category deleted successfully");
    } catch (error) {
      console.error("Failed to delete category:", error);
      addAlert("error", "Delete category", "Failed to delete category");
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
    {loading && <LoadingAnimation />}
    <AlertDialog open={true} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {category.category_name} from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex justify-between w-full">
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default DeleteCategoryModal;
