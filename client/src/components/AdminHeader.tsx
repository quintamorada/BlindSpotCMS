import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-background">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <h1 className="text-xl font-semibold" data-testid="text-page-title">
          Dashboard
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" data-testid="button-notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <ThemeToggle />
        <Avatar data-testid="avatar-user">
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
