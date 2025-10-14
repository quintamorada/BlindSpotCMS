import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RequireAuth } from "@/lib/auth";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
}

function AdminUsersContent() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ title: "Usuário deletado com sucesso!" });
    },
  });

  const style = {
    "--sidebar-width": "16rem",
  };
  
  const columns = [
    { key: 'username', label: 'Usuário' },
    { key: 'email', label: 'E-mail' },
    { key: 'role', label: 'Perfil' },
    { key: 'active', label: 'Status' }
  ];
  
  const data = users?.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    role: u.role === 'admin' ? 'Administrador' : 'Editor',
    active: u.active ? 'Ativo' : 'Inativo'
  })) || [];
  
  const handleEdit = (id: string) => {
    const user = users?.find(u => u.id === id);
    if (user) {
      setEditingUser(user);
      setDialogOpen(true);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
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
                <h2 className="text-3xl font-bold">Usuários</h2>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingUser(null)} data-testid="button-add-user">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
                      </DialogTitle>
                    </DialogHeader>
                    <UserForm 
                      user={editingUser} 
                      onClose={() => {
                        setDialogOpen(false);
                        setEditingUser(null);
                      }} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
              
              {isLoading ? (
                <div className="text-center py-12">Carregando...</div>
              ) : (
                <DataTable
                  title="Todos os Usuários"
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

function UserForm({ user, onClose }: { 
  user: User | null; 
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'editor',
    active: user?.active !== false,
  });

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      if (user) {
        const updateData = { ...data };
        if (!updateData.password) {
          delete updateData.password;
        }
        return await apiRequest('PUT', `/api/users/${user.id}`, updateData);
      } else {
        return await apiRequest('POST', '/api/users', data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({ 
        title: user ? "Usuário atualizado!" : "Usuário criado!",
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
        <Label htmlFor="username">Nome de Usuário</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          data-testid="input-user-username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          data-testid="input-user-email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha {user && '(deixe em branco para manter a atual)'}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required={!user}
          data-testid="input-user-password"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Perfil</Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
        >
          <SelectTrigger data-testid="select-user-role">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) => setFormData({ ...formData, active: checked as boolean })}
          data-testid="checkbox-user-active"
        />
        <Label htmlFor="active" className="cursor-pointer">Ativo</Label>
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

export default function AdminUsers() {
  return (
    <RequireAuth>
      <AdminUsersContent />
    </RequireAuth>
  );
}
