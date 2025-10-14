import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Page } from "@shared/schema";
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
import { Checkbox } from "@/components/ui/checkbox";
import { RequireAuth } from "@/lib/auth";

function AdminPagesContent() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  
  const { data: pages, isLoading } = useQuery<Page[]>({
    queryKey: ['/api/pages'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      toast({ title: "Página deletada com sucesso!" });
    },
  });

  const style = {
    "--sidebar-width": "16rem",
  };
  
  const columns = [
    { key: 'title', label: 'Título' },
    { key: 'slug', label: 'Slug' },
    { key: 'published', label: 'Status' }
  ];
  
  const data = pages?.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    published: p.published ? 'Publicado' : 'Rascunho'
  })) || [];
  
  const handleEdit = (id: string) => {
    const page = pages?.find(p => p.id === id);
    if (page) {
      setEditingPage(page);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta página?')) {
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
                <h2 className="text-3xl font-bold">Páginas</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingPage(null)} data-testid="button-add-page">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Página
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingPage ? 'Editar Página' : 'Nova Página'}
                      </DialogTitle>
                    </DialogHeader>
                    <PageForm 
                      page={editingPage} 
                      onClose={() => {
                        setDialogOpen(false);
                        setEditingPage(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">Carregando...</div>
              ) : (
                <DataTable
                  title="Todas as Páginas"
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

function PageForm({ page, onClose }: { 
  page: Page | null; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: page?.title || '',
    slug: page?.slug || '',
    content: page?.content || '',
    metaDescription: page?.metaDescription || '',
    published: page?.published || false,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (page) {
        return await apiRequest('PUT', `/api/pages/${page.id}`, data);
      } else {
        return await apiRequest('POST', '/api/pages', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/pages'] });
      toast({ 
        title: page ? "Página atualizada!" : "Página criada!",
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
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          data-testid="input-page-title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          data-testid="input-page-slug"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="min-h-[200px]"
          data-testid="input-page-content"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="metaDescription">Meta Descrição</Label>
        <Textarea
          id="metaDescription"
          value={formData.metaDescription}
          onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
          data-testid="input-page-meta"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="published"
          checked={formData.published}
          onCheckedChange={(checked) => setFormData({ ...formData, published: checked as boolean })}
          data-testid="checkbox-published"
        />
        <Label htmlFor="published" className="cursor-pointer">Publicar</Label>
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

export default function AdminPages() {
  return (
    <RequireAuth>
      <AdminPagesContent />
    </RequireAuth>
  );
}
