import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Category, Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, X } from "lucide-react";
import { useLocation } from "wouter";
import { useMemo } from "react";

function getThumbUrl(imageUrl: string): string {
  if (imageUrl.includes('-large.webp')) {
    return imageUrl.replace('-large.webp', '-thumb.webp');
  }
  return imageUrl;
}

export default function Products() {
  const [location, setLocation] = useLocation();
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Pega o termo de busca e categoria da URL
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const searchQuery = searchParams.get('q') || '';
  const categorySlug = searchParams.get('categoria') || '';

  const activeProducts = useMemo(() => {
    let filtered = products?.filter(p => p.active) || [];
    
    // Filtrar por categoria se especificado
    if (categorySlug) {
      const category = categories?.find(c => c.slug === categorySlug);
      if (category) {
        filtered = filtered.filter(p => p.categoryId === category.id);
      }
    }
    
    // Filtrar por busca se especificado
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        categories?.find(c => c.id === product.categoryId)?.name.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  }, [products, searchQuery, categorySlug, categories]);

  const selectedCategory = categories?.find(c => c.slug === categorySlug);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              {searchQuery ? `Resultados para "${searchQuery}"` : 
               selectedCategory ? selectedCategory.name : 
               'Nossos Produtos'}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {searchQuery ? `${activeProducts.length} produto(s) encontrado(s)` : 
               selectedCategory ? `${activeProducts.length} produto(s) na categoria ${selectedCategory.name}` :
               'Descubra nossa linha completa de persianas de alta qualidade'}
            </p>
            {(searchQuery || categorySlug) && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setLocation('/produtos')}
                data-testid="button-clear-search"
              >
                <X className="h-4 w-4 mr-2" />
                {searchQuery ? 'Limpar busca' : 'Ver todos os produtos'}
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {activeProducts.map((product) => (
              <Card key={product.id} className="group overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden">
                  {product.images && product.images[0] && (
                    <img 
                      src={getThumbUrl(product.images[0])} 
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
                    R$ {parseFloat(product.price).toFixed(2)}/m²
                  </div>
                </div>
                
                <div className="p-4 pt-0">
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => setLocation(`/produto/${product.slug}`)}
                    data-testid={`button-details-${product.id}`}
                  >
                    Comprar
                  </Button>
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
                  onClick={() => setLocation('/produtos')}
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
