import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Product, Category } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRoute, Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function CategoryProducts() {
  const [, params] = useRoute("/categoria/:slug");
  const slug = params?.slug;

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const category = categories?.find(c => c.slug === slug);

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const categoryProducts = products?.filter(p => p.categoryId === category?.id && p.active) || [];

  if (categoriesLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Categoria não encontrada</h1>
            <p className="text-muted-foreground">A categoria que você procura não está disponível.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-muted/50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4" data-testid="text-category-name">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-3xl" data-testid="text-category-description">
              {category.description}
            </p>
          )}
        </div>
      </div>
      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4">

          {productsLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando produtos...</p>
            </div>
          ) : categoryProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum produto disponível nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover-elevate" data-testid={`card-product-${product.id}`}>
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
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-lg mb-1" data-testid={`text-product-name-${product.id}`}>
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
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">A partir de</div>
                        <div className="text-xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                          R$ {parseFloat(product.price).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">por m²</div>
                      </div>
                      <Link href={`/produto/${product.slug}`}>
                        <Button data-testid={`button-configure-${product.id}`}>
                          Configurar
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
