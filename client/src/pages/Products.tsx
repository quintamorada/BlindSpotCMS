import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Category, Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useEffect, useMemo } from "react";

export default function Products() {
  const [location, setLocation] = useLocation();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Inicializar o filtro com base nos parâmetros da URL (apenas uma vez ao carregar)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categorySlug = params.get('categoria');
    const query = params.get('q');
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (categorySlug && categories) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        setSelectedCategoryId(category.id);
      }
    }
  }, [categories]);

  const activeProducts = useMemo(() => {
    if (!products) {
      return [];
    }
    
    let filtered = products.filter(p => p.active);
    
    // Filtrar por categoria se especificado
    if (selectedCategoryId) {
      filtered = filtered.filter(p => p.categoryId === selectedCategoryId);
    }
    
    // Filtrar por busca se especificado
    if (searchQuery && categories) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        categories.find(c => c.id === product.categoryId)?.name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [products, selectedCategoryId, searchQuery, categories]);

  const selectedCategory = categories?.find(c => c.id === selectedCategoryId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {selectedCategory && (
        <div className="bg-muted/50 border-b">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-category-name">
              {selectedCategory.name}
            </h1>
            {selectedCategory.description && (
              <p className="text-lg text-muted-foreground max-w-3xl" data-testid="text-category-description">
                {selectedCategory.description}
              </p>
            )}
          </div>
        </div>
      )}
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          {!selectedCategory && !searchQuery && (
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Nossos Produtos
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Descubra nossa linha completa de persianas de alta qualidade
              </p>
            </div>
          )}

          {searchQuery && (
            <div className="text-center mb-12">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Resultados para "{searchQuery}"
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {activeProducts.length} produto(s) encontrado(s)
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setLocation('/produtos');
                }}
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar busca
              </Button>
            </div>
          )}

          {categories && categories.length > 0 && !searchQuery && (
            <div className="mb-8 flex flex-wrap gap-2">
              <Button
                variant={!selectedCategoryId ? "default" : "outline"}
                onClick={() => {
                  setSelectedCategoryId(null);
                  setLocation('/produtos');
                }}
                data-testid="button-filter-all"
              >
                Todas as Categorias
              </Button>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategoryId === category.id ? "default" : "outline"}
                  onClick={() => {
                    setSelectedCategoryId(category.id);
                    setLocation(`/produtos?categoria=${category.slug}`);
                  }}
                  data-testid={`button-filter-${category.slug}`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
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
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2" data-testid={`text-name-${product.id}`}>
                      {product.name}
                    </h3>
                    {product.featured && (
                      <Badge className="bg-[hsl(35,65%,55%)] text-white text-xs">
                        Destaque
                      </Badge>
                    )}
                  </div>
                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2" data-testid={`text-description-${product.id}`}>
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
                    <Button 
                      className="w-full"
                      onClick={() => setLocation(`/produto/${product.slug}`)}
                      data-testid={`button-configure-${product.id}`}
                    >
                      Personalizar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {activeProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery ? `Nenhum produto encontrado para "${searchQuery}".` : 'Nenhum produto disponível no momento.'}
              </p>
              {searchQuery && (
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setLocation('/produtos');
                  }}
                  data-testid="button-clear-search-empty"
                >
                  Ver todos os produtos
                </Button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
