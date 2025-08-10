import { useLocation } from 'react-router-dom';

const ViewProduct = () => {
  const location = useLocation();
  const { product } = location.state || {};

  console.log("Product data:", product);
  
  return (
    <div>
      <h1>View Product</h1>
    </div>
  );
};

export default ViewProduct;
