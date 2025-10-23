import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <Card className="mx-auto max-w-5xl p-4 md:p-6 shadow-lg">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1" data-testid="text-cookie-title">
                Este site utiliza cookies
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-cookie-description">
                Utilizamos cookies para melhorar sua experiência de navegação, personalizar conteúdo e analisar nosso tráfego. 
                Ao clicar em "Aceitar todos", você concorda com o uso de cookies.
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              data-testid="button-reject-cookies"
            >
              Rejeitar
            </Button>
            <Button
              onClick={handleAcceptAll}
              data-testid="button-accept-cookies"
            >
              Aceitar todos
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
