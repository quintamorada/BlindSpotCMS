import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const activeProducts = products?.filter(p => p.active) || [];
  const displayedProducts = selectedCategory
    ? activeProducts.filter(p => p.categoryId === selectedCategory)
    : activeProducts;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-page-title">
              Catálogo de Produtos
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              Explore nossa linha completa de persianas e cortinas de alta qualidade
            </p>
          </div>

          {categories && categories.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                data-testid="button-filter-all"
              >
                Todas as Categorias
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  data-testid={`button-filter-${category.slug}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto disponível.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover-elevate flex flex-col" data-testid={`card-product-${product.id}`}>
                  <div className="aspect-square overflow-hidden bg-muted">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        data-testid={`img-product-${product.id}`}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
                        {product.name}
                      </h3>
                      {product.featured && (
                        <Badge className="bg-[hsl(35,65%,55%)] text-white text-xs">
                          Destaque
                        </Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2" data-testid={`text-product-description-${product.id}`}>
                        {product.description}
                      </p>
                    )}
                    <div className="mt-auto">
                      <div className="mb-4">
                        <div className="text-sm text-muted-foreground">A partir de</div>
                        <div className="text-xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                          R$ {parseFloat(product.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">por m²</div>
                      </div>
                      <Link href={`/produto/${product.slug}`} className="block">
                        <Button className="w-full" data-testid={`button-configure-${product.id}`}>
                          Personalizar
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
