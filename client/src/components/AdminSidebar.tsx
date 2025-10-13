import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Package, 
  FolderTree, 
  FileText, 
  Image as ImageIcon,
  Settings,
  Home
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    url: "/admin/produtos",
    icon: Package,
  },
  {
    title: "Categorias",
    url: "/admin/categorias",
    icon: FolderTree,
  },
  {
    title: "Páginas",
    url: "/admin/paginas",
    icon: FileText,
  },
  {
    title: "Imagens",
    url: "/admin/imagens",
    icon: ImageIcon,
  },
  {
    title: "Configurações",
    url: "/admin/configuracoes",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const [location] = useLocation();
  
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/">
          <div className="flex items-center gap-2 hover-elevate p-2 rounded-md">
            <Home className="h-5 w-5" />
            <span className="font-serif text-lg font-bold">Persianas CMS</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Gerenciamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase()}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
