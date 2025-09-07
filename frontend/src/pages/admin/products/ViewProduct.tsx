import { useLocation } from "react-router-dom";
import { 
  Package, 
  Tag, 
  Store, 
  Barcode,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

// Import types from Products
import type { Product, Category } from "./Products";

interface ViewProduct extends Product {
  barcode?: string;
  quantity?: number;
  supplier?: string;
  product_details?: string;
}

const ViewProduct = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { product, categories }: { product?: ViewProduct; categories?: Category[] } = location.state || {};

  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat) => cat.category_id === categoryId);
    return category?.category_name || "Uncategorized";
  };

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-2xl mb-2">⚠️</div>
          <p className="text-lg font-medium mb-2">Product not found</p>
          <p className="text-sm text-muted-foreground mb-4">
            The requested product could not be loaded
          </p>
          <Button onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to products
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-4"
          aria-label="Back to products"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Product Details
          </h1>
          <Badge variant="secondary" className="mt-2 md:mt-0">
            <Barcode className="mr-2 h-4 w-4" />
            SKU: {product?.barcode || product.product_id}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Image */}
        <Card className="overflow-hidden">
          <CardHeader className="p-0">
            <div className="flex items-center justify-center bg-muted aspect-square p-8">
              {product?.image ? (
                <img
                  src={product.image}
                  alt={product.product_name}
                  className="w-full h-full max-h-96 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.png";
                    e.currentTarget.classList.add("object-contain", "p-8");
                  }}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-64 h-64 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}
            </div>
          </CardHeader>
        </Card>

        {/* Product Details */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  {product.product_name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {getCategoryName(product.category_id)}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-muted">
                <span className="text-lg font-medium">Price</span>
                <span className="text-2xl font-bold text-green-600">
                  ₱{product.price.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-accent p-2 rounded-md">
                  <Package className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stock Level</p>
                  <p className="font-medium text-foreground">
                    {product.quantity || 0} units
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-accent p-2 rounded-md">
                  <Store className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium text-foreground">
                    {product.supplier || "Not specified"}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-accent p-2 rounded-md">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">
                    {getCategoryName(product.category_id)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Product Description
              </h2>
              <p className="text-muted-foreground">
                {product.product_details || "No description available"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
