import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Upload, X } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Category, CategoryColor } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RequireAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="space-y-6 max-h-[80vh] overflow-y-auto">
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

      {category && (
        <div className="pt-4 border-t">
          <CategoryColorsManager categoryId={category.id} />
        </div>
      )}
    </div>
  );
}

function CategoryColorsManager({ categoryId }: { categoryId: string }) {
  const { toast } = useToast();
  const [editingColor, setEditingColor] = useState<CategoryColor | null>(null);
  const [showColorForm, setShowColorForm] = useState(false);

  const { data: colors, isLoading, error } = useQuery<CategoryColor[]>({
    queryKey: [`/api/categories/${categoryId}/colors`],
  });

  useEffect(() => {
    if (error) {
      toast({ 
        title: "Erro ao carregar cores",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const deleteColorMutation = useMutation({
    mutationFn: async (colorId: string) => {
      await apiRequest('DELETE', `/api/categories/${categoryId}/colors/${colorId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${categoryId}/colors`] });
      toast({ title: "Cor deletada com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao deletar cor",
        variant: "destructive"
      });
    }
  });

  const handleEditColor = (color: CategoryColor) => {
    setEditingColor(color);
    setShowColorForm(true);
  };

  const handleDeleteColor = (colorId: string) => {
    if (confirm('Tem certeza que deseja deletar esta cor?')) {
      deleteColorMutation.mutate(colorId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Cores Disponíveis</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingColor(null);
            setShowColorForm(true);
          }}
          data-testid="button-add-color"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Cor
        </Button>
      </div>

      {showColorForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
            <CardTitle className="text-base">
              {editingColor ? 'Editar Cor' : 'Nova Cor'}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowColorForm(false);
                setEditingColor(null);
              }}
              data-testid="button-close-color-form"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ColorForm
              categoryId={categoryId}
              color={editingColor}
              onClose={() => {
                setShowColorForm(false);
                setEditingColor(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando cores...</div>
      ) : colors && colors.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {colors.map((color) => (
            <Card key={color.id} className="overflow-hidden">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <img
                    src={color.image}
                    alt={color.name}
                    className="w-12 h-12 rounded object-cover border"
                    data-testid={`img-color-${color.id}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate" data-testid={`text-color-name-${color.id}`}>
                      {color.name}
                    </div>
                    <div className="text-xs text-muted-foreground" data-testid={`text-color-code-${color.id}`}>
                      {color.code}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditColor(color)}
                      data-testid={`button-edit-color-${color.id}`}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteColor(color.id)}
                      data-testid={`button-delete-color-${color.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
          Nenhuma cor cadastrada
        </div>
      )}
    </div>
  );
}

function ColorForm({ 
  categoryId, 
  color, 
  onClose 
}: { 
  categoryId: string; 
  color: CategoryColor | null; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: color?.name || '',
    code: color?.code || '',
    image: color?.image || '',
  });
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (color) {
        return await apiRequest('PUT', `/api/categories/${categoryId}/colors/${color.id}`, data);
      } else {
        return await apiRequest('POST', `/api/categories/${categoryId}/colors`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${categoryId}/colors`] });
      toast({ 
        title: color ? "Cor atualizada!" : "Cor criada!",
      });
      onClose();
    },
    onError: () => {
      toast({ 
        title: "Erro ao salvar cor",
        variant: "destructive"
      });
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const response = await fetch('/api/upload/color-image', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        const text = (await response.text()) || response.statusText;
        throw new Error(`${response.status}: ${text}`);
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: data.image }));
      toast({ title: "Imagem enviada com sucesso!" });
    } catch (error) {
      toast({ 
        title: "Erro ao enviar imagem",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast({ 
        title: "Por favor, faça upload de uma imagem",
        variant: "destructive"
      });
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="color-name">Nome da Cor</Label>
        <Input
          id="color-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Azul Claro"
          required
          data-testid="input-color-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="color-code">Código da Cor</Label>
        <Input
          id="color-code"
          value={formData.code}
          onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          placeholder="Ex: #3B82F6 ou RGB(59, 130, 246)"
          required
          data-testid="input-color-code"
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem da Cor</Label>
        <div className="flex items-center gap-3">
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-16 h-16 rounded object-cover border"
              data-testid="img-color-preview"
            />
          )}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              data-testid="input-color-image-file"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              data-testid="button-upload-color-image"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Enviando..." : formData.image ? "Trocar Imagem" : "Upload Imagem"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Imagem pequena (100x100px)
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-color">
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending || uploading} data-testid="button-save-color">
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
