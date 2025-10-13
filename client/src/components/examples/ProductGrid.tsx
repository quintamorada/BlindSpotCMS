import ProductGrid from '../ProductGrid';
import img1 from "@assets/stock_images/window_blinds_modern_01fb7e69.jpg";
import img2 from "@assets/stock_images/roller_blinds_vertic_09ed5e02.jpg";
import img3 from "@assets/stock_images/blackout_curtains_be_a141c3c1.jpg";
import img4 from "@assets/stock_images/window_blinds_modern_f03f816b.jpg";

export default function ProductGridExample() {
  const products = [
    {
      id: "1",
      name: "Persiana Blackout Premium",
      category: "Blackout",
      price: 299.90,
      image: img3,
      featured: true
    },
    {
      id: "2",
      name: "Persiana Rolô Linho",
      category: "Rolô",
      price: 249.90,
      image: img2
    },
    {
      id: "3",
      name: "Persiana Vertical PVC",
      category: "Vertical",
      price: 349.90,
      image: img1
    },
    {
      id: "4",
      name: "Persiana Horizontal Alumínio",
      category: "Horizontal",
      price: 199.90,
      image: img4
    }
  ];
  
  return (
    <ProductGrid 
      products={products}
      title="Produtos em Destaque"
      subtitle="Conheça nossa seleção de persianas premium"
    />
  );
}
