import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Ruler, Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import bandoLeftImg from "@assets/generated_images/Blinds_cord_left_side_a7dc741f.png";
import bandoRightImg from "@assets/generated_images/Blinds_cord_right_side_408c3c17.png";

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
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const { toast } = useToast();

  const { data: products } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const product = products?.find(p => p.slug === slug);

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
  const totalPrice = area * pricePerSqm;

  const isValidConfig = widthNum > 0 && heightNum > 0 && bandoSide !== null;
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
      setShowCheckoutDialog(false);
      setWidth("");
      setHeight("");
      setBandoSide(null);
      setCustomerName("");
      setCustomerEmail("");
      setCustomerPhone("");
    },
    onError: () => {
      toast({
        title: "Erro ao criar pedido",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const handleAddToCart = () => {
    if (!isValidConfig) return;
    setShowCheckoutDialog(true);
  };

  const handleConfirmOrder = () => {
    if (!isValidCustomerInfo || !isValidConfig) return;

    const orderDetails = {
      order: {
        customerName,
        customerEmail,
        customerPhone,
        totalAmount: totalPrice.toString(),
        status: "pending"
      },
      items: [{
        productId: product.id,
        productName: product.name,
        width: widthNum.toString(),
        height: heightNum.toString(),
        bandoSide,
        pricePerSqm: pricePerSqm.toString(),
        totalPrice: totalPrice.toString()
      }]
    };

    createOrderMutation.mutate(orderDetails);
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

                <div className="space-y-2">
                  <Label>Lado do Bandô (Cordinha)</Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Clique na imagem para selecionar o lado onde ficará a cordinha
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

                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={!isValidConfig}
                  onClick={handleAddToCart}
                  data-testid="button-add-to-cart"
                >
                  {!isValidConfig 
                    ? "Complete a configuração" 
                    : "Adicionar ao Pedido"}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize seu Pedido</DialogTitle>
            <DialogDescription>
              Preencha seus dados para que possamos entrar em contato e confirmar seu pedido.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="font-medium">{product.name}</div>
              <div className="text-sm text-muted-foreground">
                {widthNum}m × {heightNum}m = {area.toFixed(2)}m²
              </div>
              <div className="text-sm text-muted-foreground">
                Bandô: {bandoSide === 'left' ? 'Esquerdo' : 'Direito'}
              </div>
              <div className="font-bold text-lg text-[hsl(35,65%,55%)]">
                Total: R$ {totalPrice.toFixed(2)}
              </div>
            </div>

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

            <div className="flex gap-2 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCheckoutDialog(false)}
                data-testid="button-cancel-order"
              >
                Cancelar
              </Button>
              <Button 
                className="flex-1"
                onClick={handleConfirmOrder}
                disabled={!isValidCustomerInfo || createOrderMutation.isPending}
                data-testid="button-confirm-order"
              >
                {createOrderMutation.isPending ? "Enviando..." : "Confirmar Pedido"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
