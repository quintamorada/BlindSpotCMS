import ProductCard from '../ProductCard';
import heroImage from "@assets/stock_images/window_blinds_modern_01fb7e69.jpg";

export default function ProductCardExample() {
  return (
    <div className="max-w-sm">
      <ProductCard 
        id="1"
        name="Persiana Blackout Premium"
        category="Blackout"
        price={299.90}
        image={heroImage}
        featured
      />
    </div>
  );
}
