import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, Tag, Store, Barcode } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type Product = {
  product_id: number;
  product_name: string;
  product_details: string;
  price: number;
  quantity: number;
  barcode: string;
  supplier: string;
  image: string;
  category_id: number;
};

export type Category = {
  category_id: number;
  category_name: string;
};

interface Props {
  product?: Product;
  categories?: Category[];
  onUpdated?: () => void;
  onClose?: () => void; // <-- add this
}

const UpdateProductPage: React.FC<Props> = ({
  product: propProduct,
  categories: propCategories,
  onUpdated,
  onClose, // <-- add this
}) => {
  // If using react-router, get product and categories from location.state
  const location = useLocation();
  const navigate = useNavigate();
  const { product = propProduct, categories = propCategories } = location.state || {};

  const [form, setForm] = useState<Product>({ ...(product as Product) });
  const [loading, setLoading] = useState(false);

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat) => cat.category_id === categoryId);
    return category?.category_name || "Uncategorized";
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" || name === "category_id"
        ? Number(value)
        : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm((prev) => ({
          ...prev,
          image: ev.target?.result as string,
        }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { product_id, ...updatePayload } = form;
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/products/${form.product_id}`,
        updatePayload,
        { headers: { "x-api-key": import.meta.env.VITE_API_KEY } }
      );
      if (onUpdated) onUpdated();
      if (onClose) onClose(); // <-- close modal after update
      // If you want to support page navigation, you can still use navigate(-1) if onClose is not provided
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.error) {
        alert("Failed to update product: " + error.response.data.error);
      } else {
        alert("Failed to update product");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!form || !categories) return <div>Loading...</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image Section */}
            <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-8">
              <img
                src={form.image || "/placeholder.png"}
                alt={form.product_name}
                className="w-full h-auto max-w-md object-contain rounded-lg mb-4"
              />
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            {/* Product Details Section */}
            <div className="space-y-6 w-full">
              <div>
                <Input
                  name="product_name"
                  value={form.product_name}
                  onChange={handleChange}
                  className="text-3xl font-bold text-gray-900 mb-2"
                  placeholder="Product Name"
                />
                <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full mt-2">
                  <Barcode className="mr-2 text-gray-400" />
                  <span className="text-gray-700 font-medium">
                    Barcode: {form.barcode || "N/A"}
                  </span>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-700">Price</span>
                  <Input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    className="w-32 text-2xl font-bold text-green-600"
                    min={0}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500">Stock Level</label>
                    <Input
                      name="quantity"
                      type="number"
                      value={form.quantity}
                      onChange={handleChange}
                      className="w-32"
                      min={0}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Store className="text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500">Supplier</label>
                    <Input
                      name="supplier"
                      value={form.supplier}
                      onChange={handleChange}
                      placeholder="Supplier"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="text-gray-400" />
                  <div>
                    <label className="text-sm text-gray-500">Category</label>
                    <select
                      name="category_id"
                      value={form.category_id}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    >
                      {categories.map((cat) => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-lg font-semibold text-gray-900 mb-2">
                  Product Description
                </label>
                <textarea
                  name="product_details"
                  value={form.product_details}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Product Description"
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full mt-4"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProductPage;