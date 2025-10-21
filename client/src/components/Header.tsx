import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Menu } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const cartItemsCount = getTotalItems();
  
  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });
  
  const siteTitle = settings?.siteTitle || "Persianas Premium";
  
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-2">
            <div className="font-serif text-2xl font-bold text-foreground" data-testid="text-logo">
              {siteTitle}
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-home">
              <span className="text-sm font-medium">Início</span>
            </Link>
            <Link href="/produtos" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-products">
              <span className="text-sm font-medium">Produtos</span>
            </Link>
            <Link href="/sobre" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-about">
              <span className="text-sm font-medium">Sobre</span>
            </Link>
            <Link href="/contato" className="hover-elevate px-3 py-2 rounded-md" data-testid="link-contact">
              <span className="text-sm font-medium">Contato</span>
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search"
                placeholder="Buscar produtos..." 
                className="pl-9 w-64"
                data-testid="input-search"
              />
            </div>
            
            <Link href="/carrinho">
              <Button size="icon" variant="ghost" className="relative" data-testid="button-cart">
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    data-testid="badge-cart-count"
                  >
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <ThemeToggle />
            
            <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="button-menu">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 pb-2" data-testid="nav-mobile">
            <Link href="/" className="hover-elevate px-3 py-2 rounded-md">
              <span className="text-sm font-medium">Início</span>
            </Link>
            <Link href="/produtos" className="hover-elevate px-3 py-2 rounded-md">
              <span className="text-sm font-medium">Produtos</span>
            </Link>
            <Link href="/sobre" className="hover-elevate px-3 py-2 rounded-md">
              <span className="text-sm font-medium">Sobre</span>
            </Link>
            <Link href="/contato" className="hover-elevate px-3 py-2 rounded-md">
              <span className="text-sm font-medium">Contato</span>
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
