import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Award, Users, Clock } from "lucide-react";
import { Link } from "wouter";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Persianas Premium
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="hover:text-primary">
                Início
              </Link>
              <Link href="/produtos" className="hover:text-primary">
                Produtos
              </Link>
              <Link href="/sobre" className="hover:text-primary text-primary">
                Sobre Nós
              </Link>
              <Link href="/contato" className="hover:text-primary">
                Contato
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Sobre Nós</h1>
          
          <div className="prose max-w-none mb-12">
            <p className="text-lg text-muted-foreground mb-6">
              Com mais de 15 anos de experiência no mercado, somos especialistas em persianas de alta qualidade 
              para ambientes residenciais e comerciais. Nossa missão é proporcionar soluções elegantes e funcionais 
              que transformam espaços, oferecendo controle de luz, privacidade e beleza.
            </p>
            <p className="text-lg text-muted-foreground">
              Trabalhamos com os melhores materiais e as mais modernas tecnologias para garantir produtos duráveis, 
              com design sofisticado e instalação perfeita. Nossa equipe de profissionais está sempre pronta para 
              ajudar você a encontrar a solução ideal para seu projeto.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  Qualidade Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Produtos fabricados com os melhores materiais e acabamento impecável, 
                  garantindo durabilidade e elegância.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-primary" />
                  Atendimento Personalizado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Nossa equipe especializada oferece consultoria completa para ajudar na escolha 
                  perfeita para seu ambiente.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  Instalação Profissional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Instaladores experientes e treinados garantem um serviço rápido, limpo e 
                  de excelência.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-primary" />
                  15 Anos de Experiência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Mais de uma década atendendo clientes satisfeitos e transformando ambientes 
                  em todo o Brasil.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Nossa Visão</h2>
              <p className="text-lg">
                Ser referência nacional em soluções de controle de luz e privacidade, 
                sempre inovando e superando as expectativas de nossos clientes.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
