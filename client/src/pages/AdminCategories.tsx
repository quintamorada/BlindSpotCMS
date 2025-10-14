import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Category } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RequireAuth } from "@/lib/auth";

function AdminCategoriesContent() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "Categoria deletada com sucesso!" });
    },
  });

  const style = {
    "--sidebar-width": "16rem",
  };
  
  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'slug', label: 'Slug' },
    { key: 'description', label: 'Descrição' }
  ];
  
  const data = categories?.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '-'
  })) || [];
  
  const handleEdit = (id: string) => {
    const category = categories?.find(c => c.id === id);
    if (category) {
      setEditingCategory(category);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta categoria?')) {
      deleteMutation.mutate(id);
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
                <h2 className="text-3xl font-bold">Categorias</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingCategory(null)} data-testid="button-add-category">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Categoria
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                      </DialogTitle>
                    </DialogHeader>
                    <CategoryForm 
                      category={editingCategory} 
                      onClose={() => {
                        setDialogOpen(false);
                        setEditingCategory(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">Carregando...</div>
              ) : (
                <DataTable
                  title="Todas as Categorias"
                  columns={columns}
                  data={data}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function CategoryForm({ category, onClose }: { 
  category: Category | null; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (category) {
        return await apiRequest('PUT', `/api/categories/${category.id}`, data);
      } else {
        return await apiRequest('POST', '/api/categories', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ 
        title: category ? "Categoria atualizada!" : "Categoria criada!",
      });
      onClose();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          data-testid="input-category-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          data-testid="input-category-slug"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          data-testid="input-category-description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">URL da Imagem</Label>
        <Input
          id="image"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          data-testid="input-category-image"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending} data-testid="button-save">
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

export default function AdminCategories() {
  return (
    <RequireAuth>
      <AdminCategoriesContent />
    </RequireAuth>
  );
}
