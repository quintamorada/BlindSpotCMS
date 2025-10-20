import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

export default function Cart() {
  const { items, removeItem, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="py-16">
              <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground mb-6">
                Adicione produtos ao carrinho para continuar sua compra
              </p>
              <Link href="/produtos">
                <Button data-testid="button-continue-shopping">
                  Ver Produtos
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold" data-testid="text-cart-title">
              Carrinho de Compras
            </h1>
            <Badge variant="secondary" data-testid="text-cart-count">
              {items.length} {items.length === 1 ? 'item' : 'itens'}
            </Badge>
          </div>

          <div className="space-y-4 mb-6">
            {items.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg mb-2" data-testid={`text-item-name-${index}`}>
                        {item.productName}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div data-testid={`text-item-dimensions-${index}`}>
                          Medidas: {item.width}m × {item.height}m = {item.area.toFixed(2)}m²
                        </div>
                        <div data-testid={`text-item-bando-${index}`}>
                          Bandô: {item.bandoSide === 'left' ? 'Esquerdo' : 'Direito'}
                        </div>
                        <div data-testid={`text-item-aluminum-bando-${index}`}>
                          Bandô de Alumínio: {item.aluminumBando ? `Sim (+R$ ${item.aluminumBandoPrice.toFixed(2)})` : 'Não'}
                        </div>
                        {item.colorName && (
                          <div className="flex items-center gap-2" data-testid={`text-item-color-${index}`}>
                            <span>Cor:</span>
                            {item.colorImage && (
                              <img 
                                src={item.colorImage} 
                                alt={item.colorName}
                                className="w-5 h-5 rounded border object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"%3E%3Crect width="20" height="20" fill="%23e5e7eb"/%3E%3C/svg%3E';
                                }}
                              />
                            )}
                            <span className="font-medium">{item.colorName}</span>
                            <span className="text-xs">({item.colorCode})</span>
                          </div>
                        )}
                        <div className="text-xs" data-testid={`text-item-price-per-sqm-${index}`}>
                          R$ {item.pricePerSqm.toFixed(2)}/m²
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <div className="font-bold text-xl text-[hsl(35,65%,55%)]" data-testid={`text-item-total-${index}`}>
                        R$ {item.totalPrice.toFixed(2)}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        data-testid={`button-remove-${index}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold">Total do Pedido:</span>
                <span className="text-3xl font-bold text-[hsl(35,65%,55%)]" data-testid="text-cart-total">
                  R$ {getTotalPrice().toFixed(2)}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={clearCart}
                  className="flex-1"
                  data-testid="button-clear-cart"
                >
                  Limpar Carrinho
                </Button>
                <Link href="/checkout" className="flex-1">
                  <Button className="w-full" size="lg" data-testid="button-checkout">
                    Finalizar Pedido
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 text-center">
            <Link href="/produtos">
              <Button variant="ghost" data-testid="button-continue-shopping-2">
                Continuar Comprando
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
