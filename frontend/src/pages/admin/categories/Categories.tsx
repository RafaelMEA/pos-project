const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreHorizontal, Plus } from "lucide-react";

import AddCategoryModal from "./AddCategoryModal";
import UpdateCategoryModal from "./UpdateCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import LoadingAnimation from "@/components/LoadingAnimation";

export type Category = {
  category_id: number;
  category_name: string;
};

const Categories = () => {
  // for loading
  const [loading, setLoading] = useState(true)

  // for add
  const [showAddModal, setShowAddModal] = useState(false)

  // for update
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  // for delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/categories`, {
        headers: {
          "x-api-key": API_KEY,
        },
      });
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Categories</h1>
      </div>
      <div className="flex gap-4 items-center justify-between mb-4">
        <Input placeholder="Search category..." />
        <Button onClick={() => {
          setShowAddModal(true)
        }}>
          <Plus className="mr-1 text-white" />
          Add Category
        </Button>
      </div>
      {loading ? (
      <LoadingAnimation/>
    ) : (
      <>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Category Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length > 0 ? (
              categories.map((category) => (
                <TableRow key={category.category_id}>
                  <TableCell>{category.category_id}</TableCell>
                  <TableCell>{category.category_name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowUpdateModal(true);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowDeleteModal(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      </>
      )}
      
      {showUpdateModal && selectedCategory && (
        <UpdateCategoryModal
          category={selectedCategory}
          onClose={() => setShowUpdateModal(false)}
          onUpdated={fetchCategories} // Refresh data after update
        />
      )}
      {showAddModal && (
        <AddCategoryModal
        onClose={() => setShowAddModal(false)}
        onUpdated={fetchCategories}
        />
      )}
      {showDeleteModal && selectedCategory && (
        <DeleteCategoryModal
          category={selectedCategory}
          onClose={() => setShowDeleteModal(false)}
          onUpdated={fetchCategories} // Refresh data after delete
        />
      )}
    </div>
    
  );
};

export default Categories;
