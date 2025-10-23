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
import { DollarSign, Save, Mail, Phone, Type, Clock, Image as ImageIcon, Upload } from "lucide-react";
import type { Settings } from "@shared/schema";

function AdminSettingsContent() {
  const { toast } = useToast();
  const [siteTitle, setSiteTitle] = useState("");
  const [aluminumBandoPrice, setAluminumBandoPrice] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [businessHoursWeekdays, setBusinessHoursWeekdays] = useState("");
  const [businessHoursSaturday, setBusinessHoursSaturday] = useState("");
  const [businessHoursSunday, setBusinessHoursSunday] = useState("");
  const [watermarkImage, setWatermarkImage] = useState("");
  const [isUploadingWatermark, setIsUploadingWatermark] = useState(false);
  
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  useEffect(() => {
    if (settings) {
      if (settings.siteTitle) {
        setSiteTitle(settings.siteTitle);
      }
      if (settings.aluminumBandoPrice) {
        setAluminumBandoPrice(settings.aluminumBandoPrice);
      }
      if (settings.contactEmail) {
        setContactEmail(settings.contactEmail);
      }
      if (settings.contactPhone) {
        setContactPhone(settings.contactPhone);
      }
      if (settings.businessHoursWeekdays) {
        setBusinessHoursWeekdays(settings.businessHoursWeekdays);
      }
      if (settings.businessHoursSaturday) {
        setBusinessHoursSaturday(settings.businessHoursSaturday);
      }
      if (settings.businessHoursSunday) {
        setBusinessHoursSunday(settings.businessHoursSunday);
      }
      if (settings.watermarkImage) {
        setWatermarkImage(settings.watermarkImage);
      }
    }
  }, [settings]);

  const handleWatermarkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingWatermark(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/watermark-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setWatermarkImage(data.image);
      
      toast({
        title: "Marca d'água enviada com sucesso!",
        description: "A marca d'água foi atualizada. Clique em 'Salvar Configurações' para aplicar.",
      });
    } catch (error) {
      toast({
        title: "Erro ao fazer upload",
        description: "Não foi possível fazer o upload da marca d'água.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingWatermark(false);
    }
  };

  const updateMutation = useMutation({
    mutationFn: async (data: { 
      siteTitle: string;
      aluminumBandoPrice: string; 
      contactEmail: string; 
      contactPhone: string;
      businessHoursWeekdays: string;
      businessHoursSaturday: string;
      businessHoursSunday: string;
      watermarkImage: string;
    }) => {
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

    if (!siteTitle || !contactEmail || !contactPhone) {
      toast({
        title: "Campos obrigatórios",
        description: "Título do site, email e telefone de contato são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    updateMutation.mutate({ 
      siteTitle,
      aluminumBandoPrice: price.toFixed(2),
      contactEmail,
      contactPhone,
      businessHoursWeekdays,
      businessHoursSaturday,
      businessHoursSunday,
      watermarkImage
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
                        <Type className="h-5 w-5" />
                        Identidade Visual
                      </CardTitle>
                      <CardDescription>
                        Configure o título e informações visuais do site
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="siteTitle">
                          Título do Site
                        </Label>
                        <Input
                          id="siteTitle"
                          type="text"
                          placeholder="Persianas Premium"
                          value={siteTitle}
                          onChange={(e) => setSiteTitle(e.target.value)}
                          data-testid="input-site-title"
                          required
                        />
                        <p className="text-sm text-muted-foreground">
                          Este título aparecerá no cabeçalho e rodapé do site
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Marca d'Água
                      </CardTitle>
                      <CardDescription>
                        Configure a marca d'água que será aplicada nas imagens dos produtos
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        {watermarkImage && (
                          <div className="border rounded-lg p-4 bg-muted/30">
                            <p className="text-sm font-medium mb-2">Marca d'água atual:</p>
                            <div className="flex items-center justify-center bg-card p-6 rounded-md border">
                              <img 
                                src={watermarkImage} 
                                alt="Marca d'água" 
                                className="max-w-xs max-h-32 object-contain"
                                data-testid="img-current-watermark"
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <Label htmlFor="watermarkUpload">
                            Enviar Nova Marca d'Água
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="watermarkUpload"
                              type="file"
                              accept="image/png,image/jpeg,image/webp"
                              onChange={handleWatermarkUpload}
                              disabled={isUploadingWatermark}
                              data-testid="input-watermark-upload"
                              className="cursor-pointer"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              disabled={isUploadingWatermark}
                              onClick={() => document.getElementById('watermarkUpload')?.click()}
                              data-testid="button-upload-watermark"
                            >
                              <Upload className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {isUploadingWatermark 
                              ? 'Enviando marca d\'água...' 
                              : 'Envie uma imagem PNG ou JPG. A marca d\'água será aplicada automaticamente em todas as imagens de produtos.'
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

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

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Horários de Atendimento
                      </CardTitle>
                      <CardDescription>
                        Configure os horários que aparecerão na página de contato
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="businessHoursWeekdays">
                          Segunda a Sexta
                        </Label>
                        <Input
                          id="businessHoursWeekdays"
                          type="text"
                          placeholder="9h às 18h"
                          value={businessHoursWeekdays}
                          onChange={(e) => setBusinessHoursWeekdays(e.target.value)}
                          data-testid="input-hours-weekdays"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessHoursSaturday">
                          Sábado
                        </Label>
                        <Input
                          id="businessHoursSaturday"
                          type="text"
                          placeholder="9h às 13h"
                          value={businessHoursSaturday}
                          onChange={(e) => setBusinessHoursSaturday(e.target.value)}
                          data-testid="input-hours-saturday"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="businessHoursSunday">
                          Domingo
                        </Label>
                        <Input
                          id="businessHoursSunday"
                          type="text"
                          placeholder="Fechado"
                          value={businessHoursSunday}
                          onChange={(e) => setBusinessHoursSunday(e.target.value)}
                          data-testid="input-hours-sunday"
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
