import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import { PackageOpen, Clock, AlertCircle, CheckCircle, DollarSign } from "lucide-react";

export default function PolicyReturns() {
  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const contactEmail = settings?.contactEmail || "contato@persianapratica.com.br";
  const contactPhone = settings?.contactPhone || "(11) 9999-9999";
  const siteDomain = settings?.siteDomain || "www.persianapratica.com.br";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6" data-testid="text-page-title">
          🔄 Política de Troca e Devolução
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Nosso compromisso é garantir a sua satisfação em cada etapa da compra. Por isso, criamos uma política 
          clara e objetiva para trocas e devoluções, respeitando o Código de Defesa do Consumidor.
        </p>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Prazo para Solicitação</h2>
            </div>
            <p className="text-muted-foreground">
              Você pode solicitar a troca ou devolução do seu pedido em até <strong className="text-foreground">7 dias corridos</strong> após 
              o recebimento do produto. Esse direito é assegurado por lei e se aplica a compras realizadas fora do 
              estabelecimento comercial (como pela internet).
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Situações em que Aceitamos Trocas ou Devoluções</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Produto com defeito de fabricação</li>
              <li>Produto entregue diferente do solicitado</li>
              <li>Exercício do direito de arrependimento dentro do prazo legal de 7 dias</li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <PackageOpen className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Condições Necessárias</h2>
            </div>
            <p className="mb-3">Para que a troca ou devolução seja aceita, o item deve ser enviado:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Na embalagem original</li>
              <li>Sem sinais de uso ou avarias</li>
              <li>Com todos os acessórios, manuais e nota fiscal</li>
            </ul>
            <p className="text-muted-foreground mt-3">
              Produtos que não atenderem a essas condições poderão ser recusados após análise.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">🚚 Logística de Envio</h2>
            <ul className="space-y-3 ml-4">
              <li>
                <strong className="text-foreground">Devoluções por arrependimento (dentro do prazo de 7 dias):</strong>
                <span className="text-muted-foreground"> os custos de envio são de responsabilidade da Persiana Prática.</span>
              </li>
              <li>
                <strong className="text-foreground">Trocas por outros motivos:</strong>
                <span className="text-muted-foreground"> o frete de envio e reenvio será por conta do cliente.</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📝 Como Solicitar</h2>
            <p className="text-muted-foreground mb-4">
              Para iniciar o processo de troca ou devolução, entre em contato com nosso atendimento:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>
                📧 E-mail: <a href={`mailto:${contactEmail}`} className="text-[hsl(35,65%,55%)] hover:underline" data-testid="link-contact-email">{contactEmail}</a>
              </li>
              <li>
                📱 WhatsApp: <a href={`https://wa.me/${contactPhone.replace(/\D/g, '')}`} className="text-[hsl(35,65%,55%)] hover:underline" data-testid="link-contact-whatsapp">{contactPhone}</a>
              </li>
              <li>
                🌐 Site: <a href={`https://${siteDomain}`} className="text-[hsl(35,65%,55%)] hover:underline" data-testid="link-website">{siteDomain}</a>
              </li>
            </ul>
            <p className="text-muted-foreground mt-4">
              Nossa equipe fornecerá todas as instruções para o envio do produto.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Reembolso</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              O valor pago será restituído somente após o recebimento e análise técnica do produto devolvido. 
              Essa avaliação é realizada em até <strong className="text-foreground">5 dias úteis</strong> após a chegada do item à fábrica.
            </p>
            <div className="p-4 bg-muted/50 rounded-md border">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-[hsl(35,65%,55%)] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Atenção:</strong> O simples envio do produto ou entrega à transportadora 
                  não garante o reembolso antes da conclusão da análise.
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
