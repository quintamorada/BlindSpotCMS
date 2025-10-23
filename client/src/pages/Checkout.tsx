import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { useCustomerAuth } from "@/contexts/CustomerAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, MapPin } from "lucide-react";

interface Address {
  id: string;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

const guestCheckoutSchema = z.object({
  customerName: z.string().min(3, "Nome completo é obrigatório"),
  customerEmail: z.string().email("Email inválido"),
  customerPhone: z.string().min(10, "Telefone é obrigatório"),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(3, "Bairro é obrigatório"),
  city: z.string().min(3, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  zipCode: z.string().min(8, "CEP é obrigatório"),
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

const registerSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  phone: z.string().optional(),
});

type GuestCheckoutData = z.infer<typeof guestCheckoutSchema>;
type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const { customer, isAuthenticated, login, register } = useCustomerAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [checkoutType, setCheckoutType] = useState<"guest" | "auth">("guest");
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");

  const { data: addresses } = useQuery<Address[]>({
    queryKey: ['/api/customer/addresses'],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isAuthenticated) {
      setCheckoutType("auth");
      const defaultAddress = addresses?.find(addr => addr.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      }
    }
  }, [isAuthenticated, addresses]);

  const guestForm = useForm<GuestCheckoutData>({
    resolver: zodResolver(guestCheckoutSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderDetails: any) => {
      const response = await apiRequest('POST', '/api/orders', orderDetails);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Pedido criado com sucesso!",
        description: "Entraremos em contato em breve para confirmar sua compra.",
      });
      clearCart();
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar pedido",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  });

  const handleLoginSubmit = async (data: LoginData) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Login realizado",
        description: "Agora você pode finalizar seu pedido",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: error.message || "Email ou senha inválidos",
      });
    }
  };

  const handleRegisterSubmit = async (data: RegisterData) => {
    try {
      await register(data);
      toast({
        title: "Cadastro realizado",
        description: "Bem-vindo! Agora você pode finalizar seu pedido",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error.message || "Não foi possível completar o cadastro",
      });
    }
  };

  const handleGuestCheckout = (data: GuestCheckoutData) => {
    const shippingAddress = {
      street: data.street,
      number: data.number,
      complement: data.complement,
      neighborhood: data.neighborhood,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    };

    const orderDetails = {
      order: {
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        shippingAddress,
        totalAmount: getTotalPrice().toString(),
        status: "pending"
      },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        width: item.width.toString(),
        height: item.height.toString(),
        commandHeight: item.commandHeight.toString(),
        bandoSide: item.bandoSide,
        colorId: item.colorId,
        colorName: item.colorName,
        colorCode: item.colorCode,
        aluminumBando: item.aluminumBando,
        aluminumBandoPrice: item.aluminumBandoPrice.toString(),
        verticalControl: item.verticalControl,
        verticalBando: item.verticalBando,
        controlTypeId: item.controlTypeId,
        controlTypeName: item.controlTypeName,
        pricePerSqm: item.pricePerSqm.toString(),
        totalPrice: item.totalPrice.toString()
      }))
    };

    createOrderMutation.mutate(orderDetails);
  };

  const handleAuthCheckout = () => {
    if (!customer || !selectedAddressId) return;

    const selectedAddress = addresses?.find(addr => addr.id === selectedAddressId);
    if (!selectedAddress) return;

    const orderDetails = {
      order: {
        customerId: customer.id,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone || "",
        shippingAddressId: selectedAddressId,
        shippingAddress: {
          street: selectedAddress.street,
          number: selectedAddress.number,
          complement: selectedAddress.complement,
          neighborhood: selectedAddress.neighborhood,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
        },
        totalAmount: getTotalPrice().toString(),
        status: "pending"
      },
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        width: item.width.toString(),
        height: item.height.toString(),
        commandHeight: item.commandHeight.toString(),
        bandoSide: item.bandoSide,
        colorId: item.colorId,
        colorName: item.colorName,
        colorCode: item.colorCode,
        aluminumBando: item.aluminumBando,
        aluminumBandoPrice: item.aluminumBandoPrice.toString(),
        verticalControl: item.verticalControl,
        verticalBando: item.verticalBando,
        controlTypeId: item.controlTypeId,
        controlTypeName: item.controlTypeName,
        pricePerSqm: item.pricePerSqm.toString(),
        totalPrice: item.totalPrice.toString()
      }))
    };

    createOrderMutation.mutate(orderDetails);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-12 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="py-16">
              <ShoppingCart className="h-20 w-20 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-2xl font-bold mb-2">Carrinho vazio</h2>
              <p className="text-muted-foreground mb-6">
                Adicione produtos ao carrinho antes de finalizar o pedido
              </p>
              <Link href="/produtos">
                <Button data-testid="button-go-shopping">
                  Ver Produtos
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8" data-testid="text-page-title">Finalizar Pedido</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {!isAuthenticated && (
                <Tabs value={checkoutType} onValueChange={(v) => setCheckoutType(v as "guest" | "auth")} className="mb-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="guest" data-testid="tab-guest">
                      Continuar sem cadastro
                    </TabsTrigger>
                    <TabsTrigger value="auth" data-testid="tab-login">
                      Entrar / Cadastrar
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="guest">
                    <Card>
                      <CardHeader>
                        <CardTitle>Seus Dados e Endereço de Entrega</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Form {...guestForm}>
                          <form onSubmit={guestForm.handleSubmit(handleGuestCheckout)} className="space-y-4">
                            <FormField
                              control={guestForm.control}
                              name="customerName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nome completo</FormLabel>
                                  <FormControl>
                                    <Input data-testid="input-name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={guestForm.control}
                                name="customerEmail"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input type="email" data-testid="input-email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={guestForm.control}
                                name="customerPhone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                      <Input data-testid="input-phone" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <div className="pt-4 border-t">
                              <h3 className="font-semibold mb-4">Endereço de Entrega</h3>
                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                  <FormField
                                    control={guestForm.control}
                                    name="zipCode"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                          <Input data-testid="input-zip" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={guestForm.control}
                                  name="state"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Estado</FormLabel>
                                      <FormControl>
                                        <Input maxLength={2} data-testid="input-state" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={guestForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Cidade</FormLabel>
                                    <FormControl>
                                      <Input data-testid="input-city" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={guestForm.control}
                                name="neighborhood"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Bairro</FormLabel>
                                    <FormControl>
                                      <Input data-testid="input-neighborhood" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                  <FormField
                                    control={guestForm.control}
                                    name="street"
                                    render={({ field }) => (
                                      <FormItem>
                                        <FormLabel>Rua</FormLabel>
                                        <FormControl>
                                          <Input data-testid="input-street" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                      </FormItem>
                                    )}
                                  />
                                </div>
                                <FormField
                                  control={guestForm.control}
                                  name="number"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Número</FormLabel>
                                      <FormControl>
                                        <Input data-testid="input-number" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={guestForm.control}
                                name="complement"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Complemento (opcional)</FormLabel>
                                    <FormControl>
                                      <Input data-testid="input-complement" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            <Button
                              type="submit"
                              className="w-full"
                              disabled={createOrderMutation.isPending}
                              data-testid="button-finish-order"
                            >
                              {createOrderMutation.isPending ? "Finalizando..." : "Finalizar Pedido"}
                            </Button>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="auth">
                    <Card>
                      <CardContent className="pt-6">
                        <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as "login" | "register")}>
                          <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="login" data-testid="tab-login-form">Entrar</TabsTrigger>
                            <TabsTrigger value="register" data-testid="tab-register-form">Cadastrar</TabsTrigger>
                          </TabsList>

                          <TabsContent value="login">
                            <Form {...loginForm}>
                              <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                                <FormField
                                  control={loginForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" data-testid="input-login-email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={loginForm.control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Senha</FormLabel>
                                      <FormControl>
                                        <Input type="password" data-testid="input-login-password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full" data-testid="button-login-submit">
                                  Entrar
                                </Button>
                              </form>
                            </Form>
                          </TabsContent>

                          <TabsContent value="register">
                            <Form {...registerForm}>
                              <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                                <FormField
                                  control={registerForm.control}
                                  name="name"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Nome completo</FormLabel>
                                      <FormControl>
                                        <Input data-testid="input-register-name" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={registerForm.control}
                                  name="email"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Email</FormLabel>
                                      <FormControl>
                                        <Input type="email" data-testid="input-register-email" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={registerForm.control}
                                  name="phone"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Telefone (opcional)</FormLabel>
                                      <FormControl>
                                        <Input data-testid="input-register-phone" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={registerForm.control}
                                  name="password"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel>Senha</FormLabel>
                                      <FormControl>
                                        <Input type="password" data-testid="input-register-password" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                                <Button type="submit" className="w-full" data-testid="button-register-submit">
                                  Cadastrar
                                </Button>
                              </form>
                            </Form>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}

              {isAuthenticated && (
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço de Entrega</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {!addresses || addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Você ainda não tem endereços cadastrados</p>
                        <Link href="/minha-conta/enderecos">
                          <Button data-testid="button-add-address">Adicionar Endereço</Button>
                        </Link>
                      </div>
                    ) : (
                      <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
                        {addresses.map((address) => (
                          <div
                            key={address.id}
                            className="flex items-start space-x-3 p-4 rounded-md border hover-elevate"
                            data-testid={`address-${address.id}`}
                          >
                            <RadioGroupItem value={address.id} id={address.id} />
                            <Label htmlFor={address.id} className="flex-1 cursor-pointer">
                              <div className="font-semibold">{address.name}</div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {address.street}, {address.number}
                                {address.complement && ` - ${address.complement}`}
                                <br />
                                {address.neighborhood}, {address.city} - {address.state}
                                <br />
                                CEP: {address.zipCode}
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    {addresses && addresses.length > 0 && (
                      <Button
                        onClick={handleAuthCheckout}
                        className="w-full mt-6"
                        disabled={!selectedAddressId || createOrderMutation.isPending}
                        data-testid="button-finish-order-auth"
                      >
                        {createOrderMutation.isPending ? "Finalizando..." : "Finalizar Pedido"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {items.map((item, index) => (
                      <div key={index} className="pb-3 border-b last:border-0" data-testid={`item-${index}`}>
                        <div className="font-medium text-sm">{item.productName}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.width}m × {item.height}m ({item.area.toFixed(2)}m²)
                        </div>
                        <div className="text-sm font-medium mt-2">
                          R$ {item.totalPrice.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg" data-testid="text-total">
                      R$ {getTotalPrice().toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
