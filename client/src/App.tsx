import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import NotFound from "@/pages/not-found";
import HomeReal from "@/pages/HomeReal";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProductsReal from "@/pages/AdminProductsReal";
import AdminCategories from "@/pages/AdminCategories";
import AdminPages from "@/pages/AdminPages";
import AdminUsers from "@/pages/AdminUsers";
import AdminOrders from "@/pages/AdminOrders";
import AdminSettings from "@/pages/AdminSettings";
import Login from "@/pages/Login";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import Products from "@/pages/Products";
import ProductConfig from "@/pages/ProductConfig";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeReal} />
      <Route path="/produtos" component={Products} />
      <Route path="/produto/:slug" component={ProductConfig} />
      <Route path="/carrinho" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/contato" component={Contact} />
      <Route path="/sobre" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/produtos" component={AdminProductsReal} />
      <Route path="/admin/categorias" component={AdminCategories} />
      <Route path="/admin/paginas" component={AdminPages} />
      <Route path="/admin/usuarios" component={AdminUsers} />
      <Route path="/admin/pedidos" component={AdminOrders} />
      <Route path="/admin/configuracoes" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
