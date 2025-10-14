import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";

export default function AdminHeader() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      toast({
        title: "Logout realizado com sucesso",
      });
      setLocation("/login");
    } catch (error) {
      toast({
        title: "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <h1 className="text-xl font-semibold" data-testid="text-page-title">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground mr-2">
          {user?.username}
        </div>
        <Button size="icon" variant="ghost" onClick={handleLogout} data-testid="button-logout">
          <LogOut className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <Avatar data-testid="avatar-user">
          <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
