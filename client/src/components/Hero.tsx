import { Button } from "@/components/ui/button";
import heroImage from "@assets/stock_images/window_blinds_modern_3f492354.jpg";
import { useLocation } from "wouter";

export default function Hero() {
  const [, setLocation] = useLocation();

  return (
    <div className="relative h-[600px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Persianas Premium" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>
      
      <div className="relative z-10 text-center max-w-4xl px-4">
        <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
          Transforme Seus Ambientes
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
          Persianas premium sob medida com design sofisticado e qualidade excepcional
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-[hsl(35,65%,55%)] hover:bg-[hsl(35,65%,50%)] text-white border-0 font-semibold px-8"
            data-testid="button-hero-catalog"
            onClick={() => setLocation("/catalogo")}
          >
            Ver Catálogo
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 font-semibold px-8"
            data-testid="button-hero-quote"
            onClick={() => setLocation("/contato")}
          >
            Solicitar Orçamento
          </Button>
        </div>
      </div>
    </div>
  );
}
