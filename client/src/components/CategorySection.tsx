import { Card } from "@/components/ui/card";
import { Link } from "wouter";

interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug?: string;
}

interface CategorySectionProps {
  categories: Category[];
}

export default function CategorySection({ categories }: CategorySectionProps) {
  return (
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
            return (
              <Link key={category.id} href="/produtos">
                <Card 
                  className="group overflow-hidden hover-elevate cursor-pointer"
                  data-testid={`card-category-${category.id}`}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
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
  );
}
