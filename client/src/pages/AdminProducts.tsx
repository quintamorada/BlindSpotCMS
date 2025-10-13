import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function AdminProducts() {
  const style = {
    "--sidebar-width": "16rem",
  };
  
  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'price', label: 'Preço' },
    { key: 'stock', label: 'Estoque' },
    { key: 'status', label: 'Status' }
  ];
  
  const data = [
    { id: '1', name: 'Persiana Blackout Premium', category: 'Blackout', price: 'R$ 299,90', stock: '45', status: 'Ativo' },
    { id: '2', name: 'Persiana Rolô Linho', category: 'Rolô', price: 'R$ 249,90', stock: '32', status: 'Ativo' },
    { id: '3', name: 'Persiana Vertical PVC', category: 'Vertical', price: 'R$ 349,90', stock: '28', status: 'Ativo' },
    { id: '4', name: 'Persiana Horizontal Alumínio', category: 'Horizontal', price: 'R$ 199,90', stock: '0', status: 'Inativo' },
    { id: '5', name: 'Persiana Blackout Total', category: 'Blackout', price: 'R$ 399,90', stock: '18', status: 'Ativo' },
    { id: '6', name: 'Persiana Rolô Screen', category: 'Rolô', price: 'R$ 279,90', stock: '24', status: 'Ativo' },
    { id: '7', name: 'Persiana Vertical Tecido', category: 'Vertical', price: 'R$ 429,90', stock: '15', status: 'Ativo' },
    { id: '8', name: 'Persiana Horizontal Madeira', category: 'Horizontal', price: 'R$ 499,90', stock: '8', status: 'Ativo' }
  ];
  
  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Produtos</h2>
                <Button data-testid="button-add-product">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Produto
                </Button>
              </div>
              
              <DataTable
                title="Todos os Produtos"
                columns={columns}
                data={data}
                onEdit={(id) => console.log('Editar produto:', id)}
                onDelete={(id) => console.log('Deletar produto:', id)}
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
