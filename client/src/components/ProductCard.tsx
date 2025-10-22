import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  featured?: boolean;
  categorySlug?: string;
  productSlug?: string;
}

export default function ProductCard({ id, name, category, price, image, featured, categorySlug, productSlug }: ProductCardProps) {
  const categoryLink = categorySlug ? `/produtos?categoria=${categorySlug}` : '/produtos';
  const productLink = productSlug ? `/produto/${productSlug}` : '/produtos';
  
  return (
    <Card className="group overflow-hidden hover-elevate" data-testid={`card-product-${id}`}>
      <Link href={categoryLink}>
        <div className="relative aspect-[4/3] overflow-hidden cursor-pointer">
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
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1" data-testid={`text-category-${id}`}>{category}</div>
        <h3 className="font-semibold text-lg mb-2" data-testid={`text-name-${id}`}>{name}</h3>
        <div className="text-xl font-bold text-[hsl(35,65%,55%)]" data-testid={`text-price-${id}`}>
          R$ {price.toFixed(2)}/m²
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link href={productLink} className="w-full">
          <Button className="w-full" variant="outline" data-testid={`button-details-${id}`}>
            Comprar
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
