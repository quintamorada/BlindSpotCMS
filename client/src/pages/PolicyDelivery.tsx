import { Truck, Clock, DollarSign, MapPin, RefreshCw } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PolicyDelivery() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h1
            className="text-3xl md:text-4xl font-serif font-bold mb-6"
            data-testid="text-page-title"
          >
            🚚 Política de Entrega
          </h1>

          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">Modalidades de Envio</h2>
              </div>
              <p className="text-muted-foreground">
                Trabalhamos com entrega padrão, com prazos que variam conforme a
                região do Brasil. Não realizamos entregas expressas nem
                oferecemos agendamento de data ou horário.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">Prazo Estimado</h2>
              </div>
              <p className="text-muted-foreground">
                O tempo de entrega é exibido no momento da finalização da
                compra. Esse prazo pode sofrer alterações de acordo com a
                localização do cliente e a disponibilidade dos nossos parceiros
                logísticos.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">Cálculo de Frete</h2>
              </div>
              <p className="text-muted-foreground">
                O valor do frete é calculado automaticamente com base no CEP
                informado, considerando o peso e as dimensões dos produtos
                adquiridos.
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  Rastreamento do Pedido
                </h2>
              </div>
              <p className="text-muted-foreground">
                Assim que o pedido for enviado, você receberá um link de
                rastreamento por e-mail para acompanhar o status da entrega. Em
                caso de atrasos ou imprevistos, nossa equipe está pronta para
                ajudar!
              </p>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-4">
                <RefreshCw className="h-6 w-6 text-[hsl(35,65%,55%)]" />
                <h2 className="text-2xl font-semibold">
                  Tentativas de Entrega
                </h2>
              </div>
              <p className="text-muted-foreground">
                Se a entrega não for concluída por ausência do destinatário ou
                informações incorretas, uma nova tentativa será realizada. Caso
                ocorra nova falha, o pedido será devolvido à fábrica e o cliente
                será contatado para reagendar o envio, com cobrança adicional de
                frete.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
