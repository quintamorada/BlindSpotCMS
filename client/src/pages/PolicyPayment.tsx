import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import { CreditCard, QrCode, FileText, RefreshCw, AlertCircle } from "lucide-react";

export default function PolicyPayment() {
  const { data: settings } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });

  const contactEmail = settings?.contactEmail || "contato@persianapratica.com.br";
  const contactPhone = settings?.contactPhone || "(11) 9999-9999";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-6" data-testid="text-page-title">
          💳 Política de Pagamento
        </h1>
        
        <p className="text-muted-foreground mb-8">
          Na Persiana Prática, buscamos oferecer praticidade e segurança em todas as etapas da sua compra, 
          inclusive no momento do pagamento. Abaixo você encontra as condições e formas disponíveis:
        </p>

        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Métodos de Pagamento</h2>
            </div>
            <p className="mb-3">Você pode realizar suas compras utilizando:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Cartão de Crédito</li>
              <li>PIX</li>
              <li>Boleto Bancário</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">📆 Condições de Parcelamento</h2>
            <p className="text-muted-foreground">
              Compras com cartão de crédito podem ser parceladas em até <strong className="text-foreground">6 vezes sem juros</strong>. 
              Caso opte por dividir em até 12 vezes, serão aplicadas taxas de juros conforme a operadora do cartão.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <QrCode className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Pagamento com PIX</h2>
            </div>
            <p className="text-muted-foreground">
              Ao escolher o PIX como forma de pagamento, o prazo de vencimento é de <strong className="text-foreground">12 horas</strong> após 
              a geração do código. A produção do pedido será iniciada somente após a confirmação do pagamento.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Pagamento com Boleto</h2>
            </div>
            <p className="text-muted-foreground">
              O boleto bancário possui vencimento de <strong className="text-foreground">2 dias</strong> após sua emissão. 
              Assim como no PIX, o pedido só será encaminhado para produção após a confirmação do pagamento.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <RefreshCw className="h-6 w-6 text-[hsl(35,65%,55%)]" />
              <h2 className="text-2xl font-semibold">Reembolsos e Cancelamentos</h2>
            </div>
            <p className="mb-3">
              Em casos de devolução ou cancelamento de pedidos já pagos, o reembolso será realizado conforme o método utilizado:
            </p>
            <ul className="space-y-3 ml-4">
              <li>
                <strong className="text-foreground">Cartão de Crédito:</strong>
                <span className="text-muted-foreground"> O estorno será feito diretamente na fatura, podendo aparecer em até duas faturas subsequentes.</span>
              </li>
              <li>
                <strong className="text-foreground">PIX:</strong>
                <span className="text-muted-foreground"> O valor será devolvido para a mesma conta utilizada no pagamento.</span>
              </li>
              <li>
                <strong className="text-foreground">Boleto Bancário:</strong>
                <span className="text-muted-foreground"> Solicitaremos os dados bancários para realizar a transferência.</span>
              </li>
            </ul>
            
            <div className="mt-4 p-4 bg-muted/50 rounded-md border">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-[hsl(35,65%,55%)] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Importante:</strong> O reembolso só será processado após o recebimento 
                  e análise técnica do produto devolvido. Essa análise é realizada em até <strong className="text-foreground">5 dias úteis</strong> após 
                  a chegada do item à fábrica. O valor será restituído em até <strong className="text-foreground">5 dias úteis</strong> após 
                  a conclusão da avaliação. O simples envio ou entrega à transportadora não garante a devolução antes da análise.
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">🛠️ Dificuldades com o Pagamento</h2>
            <p className="text-muted-foreground">
              Caso enfrente qualquer problema durante o processo de pagamento, nossa equipe está pronta para ajudar. 
              Entre em contato pelo e-mail: <a href={`mailto:${contactEmail}`} className="text-[hsl(35,65%,55%)] hover:underline" data-testid="link-contact-email">{contactEmail}</a> ou 
              via WhatsApp: <a href={`https://wa.me/${contactPhone.replace(/\D/g, '')}`} className="text-[hsl(35,65%,55%)] hover:underline" data-testid="link-contact-whatsapp">{contactPhone}</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
