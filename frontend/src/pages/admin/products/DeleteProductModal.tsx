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

import type { Product } from "./Products";

import LoadingAnimation from "@/components/LoadingAnimation";

import { useAlert } from "@/contexts/AlertContext";

type Props = {
  product: Product;
  onClose: () => void;
  onUpdated: () => void;
};

const DeleteProductModal = ({ product, onClose, onUpdated }: Props) => {
  const [loading, setLoading] = useState(false);
  const { addAlert } = useAlert();
  
  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${API_URL}/api/products/${product.product_id}`,
        {
          headers: {
            "x-api-key": API_KEY,
          },
        }
      );
      console.log(response.data);
      onUpdated();
      onClose();
      console.log("Product deleted successfully");
      addAlert("success", "Delete Product", "Product deleted successfully");
    } catch (error) {
      console.error("Failed to delete product:", error);
      addAlert("error", "Delete product", "Failed to delete product");
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
              <strong>{product.product_name}</strong> from our servers.
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

export default DeleteProductModal;
