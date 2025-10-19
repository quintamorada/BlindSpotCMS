import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomeReal from "@/pages/HomeReal";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProductsReal from "@/pages/AdminProductsReal";
import AdminCategories from "@/pages/AdminCategories";
import AdminPages from "@/pages/AdminPages";
import AdminUsers from "@/pages/AdminUsers";
import Login from "@/pages/Login";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductConfig from "@/pages/ProductConfig";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeReal} />
      <Route path="/produtos" component={Products} />
      <Route path="/produto/:slug" component={ProductConfig} />
      <Route path="/contato" component={Contact} />
      <Route path="/sobre" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/produtos" component={AdminProductsReal} />
      <Route path="/admin/categorias" component={AdminCategories} />
      <Route path="/admin/paginas" component={AdminPages} />
      <Route path="/admin/usuarios" component={AdminUsers} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
