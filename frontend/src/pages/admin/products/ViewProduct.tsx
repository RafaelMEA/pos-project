import { useLocation } from "react-router-dom";
import { Package, Tag, Store, Barcode } from "lucide-react";

const ViewProduct = () => {
  const location = useLocation();
  const { product, categories } = location.state || {};

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat) => cat.category_id === categoryId);
    return category?.category_name || "Uncategorized";
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image Section */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg p-8">
              <img
                src={product?.image || "/placeholder.png"}
                alt={product?.name}
                className="w-full h-auto max-w-md object-contain rounded-lg"
              />
            </div>

            {/* Product Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product?.product_name}
                </h1>
                <div className="inline-flex items-center bg-blue-50 px-3 py-1 rounded-full">
                  <Barcode className="mr-2 text-gray-400" />
                  <span className="text-gray-700 font-medium">
                    Barcode: {product?.barcode || "N/A"}
                  </span>
                </div>
              </div>

              {/* Price Card */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg text-gray-700">Price</span>
                  <span className="text-2xl font-bold text-green-600">
                    ₱{product?.price}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Package className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Stock Level</p>
                    <p className="font-medium text-gray-900">
                      {product?.quantity} units
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Store className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-medium text-gray-900">
                      {product?.supplier}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Tag className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">
                      {getCategoryName(product?.category_id)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Product Description
                </h2>
                <p className="text-gray-600">
                  {product?.product_details || "No product details available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
