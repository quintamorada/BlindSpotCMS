import { useQuery } from "@tanstack/react-query";
import type { Settings } from "@shared/schema";
import {
  Shield,
  Lock,
  Database,
  Eye,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PolicyPrivacy() {
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const siteTitle = settings?.siteTitle || "Persiana Prática";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1
            className="text-3xl md:text-4xl font-serif font-bold mb-6"
            data-testid="text-page-title"
          >
            Política de Privacidade
          </h1>

          <p className="text-muted-foreground mb-8">
            Na {siteTitle}, a proteção dos dados pessoais de nossos clientes,
            visitantes e parceiros é uma prioridade. Esta política descreve como
            tratamos suas informações, por que fazemos isso e de que forma elas
            são utilizadas.
          </p>

          <p className="text-muted-foreground mb-8">
            Ao navegar em nosso site ou fornecer seus dados por meio de qualquer
            canal de contato, você declara estar ciente e de acordo com os
            termos aqui descritos. Caso não concorde, recomendamos que não
            utilize nossa plataforma.
          </p>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Aplicabilidade</h2>
              <p className="text-muted-foreground mb-3">
                Esta Política de Privacidade abrange todas as atividades de
                tratamento de dados pessoais realizadas pela {siteTitle},
                incluindo:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Coleta de dados em território nacional</li>
                <li>
                  Processamento de informações para oferta de produtos e
                  serviços a pessoas localizadas no Brasil
                </li>
                <li>Operações de tratamento realizadas dentro do país</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                Termos e Definições
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">
                    Leis de Proteção de Dados:
                  </strong>{" "}
                  Incluem a LGPD (Lei nº 13.709/18), o Marco Civil da Internet
                  (Lei nº 12.965/14) e demais normas brasileiras relacionadas à
                  privacidade e segurança de dados.
                </p>
                <p>
                  <strong className="text-foreground">Dados Pessoais:</strong>{" "}
                  Informações que identificam ou podem identificar uma pessoa
                  física, como nome, CPF, e-mail, IP, entre outros.
                </p>
                <p>
                  <strong className="text-foreground">Dados Sensíveis:</strong>{" "}
                  Informações sobre origem racial, convicções religiosas, saúde,
                  vida sexual, dados biométricos ou genéticos.
                </p>
                <p>
                  <strong className="text-foreground">
                    Parceiros Comerciais:
                  </strong>{" "}
                  Empresas com as quais a {siteTitle} mantém vínculos para
                  promover seus produtos ou serviços.
                </p>
                <p>
                  <strong className="text-foreground">
                    Prestadores de Serviços:
                  </strong>{" "}
                  Terceiros contratados para executar atividades específicas que
                  envolvem o tratamento de dados em nosso nome.
                </p>
                <p>
                  <strong className="text-foreground">
                    Tratamento de Dados:
                  </strong>{" "}
                  Qualquer ação realizada com dados pessoais, como coleta,
                  armazenamento, uso, compartilhamento ou exclusão.
                </p>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  Quais Dados Coletamos
                </h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Coletamos diferentes tipos de dados, conforme sua interação com
                nossa plataforma:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Tipo de Dados
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        Descrição
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Dados de Navegação
                      </td>
                      <td className="border border-border p-3">
                        IP, páginas acessadas, horários, sistema operacional,
                        navegador e localização.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Cookies
                      </td>
                      <td className="border border-border p-3">
                        Utilizados para entender seu comportamento no site e
                        melhorar sua experiência.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Dados de Cadastro
                      </td>
                      <td className="border border-border p-3">
                        Nome completo, CPF e data de nascimento.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Dados de Contato
                      </td>
                      <td className="border border-border p-3">
                        Endereço, e-mail e telefone.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Dados de Candidatos
                      </td>
                      <td className="border border-border p-3">
                        Informações profissionais e acadêmicas enviadas em
                        currículos.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  Finalidade do Uso dos Dados
                </h2>
              </div>
              <p className="mb-3">Utilizamos seus dados para:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  Responder dúvidas, enviar notificações e acompanhar pedidos
                </li>
                <li>
                  Informar sobre atualizações em nossos serviços ou políticas
                </li>
                <li>Realizar pesquisas de satisfação e análise de campanhas</li>
                <li>
                  Cumprir obrigações legais, como registro de logs conforme o
                  Marco Civil da Internet
                </li>
                <li>Proteger nossos direitos em processos judiciais</li>
                <li>
                  Personalizar sua navegação e enviar comunicações promocionais
                  (quando autorizado)
                </li>
              </ul>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  Compartilhamento de Informações
                </h2>
              </div>
              <p className="text-muted-foreground mb-3">
                Seus dados podem ser compartilhados com:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>
                  <strong className="text-foreground">
                    Parceiros de Marketing e Negócios:
                  </strong>{" "}
                  Para oferecer produtos e serviços personalizados
                </li>
                <li>
                  <strong className="text-foreground">
                    Prestadores de Serviços:
                  </strong>{" "}
                  Que atuam em nome da {siteTitle}
                </li>
                <li>
                  <strong className="text-foreground">Órgãos Públicos:</strong>{" "}
                  Quando exigido por lei ou por ordem judicial
                </li>
              </ul>
              <p className="text-muted-foreground mt-3">
                Não compartilhamos seus dados com terceiros sem necessidade
                legal ou consentimento explícito.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">Seus Direitos</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Você tem o direito de:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-border">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left font-semibold">
                        Direito
                      </th>
                      <th className="border border-border p-3 text-left font-semibold">
                        O que significa
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Acesso
                      </td>
                      <td className="border border-border p-3">
                        Solicitar uma cópia dos seus dados pessoais.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Correção
                      </td>
                      <td className="border border-border p-3">
                        Atualizar ou corrigir informações incorretas.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Portabilidade
                      </td>
                      <td className="border border-border p-3">
                        Transferir seus dados para outro fornecedor.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Revogação de Consentimento
                      </td>
                      <td className="border border-border p-3">
                        Cancelar o uso dos seus dados a qualquer momento.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Oposição ao Tratamento
                      </td>
                      <td className="border border-border p-3">
                        Contestar o uso dos seus dados em determinadas
                        situações.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Exclusão
                      </td>
                      <td className="border border-border p-3">
                        Solicitar a remoção dos seus dados da nossa base.
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-border p-3 font-medium text-foreground">
                        Revisão de Decisões
                      </td>
                      <td className="border border-border p-3">
                        Pedir análise de decisões automatizadas baseadas em seus
                        dados.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground mt-4">
                Para exercer qualquer um desses direitos, entre em contato com
                nosso canal de atendimento.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  Segurança das Informações
                </h2>
              </div>
              <p className="text-muted-foreground">
                A {siteTitle} adota medidas técnicas, administrativas e físicas
                para proteger seus dados contra acessos indevidos, perdas ou
                vazamentos. Embora nos esforcemos para garantir a segurança,
                nenhum sistema é infalível. Caso identifique qualquer risco,
                entre em contato conosco imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                📄 Disposições Finais
              </h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Atualizações:</strong>{" "}
                  Esta política pode ser modificada periodicamente. Alterações
                  relevantes serão comunicadas por e-mail ou diretamente na
                  plataforma.
                </p>
                <p>
                  <strong className="text-foreground">Conflitos:</strong> Em
                  caso de disputas, esta política será regida pela legislação
                  brasileira, com foro na cidade de Campinas/SP, salvo para
                  consumidores, que podem optar pelo foro de seu domicílio.
                </p>
              </div>
            </section>

            <section className="mt-8 p-4 bg-muted/50 rounded-md border">
              <div className="flex gap-2">
                <AlertCircle className="h-5 w-5 text-[hsl(35,65%,55%)] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  Para exercer qualquer um dos seus direitos ou esclarecer
                  dúvidas sobre nossa política de privacidade, entre em contato
                  através dos nossos canais de atendimento.
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
