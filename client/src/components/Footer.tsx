import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiWhatsapp, SiInstagram, SiFacebook } from "react-icons/si";
import { Mail, Phone, MapPin, Shield, Award, Truck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import { Link } from "wouter";

export default function Footer() {
  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const contactEmail = settings?.contactEmail || "contato@persianas.com.br";
  const contactPhone = settings?.contactPhone || "(11) 9999-9999";

  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-4" data-testid="text-footer-brand">Persianas Premium</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Transformando ambientes com qualidade e sofisticação desde 2010.
            </p>
            <div className="flex gap-2">
              <Button size="icon" variant="ghost" data-testid="button-social-whatsapp">
                <SiWhatsapp className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="button-social-instagram">
                <SiInstagram className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" data-testid="button-social-facebook">
                <SiFacebook className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Produtos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categoria/blackout" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-category-blackout">
                  Persianas Blackout
                </Link>
              </li>
              <li>
                <Link href="/categoria/rolo" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-category-rolo">
                  Persianas Rolô
                </Link>
              </li>
              <li>
                <Link href="/categoria/vertical" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-category-vertical">
                  Persianas Vertical
                </Link>
              </li>
              <li>
                <Link href="/categoria/horizontal" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-category-horizontal">
                  Persianas Horizontal
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Atendimento</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span data-testid="text-footer-phone">{contactPhone}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span data-testid="text-footer-email">{contactEmail}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Receba ofertas exclusivas e novidades
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Seu e-mail" data-testid="input-newsletter" />
              <Button data-testid="button-newsletter">Enviar</Button>
            </div>
          </div>
        </div>
        
        <div className="border-t pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-[hsl(35,65%,55%)]" />
              <div>
                <div className="font-semibold text-sm">Compra Segura</div>
                <div className="text-xs text-muted-foreground">Ambiente protegido</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award className="h-8 w-8 text-[hsl(35,65%,55%)]" />
              <div>
                <div className="font-semibold text-sm">Garantia 5 Anos</div>
                <div className="text-xs text-muted-foreground">Em todos os produtos</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-8 w-8 text-[hsl(35,65%,55%)]" />
              <div>
                <div className="font-semibold text-sm">Instalação Grátis</div>
                <div className="text-xs text-muted-foreground">Orçamento sem custo</div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            © 2024 Persianas Premium. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
