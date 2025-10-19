import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";
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
import { X, Upload, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@shared/schema";
import { RequireAuth } from "@/lib/auth";

function AdminProductsRealContent() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ title: "Produto deletado com sucesso!" });
    },
  });

  const style = {
    "--sidebar-width": "16rem",
  };
  
  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'categoryId', label: 'Categoria' },
    { key: 'price', label: 'Preço' },
    { key: 'active', label: 'Status' }
  ];
  
  const data = products?.map(p => ({
    id: p.id,
    name: p.name,
    categoryId: categories?.find(c => c.id === p.categoryId)?.name || '-',
    price: `R$ ${parseFloat(p.price).toFixed(2)}`,
    active: p.active ? 'Ativo' : 'Inativo'
  })) || [];
  
  const handleEdit = (id: string) => {
    const product = products?.find(p => p.id === id);
    if (product) {
      setEditingProduct(product);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este produto?')) {
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
                <h2 className="text-3xl font-bold">Produtos</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingProduct(null)} data-testid="button-add-product">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                      </DialogTitle>
                    </DialogHeader>
                    <ProductForm 
                      product={editingProduct} 
                      categories={categories || []}
                      onClose={() => {
                        setDialogOpen(false);
                        setEditingProduct(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">Carregando...</div>
              ) : (
                <DataTable
                  title="Todos os Produtos"
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

function ProductForm({ product, categories, onClose }: { 
  product: Product | null; 
  categories: Category[];
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || '',
    categoryId: product?.categoryId || '',
    images: product?.images || [],
    featured: product?.featured || false,
    active: product?.active !== false,
  });
  const [uploading, setUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (product) {
        return await apiRequest('PUT', `/api/products/${product.id}`, data);
      } else {
        return await apiRequest('POST', '/api/products', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({ 
        title: product ? "Produto atualizado!" : "Produto criado!",
      });
      onClose();
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      Array.from(files).forEach(file => {
        formDataUpload.append('images', file);
      });

      const response = await fetch('/api/upload/product-images', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload das imagens');
      }

      const data = await response.json();
      
      // Salvar apenas a URL da versão large, o thumb é gerado automaticamente pelo nome
      const newImageUrls = data.images.map((img: any) => img.large);
      setFormData({ 
        ...formData, 
        images: [...formData.images, ...newImageUrls] 
      });

      toast({ 
        title: "Imagens enviadas com sucesso!",
        description: `${data.images.length} imagem(ns) processada(s) e otimizada(s)`
      });
    } catch (error) {
      toast({ 
        title: "Erro ao fazer upload", 
        description: "Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

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
          data-testid="input-product-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
          data-testid="input-product-slug"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          data-testid="input-product-description"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Preço</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
            data-testid="input-product-price"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria</Label>
          <Select 
            value={formData.categoryId} 
            onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          >
            <SelectTrigger data-testid="select-product-category">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Imagens do Produto</Label>
        <div className="space-y-4">
          {formData.images.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={url} 
                    alt={`Imagem ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newImages = formData.images.filter((_, i) => i !== index);
                      setFormData({ ...formData, images: newImages });
                    }}
                    data-testid={`button-remove-image-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploading}
              data-testid="input-image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-2">
                {uploading ? (
                  <>
                    <Loader2 className="h-10 w-10 text-muted-foreground animate-spin" />
                    <p className="text-sm text-muted-foreground">Fazendo upload...</p>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground" />
                    <p className="text-sm font-medium">Clique para fazer upload</p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG ou WebP (máx. 5MB por imagem)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Você pode selecionar múltiplas imagens
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
          Cancelar
        </Button>
        <Button type="submit" disabled={mutation.isPending} data-testid="button-save">
          {mutation.isPending ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  );
}

export default function AdminProductsReal() {
  return (
    <RequireAuth>
      <AdminProductsRealContent />
    </RequireAuth>
  );
}
