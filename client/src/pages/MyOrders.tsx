import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OrderItem {
  id: string;
  productName: string;
  width: string;
  height: string;
  totalPrice: string;
  colorName?: string;
  controlTypeName?: string;
}

interface Order {
  id: string;
  customerName: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  in_production: "Em Produção",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  confirmed: "default",
  in_production: "default",
  delivered: "outline",
  cancelled: "destructive",
};

export default function MyOrders() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useCustomerAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/customer/orders'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/cliente/login");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Meus Pedidos</h1>
          
          {!orders || orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground" data-testid="text-no-orders">
                  Você ainda não fez nenhum pedido
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} data-testid={`card-order-${order.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-order-id-${order.id}`}>
                          Pedido #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription data-testid={`text-order-date-${order.id}`}>
                          {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                        </CardDescription>
                      </div>
                      <Badge variant={statusVariants[order.status]} data-testid={`badge-status-${order.id}`}>
                        {statusLabels[order.status]}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-start border-b pb-3 last:border-0" data-testid={`item-${item.id}`}>
                          <div>
                            <p className="font-medium" data-testid={`text-product-name-${item.id}`}>{item.productName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.width} x {item.height} cm
                            </p>
                            {item.colorName && (
                              <p className="text-sm text-muted-foreground">
                                Cor: {item.colorName}
                              </p>
                            )}
                            {item.controlTypeName && (
                              <p className="text-sm text-muted-foreground">
                                Controle: {item.controlTypeName}
                              </p>
                            )}
                          </div>
                          <p className="font-semibold" data-testid={`text-price-${item.id}`}>
                            R$ {parseFloat(item.totalPrice).toFixed(2)}
                          </p>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-2">
                        <p className="font-bold">Total</p>
                        <p className="font-bold text-lg" data-testid={`text-total-${order.id}`}>
                          R$ {parseFloat(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
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
