import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Order, OrderItem } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { RequireAuth } from "@/lib/auth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type OrderWithItems = Order & { items: OrderItem[] };

function AdminOrdersContent() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithItems | null>(null);

  const { data: orders, isLoading } = useQuery<OrderWithItems[]>({
    queryKey: ['/api/orders'],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest('PATCH', `/api/orders/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      if (selectedOrder) {
        setSelectedOrder({ ...selectedOrder, status: variables.status as any });
      }
      toast({ title: "Status atualizado com sucesso!" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar status",
        variant: "destructive"
      });
    }
  });

  const style = {
    "--sidebar-width": "16rem",
  };

  const columns = [
    { key: 'customerName', label: 'Cliente' },
    { key: 'customerEmail', label: 'E-mail' },
    { key: 'customerPhone', label: 'Telefone' },
    { key: 'totalAmount', label: 'Total' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Data' }
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      pending: { label: "Pendente", variant: "secondary" },
      confirmed: { label: "Confirmado", variant: "default" },
      in_production: { label: "Em Produção", variant: "outline" },
      delivered: { label: "Entregue", variant: "default" },
      cancelled: { label: "Cancelado", variant: "destructive" }
    };
    const config = variants[status] || { label: status, variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const data = orders?.map(o => ({
    id: o.id,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    customerPhone: o.customerPhone,
    totalAmount: `R$ ${parseFloat(o.totalAmount).toFixed(2)}`,
    status: o.status,
    createdAt: new Date(o.createdAt).toLocaleDateString('pt-BR')
  })) || [];

  const handleView = (id: string) => {
    const order = orders?.find(o => o.id === id);
    if (order) {
      setSelectedOrder(order);
      setDialogOpen(true);
    }
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Pedidos</h2>
              </div>

              {isLoading ? (
                <div className="text-center py-12">Carregando...</div>
              ) : (
                <DataTable
                  title="Todos os Pedidos"
                  columns={columns}
                  data={data}
                  onView={handleView}
                  renderCell={(column, value, row) => {
                    if (column.key === 'status') {
                      return getStatusBadge(value as string);
                    }
                    return value;
                  }}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {selectedOrder && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes do Pedido</DialogTitle>
              <DialogDescription>
                Visualize e gerencie as informações do pedido
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Cliente</Label>
                  <div className="font-medium" data-testid="text-order-customer">
                    {selectedOrder.customerName}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">E-mail</Label>
                  <div className="font-medium" data-testid="text-order-email">
                    {selectedOrder.customerEmail}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Telefone</Label>
                  <div className="font-medium" data-testid="text-order-phone">
                    {selectedOrder.customerPhone}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Data do Pedido</Label>
                  <div className="font-medium">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Status do Pedido</Label>
                <Select
                  key={selectedOrder.id}
                  value={selectedOrder.status}
                  onValueChange={(value) => {
                    updateStatusMutation.mutate({ id: selectedOrder.id, status: value });
                  }}
                  disabled={updateStatusMutation.isPending}
                >
                  <SelectTrigger data-testid="select-order-status" disabled={updateStatusMutation.isPending}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending" data-testid="select-status-pending">Pendente</SelectItem>
                    <SelectItem value="confirmed" data-testid="select-status-confirmed">Confirmado</SelectItem>
                    <SelectItem value="in_production" data-testid="select-status-in-production">Em Produção</SelectItem>
                    <SelectItem value="delivered" data-testid="select-status-delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled" data-testid="select-status-cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                {updateStatusMutation.isPending && (
                  <p className="text-sm text-muted-foreground mt-1">Atualizando status...</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-3">Itens do Pedido</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="font-medium text-lg" data-testid={`text-item-product-${index}`}>
                            {item.productName}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Medidas:</span>{" "}
                              <span data-testid={`text-item-dimensions-${index}`}>
                                {parseFloat(item.width)}m × {parseFloat(item.height)}m
                              </span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Bandô:</span>{" "}
                              <span data-testid={`text-item-bando-${index}`}>
                                {item.bandoSide === 'left' ? 'Esquerdo' : 'Direito'}
                              </span>
                            </div>
                            {item.colorName && (
                              <div className="col-span-2">
                                <span className="text-muted-foreground">Cor:</span>{" "}
                                <span data-testid={`text-item-color-${index}`}>
                                  {item.colorName} ({item.colorCode})
                                </span>
                              </div>
                            )}
                            <div>
                              <span className="text-muted-foreground">Preço/m²:</span>{" "}
                              R$ {parseFloat(item.pricePerSqm).toFixed(2)}
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-[hsl(35,65%,55%)]" data-testid={`text-item-total-${index}`}>
                                R$ {parseFloat(item.totalPrice).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total do Pedido:</span>
                  <span className="text-[hsl(35,65%,55%)]" data-testid="text-order-total">
                    R$ {parseFloat(selectedOrder.totalAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              <Button variant="outline" onClick={() => setDialogOpen(false)} className="w-full" data-testid="button-close-order">
                Fechar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </SidebarProvider>
  );
}

export default function AdminOrders() {
  return (
    <RequireAuth>
      <AdminOrdersContent />
    </RequireAuth>
  );
}
