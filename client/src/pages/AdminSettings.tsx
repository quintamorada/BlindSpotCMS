import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RequireAuth } from "@/lib/auth";
import { useState, useEffect } from "react";
import { DollarSign, Save, Mail, Phone } from "lucide-react";
import type { Settings } from "@shared/schema";

function AdminSettingsContent() {
  const { toast } = useToast();
  const [aluminumBandoPrice, setAluminumBandoPrice] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  useEffect(() => {
    if (settings) {
      if (settings.aluminumBandoPrice) {
        setAluminumBandoPrice(settings.aluminumBandoPrice);
      }
      if (settings.contactEmail) {
        setContactEmail(settings.contactEmail);
      }
      if (settings.contactPhone) {
        setContactPhone(settings.contactPhone);
      }
    }
  }, [settings]);

  const updateMutation = useMutation({
    mutationFn: async (data: { aluminumBandoPrice: string; contactEmail: string; contactPhone: string }) => {
      await apiRequest('PUT', '/api/settings', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({ 
        title: "Configurações salvas com sucesso!",
        description: "As alterações foram aplicadas."
      });
    },
    onError: () => {
      toast({ 
        title: "Erro ao salvar configurações",
        description: "Tente novamente mais tarde.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(aluminumBandoPrice);
    
    if (isNaN(price) || price < 0) {
      toast({
        title: "Valor inválido",
        description: "O preço deve ser um número válido maior ou igual a zero.",
        variant: "destructive"
      });
      return;
    }

    if (!contactEmail || !contactPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Email e telefone de contato são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    updateMutation.mutate({ 
      aluminumBandoPrice: price.toFixed(2),
      contactEmail,
      contactPhone
    });
  };

  const style = {
    "--sidebar-width": "16rem",
  };
  
  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex flex-col flex-1">
          <AdminHeader />
          <main className="flex-1 overflow-auto p-6 bg-muted/30">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-3xl font-bold">Configurações Gerais</h2>
                <p className="text-muted-foreground mt-2">
                  Gerencie os preços e configurações do sistema
                </p>
              </div>

              {isLoading ? (
                <div className="text-center py-12">Carregando...</div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Preços de Adicionais
                      </CardTitle>
                      <CardDescription>
                        Configure os valores que serão adicionados aos produtos quando o cliente escolher opções extras
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="aluminumBandoPrice">
                          Preço do Bandô de Alumínio (R$)
                        </Label>
                        <Input
                          id="aluminumBandoPrice"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={aluminumBandoPrice}
                          onChange={(e) => setAluminumBandoPrice(e.target.value)}
                          data-testid="input-aluminum-bando-price"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Este valor será adicionado ao total quando o cliente optar por incluir bandô de alumínio na persiana
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Informações de Contato
                      </CardTitle>
                      <CardDescription>
                        Configure o email e telefone que aparecerão no rodapé do site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email de Contato
                        </Label>
                        <Input
                          id="contactEmail"
                          type="email"
                          placeholder="contato@exemplo.com.br"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          data-testid="input-contact-email"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactPhone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Telefone de Contato
                        </Label>
                        <Input
                          id="contactPhone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          data-testid="input-contact-phone"
                          required
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-3">
                    <Button 
                      type="submit" 
                      disabled={updateMutation.isPending}
                      data-testid="button-save-settings"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {updateMutation.isPending ? 'Salvando...' : 'Salvar Configurações'}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function AdminSettings() {
  return (
    <RequireAuth>
      <AdminSettingsContent />
    </RequireAuth>
  );
}
