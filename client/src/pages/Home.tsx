import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

import img1 from "@assets/stock_images/window_blinds_modern_01fb7e69.jpg";
import img2 from "@assets/stock_images/roller_blinds_vertic_09ed5e02.jpg";
import img3 from "@assets/stock_images/blackout_curtains_be_a141c3c1.jpg";
import img4 from "@assets/stock_images/window_blinds_modern_f03f816b.jpg";
import img5 from "@assets/stock_images/roller_blinds_vertic_6e1dd772.jpg";
import img6 from "@assets/stock_images/roller_blinds_vertic_2de45dd7.jpg";
import img7 from "@assets/stock_images/blackout_curtains_be_535dd2de.jpg";

export default function Home() {
  const categories = [
    {
      id: "1",
      name: "Blackout",
      description: "Bloqueio total de luz",
      image: img3
    },
    {
      id: "2",
      name: "Rolô",
      description: "Praticidade e elegância",
      image: img2
    },
    {
      id: "3",
      name: "Vertical",
      description: "Ideal para grandes janelas",
      image: img5
    },
    {
      id: "4",
      name: "Horizontal",
      description: "Clássicas e versáteis",
      image: img4
    }
  ];
  
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
      image: img5
    },
    {
      id: "4",
      name: "Persiana Horizontal Alumínio",
      category: "Horizontal",
      price: 199.90,
      image: img4,
      featured: true
    },
    {
      id: "5",
      name: "Persiana Blackout Total",
      category: "Blackout",
      price: 399.90,
      image: img7
    },
    {
      id: "6",
      name: "Persiana Rolô Screen",
      category: "Rolô",
      price: 279.90,
      image: img6
    },
    {
      id: "7",
      name: "Persiana Vertical Tecido",
      category: "Vertical",
      price: 429.90,
      image: img1
    },
    {
      id: "8",
      name: "Persiana Horizontal Madeira",
      category: "Horizontal",
      price: 499.90,
      image: img4
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <CategorySection categories={categories} />
        <ProductGrid 
          products={products}
          title="Produtos em Destaque"
          subtitle="Conheça nossa seleção de persianas premium com qualidade excepcional"
        />
      </main>
      <Footer />
      
      <Button
        size="lg"
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg bg-green-600 hover:bg-green-700 text-white"
        data-testid="button-whatsapp"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </div>
  );
}
