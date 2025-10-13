import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import StatsCard from "@/components/StatsCard";
import DataTable from "@/components/DataTable";
import { Package, FolderTree, FileText, Image as ImageIcon } from "lucide-react";

export default function AdminDashboard() {
  const style = {
    "--sidebar-width": "16rem",
  };
  
  const productColumns = [
    { key: 'name', label: 'Nome' },
    { key: 'category', label: 'Categoria' },
    { key: 'price', label: 'Preço' },
    { key: 'status', label: 'Status' }
  ];
  
  const productData = [
    { id: '1', name: 'Persiana Blackout Premium', category: 'Blackout', price: 'R$ 299,90', status: 'Ativo' },
    { id: '2', name: 'Persiana Rolô Linho', category: 'Rolô', price: 'R$ 249,90', status: 'Ativo' },
    { id: '3', name: 'Persiana Vertical PVC', category: 'Vertical', price: 'R$ 349,90', status: 'Ativo' },
    { id: '4', name: 'Persiana Horizontal Alumínio', category: 'Horizontal', price: 'R$ 199,90', status: 'Inativo' },
    { id: '5', name: 'Persiana Blackout Total', category: 'Blackout', price: 'R$ 399,90', status: 'Ativo' }
  ];
  
  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-7xl mx-auto space-y-6">
              <div>
                <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total de Produtos"
                  value={156}
                  icon={Package}
                  trend={{ value: "+12% este mês", positive: true }}
                />
                <StatsCard
                  title="Categorias"
                  value={8}
                  icon={FolderTree}
                />
                <StatsCard
                  title="Páginas"
                  value={12}
                  icon={FileText}
                  trend={{ value: "+2 este mês", positive: true }}
                />
                <StatsCard
                  title="Imagens"
                  value={342}
                  icon={ImageIcon}
                  trend={{ value: "+28 esta semana", positive: true }}
                />
              </div>
              
              <DataTable
                title="Produtos Recentes"
                columns={productColumns}
                data={productData}
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
