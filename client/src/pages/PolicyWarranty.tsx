import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import {
  Shield,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PolicyWarranty() {
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const siteTitle = settings?.siteTitle || "Persiana Prática";
  const contactEmail =
    settings?.contactEmail || "contato@persianapratica.com.br";
  const contactPhone = settings?.contactPhone || "(11) 9999-9999";
  const siteDomain = settings?.siteDomain || "www.persianapratica.com.br";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1
            className="text-3xl md:text-4xl font-serif font-bold mb-6"
            data-testid="text-page-title"
          >
            🛡️ Termo de Garantia
          </h1>

          <p className="text-muted-foreground mb-8">
            Na {siteTitle}, prezamos pela qualidade dos nossos produtos e pela
            satisfação dos nossos clientes. Por isso, oferecemos garantia contra
            defeitos de fabricação, conforme os termos abaixo:
          </p>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">Prazo de Garantia</h2>
              </div>
              <p className="text-muted-foreground">
                Todos os produtos possuem garantia de{" "}
                <strong className="text-foreground">12 meses</strong> a partir
                da data de emissão da nota fiscal. Esse prazo cobre
                exclusivamente falhas de fabricação e não inclui danos causados
                por uso indevido ou desgaste natural.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">O Que Está Coberto</h2>
              </div>
              <p className="text-muted-foreground mb-3">
                A garantia contempla:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Defeitos de fabricação em componentes, tecidos ou mecanismos
                </li>
                <li>
                  Problemas estruturais que comprometam o funcionamento da
                  persiana
                </li>
                <li>Falhas no sistema de acionamento (manual ou motorizado)</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  O Que Não Está Incluso
                </h2>
              </div>
              <p className="text-muted-foreground mb-3">
                A garantia não cobre:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Danos causados por instalação incorreta ou realizada por
                  terceiros
                </li>
                <li>Mau uso, acidentes ou impactos</li>
                <li>
                  Exposição excessiva ao sol, umidade ou produtos químicos
                </li>
                <li>Desgaste natural por tempo de uso</li>
                <li>Alterações feitas no produto sem autorização técnica</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  Como Solicitar Atendimento
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Caso identifique algum problema coberto pela garantia, entre em
                contato com nosso atendimento:
              </p>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li>
                  📞 WhatsApp:{" "}
                  <a
                    href={`https://wa.me/${contactPhone.replace(/\D/g, "")}`}
                    className="text-[hsl(35,65%,55%)] hover:underline"
                    data-testid="link-contact-whatsapp"
                  >
                    {contactPhone}
                  </a>
                </li>
                <li>
                  🌐 Site:{" "}
                  <a
                    href={`https://${siteDomain}`}
                    className="text-[hsl(35,65%,55%)] hover:underline"
                    data-testid="link-website"
                  >
                    {siteDomain}
                  </a>
                </li>
                <li>
                  📧 E-mail:{" "}
                  <a
                    href={`mailto:${contactEmail}`}
                    className="text-[hsl(35,65%,55%)] hover:underline"
                    data-testid="link-contact-email"
                  >
                    {contactEmail}
                  </a>
                </li>
              </ul>
              <p className="text-muted-foreground mt-4">
                Nossa equipe irá orientar sobre o envio do produto para análise
                técnica. O prazo para avaliação é de até{" "}
                <strong className="text-foreground">5 dias úteis</strong> após o
                recebimento.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">Trocas ou Reembolsos</h2>
              </div>
              <p className="text-muted-foreground mb-3">
                Se for constatado defeito de fabricação, o cliente poderá optar
                por:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Reparo gratuito</li>
                <li>Substituição do produto</li>
                <li>Reembolso, conforme o método de pagamento utilizado</li>
              </ul>
              <div className="mt-4 p-4 bg-muted/50 rounded-md border">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-[hsl(35,65%,55%)] flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Importante:</strong> O
                    simples envio do produto ou entrega à transportadora não
                    garante a troca ou devolução antes da conclusão da análise
                    técnica.
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                📄 Disposições Finais
              </h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  A garantia é válida apenas mediante apresentação da nota
                  fiscal
                </li>
                <li>
                  Produtos personalizados seguem as mesmas condições, desde que
                  o defeito não esteja relacionado à customização solicitada
                </li>
                <li>
                  Em caso de dúvidas, nossa equipe está à disposição para
                  esclarecer qualquer ponto
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
