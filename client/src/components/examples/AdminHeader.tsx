import AdminHeader from '../AdminHeader';
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminHeaderExample() {
  return (
    <SidebarProvider>
      <AdminHeader />
    </SidebarProvider>
  );
}
