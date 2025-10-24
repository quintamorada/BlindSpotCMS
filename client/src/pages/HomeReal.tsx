import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Category, Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { useLocation, Link } from "wouter";

function getThumbUrl(imageUrl: string): string {
  if (imageUrl.includes('-large.webp')) {
    return imageUrl.replace('-large.webp', '-thumb.webp');
  }
  return imageUrl;
}

export default function HomeReal() {
  const [, setLocation] = useLocation();
  
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const activeProducts = products?.filter(p => p.active) || [];
  const featuredProducts = activeProducts.filter(p => p.featured);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        
        {categories && categories.length > 0 && (
          <section className="py-16 md:py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-categories-title">
                  Nossas Categorias
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Soluções sob medida para cada necessidade
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category) => {
                  const categoryLink = `/produtos?categoria=${category.slug}`;
                  
                  return (
                    <Link key={category.id} href={categoryLink}>
                      <Card 
                        className="group overflow-hidden hover-elevate cursor-pointer"
                        data-testid={`card-category-${category.id}`}
                      >
                        <div className="relative aspect-square overflow-hidden">
                          {category.image && (
                            <img 
                              src={category.image} 
                              alt={category.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                            <h3 className="font-bold text-xl mb-2" data-testid={`text-category-name-${category.id}`}>
                              {category.name}
                            </h3>
                            <p className="text-sm text-white/90" data-testid={`text-category-desc-${category.id}`}>
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {featuredProducts.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-products-title">
                  Produtos em Destaque
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Conheça nossa seleção de persianas premium com qualidade excepcional
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
                  <Card key={product.id} className="group overflow-hidden hover-elevate flex flex-col" data-testid={`card-product-${product.id}`}>
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
                    
                    <div className="p-4 flex-grow">
                      <div className="text-xs text-muted-foreground mb-1" data-testid={`text-category-${product.id}`}>
                        {categories?.find(c => c.id === product.categoryId)?.name || 'Sem categoria'}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2" data-testid={`text-name-${product.id}`}>
                        {product.name}
                      </h3>
                      <div className="text-xl font-bold text-[hsl(35,65%,55%)]" data-testid={`text-price-${product.id}`}>
                        R$ {parseFloat(product.price).toFixed(2)}/m²
                      </div>
                    </div>
                    
                    <div className="p-4 pt-0">
                      <Button 
                        className="w-full" 
                        onClick={() => setLocation(`/produto/${product.slug}`)}
                        data-testid={`button-details-${product.id}`}
                      >
                        Personalizar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
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
