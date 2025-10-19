import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  featured?: boolean;
}

export default function ProductCard({ id, name, category, price, image, featured }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-product-${id}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {featured && (
          <Badge className="absolute top-2 right-2 bg-[hsl(35,65%,55%)] text-white" data-testid={`badge-featured-${id}`}>
            Destaque
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <Button 
            size="icon"
            variant="secondary"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            data-testid={`button-quickview-${id}`}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1" data-testid={`text-category-${id}`}>{category}</div>
        <h3 className="font-semibold text-lg mb-2" data-testid={`text-name-${id}`}>{name}</h3>
        <div className="text-xl font-bold text-[hsl(35,65%,55%)]" data-testid={`text-price-${id}`}>
          R$ {price.toFixed(2)}/m²
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" variant="outline" data-testid={`button-details-${id}`}>
          Ver Detalhes
        </Button>
      </CardFooter>
    </Card>
  );
}
