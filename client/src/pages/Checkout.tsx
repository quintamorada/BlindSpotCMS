import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ShoppingCart } from "lucide-react";
import { Link } from "wouter";

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const isValidCustomerInfo = customerName.trim() !== "" && customerEmail.trim() !== "" && customerPhone.trim() !== "";

  const createOrderMutation = useMutation({
    mutationFn: async (orderDetails: any) => {
      return await apiRequest('POST', '/api/orders', orderDetails);
    },
    onSuccess: () => {
      toast({
        title: "Pedido criado com sucesso!",
        description: "Entraremos em contato em breve para confirmar sua compra.",
      });
      clearCart();
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const handleConfirmOrder = () => {
    if (!isValidCustomerInfo || items.length === 0) return;

    const orderDetails = {
      order: {
        customerName,
        customerEmail,
        customerPhone,
        totalAmount: getTotalPrice().toString(),
        status: "pending"
      },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        width: item.width.toString(),
        height: item.height.toString(),
        bandoSide: item.bandoSide,
        colorId: item.colorId,
        colorName: item.colorName,
        colorCode: item.colorCode,
        aluminumBando: item.aluminumBando,
        aluminumBandoPrice: item.aluminumBandoPrice.toString(),
        verticalControl: item.verticalControl,
        verticalBando: item.verticalBando,
        pricePerSqm: item.pricePerSqm.toString(),
        totalPrice: item.totalPrice.toString()
      }))
    };

    createOrderMutation.mutate(orderDetails);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="py-16">
              <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Carrinho vazio</h2>
              <p className="text-muted-foreground mb-6">
                Adicione produtos ao carrinho antes de finalizar o pedido
              </p>
              <Link href="/produtos">
                <Button data-testid="button-go-shopping">
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
          <h1 className="text-3xl font-bold mb-6">Finalizar Pedido</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Seus Dados</h2>

                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Nome Completo</Label>
                    <Input
                      id="customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome"
                      required
                      data-testid="input-customer-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-email">E-mail</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      data-testid="input-customer-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customer-phone">Telefone/WhatsApp</Label>
                    <Input
                      id="customer-phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      required
                      data-testid="input-customer-phone"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Resumo do Pedido</h2>

                  <div className="space-y-3 mb-4">
                    {items.map((item, index) => (
                      <div key={index} className="pb-3 border-b last:border-0">
                        <div className="font-medium text-sm" data-testid={`text-checkout-item-${index}`}>
                          {item.productName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.width}m × {item.height}m ({item.area.toFixed(2)}m²)
                        </div>
                        {item.colorName && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            {item.colorImage && (
                              <img 
                                src={item.colorImage} 
                                alt={item.colorName}
                                className="w-4 h-4 rounded border object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"%3E%3Crect width="16" height="16" fill="%23e5e7eb"/%3E%3C/svg%3E';
                                }}
                              />
                            )}
                            <span>{item.colorName}</span>
                          </div>
                        )}
                        <div className="text-sm font-medium mt-1">
                          R$ {item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-6">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-2xl font-bold text-[hsl(35,65%,55%)]" data-testid="text-checkout-total">
                        R$ {getTotalPrice().toFixed(2)}
                      </span>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleConfirmOrder}
                      disabled={!isValidCustomerInfo || createOrderMutation.isPending}
                      data-testid="button-confirm-order"
                    >
                      {createOrderMutation.isPending ? "Processando..." : "Confirmar Pedido"}
                    </Button>

                    <Link href="/carrinho">
                      <Button variant="ghost" className="w-full mt-2" data-testid="button-back-to-cart">
                        Voltar ao Carrinho
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
