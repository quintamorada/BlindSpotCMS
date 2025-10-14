import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Category, Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function Products() {
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const activeProducts = products?.filter(p => p.active) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              Nossos Produtos
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubra nossa linha completa de persianas de alta qualidade
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.images && product.images[0] && (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  {product.featured && (
                    <Badge className="absolute top-2 right-2 bg-[hsl(35,65%,55%)] text-white" data-testid={`badge-featured-${product.id}`}>
                      Destaque
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Button 
                      size="icon"
                      variant="secondary"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      data-testid={`button-quickview-${product.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-xs text-muted-foreground mb-1" data-testid={`text-category-${product.id}`}>
                    {categories?.find(c => c.id === product.categoryId)?.name || 'Sem categoria'}
                  </div>
                  <h3 className="font-semibold text-lg mb-2" data-testid={`text-name-${product.id}`}>
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {product.description}
                    </p>
                  )}
                  <div className="text-xl font-bold text-[hsl(35,65%,55%)]" data-testid={`text-price-${product.id}`}>
                    A partir de R$ {parseFloat(product.price).toFixed(2)}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {activeProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto disponível no momento.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
