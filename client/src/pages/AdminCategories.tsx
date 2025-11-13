import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Edit, Upload, X, GripVertical, FileText } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Category, CategoryColor, CategoryControlType } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RequireAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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
                      <DialogDescription>
                        {editingCategory ? 'Edite as informações da categoria e suas cores' : 'Preencha as informações para criar uma nova categoria'}
                      </DialogDescription>
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

import type { TabFaqItem, TabDetailItem } from "@shared/schema";

function CategoryForm({ category, onClose }: { 
  category: Category | null; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const manualFileInputRef = useRef<HTMLInputElement>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(category);
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: category?.description || '',
    image: category?.image || '',
    tabDescription: (category as any)?.tabDescription || '',
    tabDetails: (category as any)?.tabDetails || [],
    tabInstallation: (category as any)?.tabInstallation || '',
    tabManualFile: (category as any)?.tabManualFile || '',
    tabFaq: (category as any)?.tabFaq || [],
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingManual, setUploadingManual] = useState(false);

  const presetImages = [
    { url: '/images/categories/blackout.png', label: 'Blackout' },
    { url: '/images/categories/rolo.png', label: 'Rolô' },
    { url: '/images/categories/vertical.png', label: 'Vertical' },
    { url: '/images/categories/horizontal.png', label: 'Horizontal' },
  ];

  const mutation = useMutation<Category, Error, any>({
    mutationFn: async (data: any) => {
      if (currentCategory) {
        const response = await apiRequest('PUT', `/api/categories/${currentCategory.id}`, data);
        return await response.json();
      } else {
        const response = await apiRequest('POST', '/api/categories', data);
        return await response.json();
      }
    },
    onSuccess: (newCategory: Category) => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ 
        title: currentCategory ? "Categoria atualizada!" : "Categoria criada!",
        description: currentCategory ? undefined : "Agora você pode adicionar cores para esta categoria.",
      });
      if (!currentCategory) {
        setCurrentCategory(newCategory);
      }
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    setUploading(true);
    try {
      const response = await fetch('/api/upload/category-image', {
        method: 'POST',
        body: uploadFormData,
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

  const handleManualUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({ 
        title: "Formato inválido",
        description: "Por favor, envie um arquivo PDF",
        variant: "destructive"
      });
      return;
    }

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    setUploadingManual(true);
    try {
      const response = await fetch('/api/upload/manual', {
        method: 'POST',
        body: uploadFormData,
        credentials: 'include',
      });

      if (!response.ok) {
        const text = (await response.text()) || response.statusText;
        throw new Error(`${response.status}: ${text}`);
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, tabManualFile: data.file }));
      toast({ title: "Manual enviado com sucesso!" });
    } catch (error) {
      toast({ 
        title: "Erro ao enviar manual",
        variant: "destructive"
      });
    } finally {
      setUploadingManual(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" data-testid="tab-basic">Básico</TabsTrigger>
            <TabsTrigger value="content" data-testid="tab-content">Conteúdo das Tabs</TabsTrigger>
            <TabsTrigger value="relations" disabled={!currentCategory} data-testid="tab-relations">
              Cores & Controles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
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
              <Label htmlFor="description">Descrição Curta</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                data-testid="input-category-description"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem da Categoria</Label>
              
              {formData.image && (
                <div className="mb-3">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 rounded object-cover border"
                    data-testid="img-category-preview"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"%3E%3Crect width="128" height="128" fill="%23e5e7eb"/%3E%3Ctext x="64" y="64" text-anchor="middle" dominant-baseline="middle" font-size="24" fill="%239ca3af"%3E?%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Imagens Pré-Definidas</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {presetImages.map((preset) => (
                      <button
                        key={preset.url}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: preset.url }))}
                        className={`relative aspect-square rounded border-2 overflow-hidden transition-all hover-elevate ${
                          formData.image === preset.url ? 'border-primary ring-2 ring-primary' : 'border-muted'
                        }`}
                        data-testid={`button-preset-${preset.label.toLowerCase()}`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-xs py-1 text-center">
                          {preset.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    data-testid="input-category-image-file"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="w-full"
                    data-testid="button-upload-category-image"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Enviando..." : "Fazer Upload de Imagem Personalizada"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Imagem quadrada (800x800px) para melhor resultado
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="tab-description">Descrição (Tab Descrição)</Label>
              <Textarea
                id="tab-description"
                value={formData.tabDescription}
                onChange={(e) => setFormData({ ...formData, tabDescription: e.target.value })}
                placeholder="Descrição completa que aparecerá na tab de descrição do produto..."
                rows={6}
                data-testid="input-tab-description"
              />
            </div>

            <div className="space-y-2">
              <Label>Detalhes Técnicos (Tab Detalhes)</Label>
              <p className="text-sm text-muted-foreground">Especificações técnicas que aparecerão em formato de tabela</p>
              <DetailsTableManager
                items={formData.tabDetails as TabDetailItem[]}
                onChange={(items) => setFormData({ ...formData, tabDetails: items })}
                disabled={mutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tab-installation">Instruções de Instalação (Tab Instalação)</Label>
              <Textarea
                id="tab-installation"
                value={formData.tabInstallation}
                onChange={(e) => setFormData({ ...formData, tabInstallation: e.target.value })}
                placeholder="Instruções de como instalar este tipo de persiana..."
                rows={6}
                data-testid="input-tab-installation"
              />
            </div>

            <div className="space-y-2">
              <Label>Manual (Tab Manual)</Label>
              <p className="text-sm text-muted-foreground">Arquivo PDF do manual de instalação</p>
              
              {formData.tabManualFile && (
                <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm flex-1">{formData.tabManualFile.split('/').pop()}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setFormData({ ...formData, tabManualFile: '' })}
                    data-testid="button-remove-manual"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <input
                ref={manualFileInputRef}
                type="file"
                accept="application/pdf"
                onChange={handleManualUpload}
                className="hidden"
                data-testid="input-manual-file"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => manualFileInputRef.current?.click()}
                disabled={uploadingManual}
                className="w-full"
                data-testid="button-upload-manual"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploadingManual ? "Enviando..." : formData.tabManualFile ? "Trocar Manual" : "Fazer Upload do Manual (PDF)"}
              </Button>
            </div>

            <div className="space-y-2">
              <Label>Perguntas Frequentes (Tab Dúvidas)</Label>
              <p className="text-sm text-muted-foreground">FAQ que aparecerá em formato de accordion</p>
              <FaqManager
                items={formData.tabFaq as TabFaqItem[]}
                onChange={(items) => setFormData({ ...formData, tabFaq: items })}
                disabled={mutation.isPending}
              />
            </div>
          </TabsContent>

          <TabsContent value="relations" className="space-y-4 mt-4">
            {currentCategory ? (
              <>
                <CategoryColorsManager categoryId={currentCategory.id} />
                <div className="pt-4" />
                <CategoryControlTypesManager categoryId={currentCategory.id} />
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Salve a categoria primeiro para gerenciar cores e tipos de controle
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end pt-4 border-t mt-6">
          <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancelar
          </Button>
          <Button type="submit" disabled={mutation.isPending || uploading || uploadingManual} data-testid="button-save">
            {mutation.isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </form>
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
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"%3E%3Crect width="48" height="48" fill="%23e5e7eb"/%3E%3Ctext x="24" y="24" text-anchor="middle" dominant-baseline="middle" font-size="12" fill="%239ca3af"%3E?%3C/text%3E%3C/svg%3E';
                    }}
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
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="32" y="32" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="%239ca3af"%3E?%3C/text%3E%3C/svg%3E';
              }}
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

function SortableControlTypeItem({
  controlType,
  onEdit,
  onDelete,
}: {
  controlType: CategoryControlType;
  onEdit: (controlType: CategoryControlType) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: controlType.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <Card className="overflow-visible">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing hover-elevate active-elevate-2 rounded p-1"
              data-testid={`drag-handle-${controlType.id}`}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground" />
            </div>
            <img
              src={controlType.image}
              alt={controlType.name}
              className="w-16 h-16 rounded object-cover border"
              data-testid={`img-control-type-${controlType.id}`}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"%3E%3Crect width="64" height="64" fill="%23e5e7eb"/%3E%3Ctext x="32" y="32" text-anchor="middle" dominant-baseline="middle" font-size="16" fill="%239ca3af"%3E?%3C/text%3E%3C/svg%3E';
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate" data-testid={`text-control-type-name-${controlType.id}`}>
                {controlType.name}
              </div>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(controlType)}
                data-testid={`button-edit-control-type-${controlType.id}`}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(controlType.id)}
                data-testid={`button-delete-control-type-${controlType.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CategoryControlTypesManager({ categoryId }: { categoryId: string }) {
  const { toast } = useToast();
  const [editingControlType, setEditingControlType] = useState<CategoryControlType | null>(null);
  const [showControlTypeForm, setShowControlTypeForm] = useState(false);
  const [items, setItems] = useState<CategoryControlType[]>([]);

  const { data: controlTypes, isLoading, error } = useQuery<CategoryControlType[]>({
    queryKey: [`/api/categories/${categoryId}/control-types`],
  });

  useEffect(() => {
    if (controlTypes) {
      setItems(controlTypes);
    }
  }, [controlTypes]);

  useEffect(() => {
    if (error) {
      toast({ 
        title: "Erro ao carregar tipos de acionamento",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const reorderMutation = useMutation({
    mutationFn: async (updates: Array<{ id: string; displayOrder: number }>) => {
      await apiRequest('PATCH', `/api/categories/${categoryId}/control-types/reorder`, { updates });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${categoryId}/control-types`] });
      toast({ title: "Ordem atualizada com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao atualizar ordem",
        variant: "destructive"
      });
    }
  });

  const deleteControlTypeMutation = useMutation({
    mutationFn: async (controlTypeId: string) => {
      await apiRequest('DELETE', `/api/categories/${categoryId}/control-types/${controlTypeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${categoryId}/control-types`] });
      toast({ title: "Tipo de acionamento deletado com sucesso!" });
    },
    onError: () => {
      toast({ 
        title: "Erro ao deletar tipo de acionamento",
        variant: "destructive"
      });
    }
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const previousItems = [...items];

      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      const updates = newItems.map((item, index) => ({
        id: item.id,
        displayOrder: index,
      }));

      reorderMutation.mutate(updates, {
        onError: () => {
          setItems(previousItems);
        }
      });
    }
  };

  const handleEditControlType = (controlType: CategoryControlType) => {
    setEditingControlType(controlType);
    setShowControlTypeForm(true);
  };

  const handleDeleteControlType = (controlTypeId: string) => {
    if (confirm('Tem certeza que deseja deletar este tipo de acionamento?')) {
      deleteControlTypeMutation.mutate(controlTypeId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Tipos de Acionamento</h3>
        <Button
          size="sm"
          onClick={() => {
            setEditingControlType(null);
            setShowControlTypeForm(true);
          }}
          data-testid="button-add-control-type"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Tipo
        </Button>
      </div>

      {showControlTypeForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
            <CardTitle className="text-base">
              {editingControlType ? 'Editar Tipo de Acionamento' : 'Novo Tipo de Acionamento'}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowControlTypeForm(false);
                setEditingControlType(null);
              }}
              data-testid="button-close-control-type-form"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <ControlTypeForm
              categoryId={categoryId}
              controlType={editingControlType}
              onClose={() => {
                setShowControlTypeForm(false);
                setEditingControlType(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <div className="text-sm text-muted-foreground">Carregando tipos de acionamento...</div>
      ) : items && items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {items.map((controlType) => (
                <SortableControlTypeItem
                  key={controlType.id}
                  controlType={controlType}
                  onEdit={handleEditControlType}
                  onDelete={handleDeleteControlType}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="text-sm text-muted-foreground text-center py-4 border rounded-md">
          Nenhum tipo de acionamento cadastrado
        </div>
      )}
    </div>
  );
}

function ControlTypeForm({ 
  categoryId, 
  controlType, 
  onClose 
}: { 
  categoryId: string; 
  controlType: CategoryControlType | null; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: controlType?.name || '',
    image: controlType?.image || '',
  });
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (controlType) {
        return await apiRequest('PUT', `/api/categories/${categoryId}/control-types/${controlType.id}`, data);
      } else {
        return await apiRequest('POST', `/api/categories/${categoryId}/control-types`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${categoryId}/control-types`] });
      toast({ 
        title: controlType ? "Tipo de acionamento atualizado!" : "Tipo de acionamento criado!",
      });
      onClose();
    },
    onError: () => {
      toast({ 
        title: "Erro ao salvar tipo de acionamento",
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
      const response = await fetch('/api/upload/control-type-image', {
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
        <Label htmlFor="control-type-name">Nome do Tipo de Acionamento</Label>
        <Input
          id="control-type-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: Lateral Esquerda"
          required
          data-testid="input-control-type-name"
        />
      </div>

      <div className="space-y-2">
        <Label>Imagem do Tipo de Acionamento</Label>
        <div className="flex items-center gap-3">
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 rounded object-cover border"
              data-testid="img-control-type-preview"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23e5e7eb"/%3E%3Ctext x="40" y="40" text-anchor="middle" dominant-baseline="middle" font-size="20" fill="%239ca3af"%3E?%3C/text%3E%3C/svg%3E';
              }}
            />
          )}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              data-testid="input-control-type-image-file"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              data-testid="button-upload-control-type-image"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Enviando..." : formData.image ? "Trocar Imagem" : "Upload Imagem"}
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              Imagem ilustrativa do tipo de acionamento (300x300px)
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel-control-type">
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending || uploading} data-testid="button-save-control-type">
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}

// Componente para gerenciar Detalhes Técnicos (tabela de especificações)
function DetailsTableManager({ 
  items, 
  onChange, 
  disabled 
}: { 
  items: TabDetailItem[]; 
  onChange: (items: TabDetailItem[]) => void;
  disabled?: boolean;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ label: '', value: '' });

  const handleAdd = () => {
    if (!formData.label || !formData.value) return;
    onChange([...items, formData]);
    setFormData({ label: '', value: '' });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(items[index]);
  };

  const handleUpdate = () => {
    if (editingIndex === null || !formData.label || !formData.value) return;
    const updated = [...items];
    updated[editingIndex] = formData;
    onChange(updated);
    setEditingIndex(null);
    setFormData({ label: '', value: '' });
  };

  const handleDelete = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ label: '', value: '' });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Label (ex: Composição)"
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            disabled={disabled}
            data-testid="input-detail-label"
          />
          <Input
            placeholder="Valor (ex: 100% Poliéster)"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            disabled={disabled}
            data-testid="input-detail-value"
          />
        </div>
        <div className="flex gap-2">
          {editingIndex === null ? (
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={disabled || !formData.label || !formData.value}
              data-testid="button-add-detail"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                onClick={handleUpdate}
                disabled={disabled || !formData.label || !formData.value}
                data-testid="button-update-detail"
              >
                Atualizar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={disabled}
                data-testid="button-cancel-detail"
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-medium">Especificação</th>
                <th className="text-left p-2 font-medium">Valor</th>
                <th className="w-24 p-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t" data-testid={`detail-row-${index}`}>
                  <td className="p-2">{item.label}</td>
                  <td className="p-2">{item.value}</td>
                  <td className="p-2">
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEdit(index)}
                        disabled={disabled}
                        className="h-7 w-7"
                        data-testid={`button-edit-detail-${index}`}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(index)}
                        disabled={disabled}
                        className="h-7 w-7"
                        data-testid={`button-delete-detail-${index}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Componente para gerenciar FAQ (Dúvidas)
function FaqManager({ 
  items, 
  onChange, 
  disabled 
}: { 
  items: TabFaqItem[]; 
  onChange: (items: TabFaqItem[]) => void;
  disabled?: boolean;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });

  const handleAdd = () => {
    if (!formData.question || !formData.answer) return;
    onChange([...items, formData]);
    setFormData({ question: '', answer: '' });
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setFormData(items[index]);
  };

  const handleUpdate = () => {
    if (editingIndex === null || !formData.question || !formData.answer) return;
    const updated = [...items];
    updated[editingIndex] = formData;
    onChange(updated);
    setEditingIndex(null);
    setFormData({ question: '', answer: '' });
  };

  const handleDelete = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setFormData({ question: '', answer: '' });
  };

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Input
          placeholder="Pergunta (ex: Consigo instalar sozinha?)"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          disabled={disabled}
          data-testid="input-faq-question"
        />
        <Textarea
          placeholder="Resposta..."
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          disabled={disabled}
          rows={3}
          data-testid="input-faq-answer"
        />
        <div className="flex gap-2">
          {editingIndex === null ? (
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={disabled || !formData.question || !formData.answer}
              data-testid="button-add-faq"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Pergunta
            </Button>
          ) : (
            <>
              <Button
                type="button"
                size="sm"
                onClick={handleUpdate}
                disabled={disabled || !formData.question || !formData.answer}
                data-testid="button-update-faq"
              >
                Atualizar
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={disabled}
                data-testid="button-cancel-faq"
              >
                Cancelar
              </Button>
            </>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="space-y-2">
          {items.map((item, index) => (
            <Card key={index} data-testid={`faq-item-${index}`}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 p-3">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.question}</p>
                  <p className="text-sm text-muted-foreground mt-1">{item.answer}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEdit(index)}
                    disabled={disabled}
                    className="h-7 w-7"
                    data-testid={`button-edit-faq-${index}`}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(index)}
                    disabled={disabled}
                    className="h-7 w-7"
                    data-testid={`button-delete-faq-${index}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminCategories() {
  return (
    <RequireAuth>
      <AdminCategoriesContent />
    </RequireAuth>
  );
}
