import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Product, CategoryColor, Category, Settings } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Ruler, Check, AlertCircle, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCart } from "@/contexts/CartContext";
import bandoLeftImg from "@assets/generated_images/Blinds_cord_left_side_a7dc741f.png";
import bandoRightImg from "@assets/generated_images/Blinds_cord_right_side_408c3c17.png";
import bandoWithAluminumImg from "@assets/generated_images/Window_blind_with_aluminum_valance_29be8e56.png";
import bandoWithoutAluminumImg from "@assets/generated_images/Window_blind_without_valance_a6bff01c.png";

function getThumbUrl(imageUrl: string): string {
  if (imageUrl.includes('-large.webp')) {
    return imageUrl.replace('-large.webp', '-thumb.webp');
  }
  return imageUrl;
}

export default function ProductConfig() {
  const [, params] = useRoute("/produto/:slug");
  const slug = params?.slug;

  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bandoSide, setBandoSide] = useState<"left" | "right" | null>(null);
  const [selectedColor, setSelectedColor] = useState<CategoryColor | null>(null);
  const [aluminumBando, setAluminumBando] = useState<boolean | null>(null);
  const { toast } = useToast();
  const { addItem } = useCart();
  const [, setLocation] = useLocation();

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const product = products?.find(p => p.slug === slug);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const category = categories?.find(c => c.id === product?.categoryId);

  const { data: colors, isLoading: colorsLoading } = useQuery<CategoryColor[]>({
    queryKey: product?.categoryId ? [`/api/categories/${product.categoryId}/colors`] : [],
    enabled: !!product?.categoryId,
  });

  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Produto não encontrado</h1>
            <p className="text-muted-foreground">O produto que você procura não está disponível.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const pricePerSqm = parseFloat(product.price);
  const widthNum = parseFloat(width) || 0;
  const heightNum = parseFloat(height) || 0;
  const area = widthNum * heightNum;
  const aluminumBandoPrice = aluminumBando ? parseFloat(settings?.aluminumBandoPrice || "0") : 0;
  const totalPrice = (area * pricePerSqm) + aluminumBandoPrice;

  const hasColors = colors && colors.length > 0;
  const productHasBando = product?.hasBando ?? true;
  const isValidConfig = widthNum > 0 && heightNum > 0 && 
    (productHasBando ? bandoSide !== null && aluminumBando !== null : true) && 
    (!hasColors || selectedColor !== null);

  const handleAddToCart = () => {
    if (!isValidConfig) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      width: widthNum,
      height: heightNum,
      bandoSide: productHasBando ? bandoSide! : "left",
      colorId: selectedColor?.id,
      colorName: selectedColor?.name,
      colorCode: selectedColor?.code,
      colorImage: selectedColor?.image,
      aluminumBando: productHasBando ? aluminumBando! : false,
      aluminumBandoPrice: productHasBando ? aluminumBandoPrice : 0,
      pricePerSqm: pricePerSqm,
      totalPrice: totalPrice,
      area: area
    });

    toast({
      title: "Produto adicionado ao carrinho!",
      description: "Continue comprando ou finalize seu pedido.",
    });

    setWidth("");
    setHeight("");
    setBandoSide(null);
    setSelectedColor(null);
    setAluminumBando(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  {product.images && product.images[0] ? (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                      data-testid="img-product"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Sem imagem</span>
                    </div>
                  )}
                </div>
              </Card>

              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="aspect-square overflow-hidden rounded-md border">
                      <img 
                        src={getThumbUrl(img)} 
                        alt={`${product.name} ${idx + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2" data-testid="text-product-name">
                  {product.name}
                </h1>
                {product.featured && (
                  <Badge className="bg-[hsl(35,65%,55%)] text-white mb-4">
                    Produto em Destaque
                  </Badge>
                )}
                {product.description && (
                  <p className="text-muted-foreground mt-4" data-testid="text-description">
                    {product.description}
                  </p>
                )}
              </div>

              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">Configure sua Persiana</h2>
                  <p className="text-sm text-muted-foreground">Personalize as medidas e escolha o lado do bandô</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="width">
                      <Ruler className="inline h-4 w-4 mr-1" />
                      Largura (metros)
                    </Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.01"
                      min="0.1"
                      placeholder="Ex: 1.50"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      data-testid="input-width"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">
                      <Ruler className="inline h-4 w-4 mr-1" />
                      Altura (metros)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.01"
                      min="0.1"
                      placeholder="Ex: 2.00"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      data-testid="input-height"
                    />
                  </div>
                </div>

                {productHasBando && (
                  <>
                    <div className="space-y-2">
                      <Label>Lado do comando {category?.name || ''}</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Clique na imagem para selecionar o lado onde ficará o comando
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setBandoSide("left")}
                          className={`relative border-2 rounded-lg p-4 transition-all hover-elevate ${
                            bandoSide === "left" 
                              ? "border-primary bg-primary/5" 
                              : "border-border"
                          }`}
                          data-testid="button-bando-left"
                        >
                          <img 
                            src={bandoLeftImg} 
                            alt="Bandô Esquerdo"
                            className="w-full h-32 object-contain mb-2"
                          />
                          <div className="text-center font-medium">Esquerdo</div>
                          {bandoSide === "left" && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setBandoSide("right")}
                          className={`relative border-2 rounded-lg p-4 transition-all hover-elevate ${
                            bandoSide === "right" 
                              ? "border-primary bg-primary/5" 
                              : "border-border"
                          }`}
                          data-testid="button-bando-right"
                        >
                          <img 
                            src={bandoRightImg} 
                            alt="Bandô Direito"
                            className="w-full h-32 object-contain mb-2"
                          />
                          <div className="text-center font-medium">Direito</div>
                          {bandoSide === "right" && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Bandô de Alumínio</Label>
                      <p className="text-xs text-muted-foreground mb-3">
                        Escolha se deseja adicionar bandô de alumínio
                        {aluminumBandoPrice > 0 && ` (+R$ ${aluminumBandoPrice.toFixed(2)})`}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setAluminumBando(true)}
                          className={`relative border-2 rounded-lg p-4 transition-all hover-elevate ${
                            aluminumBando === true 
                              ? "border-primary bg-primary/5" 
                              : "border-border"
                          }`}
                          data-testid="button-aluminum-bando-yes"
                        >
                          <img 
                            src={bandoWithAluminumImg} 
                            alt="Com Bandô de Alumínio"
                            className="w-full h-32 object-contain mb-2"
                          />
                          <div className="text-center font-medium">Com Bandô</div>
                          {aluminumBando === true && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setAluminumBando(false)}
                          className={`relative border-2 rounded-lg p-4 transition-all hover-elevate ${
                            aluminumBando === false 
                              ? "border-primary bg-primary/5" 
                              : "border-border"
                          }`}
                          data-testid="button-aluminum-bando-no"
                        >
                          <img 
                            src={bandoWithoutAluminumImg} 
                            alt="Sem Bandô de Alumínio"
                            className="w-full h-32 object-contain mb-2"
                          />
                          <div className="text-center font-medium">Sem Bandô</div>
                          {aluminumBando === false && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label>Cor da Persiana</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Escolha a cor desejada para sua persiana
                  </p>
                  {colorsLoading ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">
                      Carregando cores disponíveis...
                    </div>
                  ) : !hasColors ? (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Este produto não possui cores disponíveis no momento.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {colors.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`relative border-2 rounded-lg p-3 transition-all hover-elevate ${
                            selectedColor?.id === color.id
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                          data-testid={`button-color-${color.id}`}
                        >
                          <div className="aspect-square mb-2 rounded-md overflow-hidden border">
                            <img
                              src={color.image}
                              alt={color.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect width="100" height="100" fill="%23e5e7eb"/%3E%3Ctext x="50" y="50" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="%239ca3af"%3E?%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-sm" data-testid={`text-color-name-${color.id}`}>
                              {color.name}
                            </div>
                            <div className="text-xs text-muted-foreground" data-testid={`text-color-code-${color.id}`}>
                              {color.code}
                            </div>
                          </div>
                          {selectedColor?.id === color.id && (
                            <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {area > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Área total:</span>
                      <span className="font-medium" data-testid="text-area">
                        {area.toFixed(2)} m²
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preço por m²:</span>
                      <span className="font-medium">
                        R$ {pricePerSqm.toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-2xl text-[hsl(35,65%,55%)]" data-testid="text-total">
                          R$ {totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!isValidConfig}
                    onClick={handleAddToCart}
                    data-testid="button-add-to-cart"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {!isValidConfig 
                      ? "Complete a configuração" 
                      : "Adicionar ao Carrinho"}
                  </Button>
                  <Button 
                    variant="outline"
                    className="w-full" 
                    onClick={() => setLocation("/carrinho")}
                    data-testid="button-view-cart"
                  >
                    Ver Carrinho
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
