import { storage } from "./storage";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  try {
    const existingCategories = await storage.getCategories();
    if (existingCategories.length > 0) {
      console.log("Database already seeded, skipping...");
      return;
    }

    console.log("Seeding database...");

    // Create admin user
    const hashedPassword = await hashPassword("admin123");
    await storage.createUser({
      username: "superadmin",
      email: "admin@persianas.com",
      password: hashedPassword,
      role: "admin",
      active: true
    });

    console.log("Admin user created: superadmin / admin123");

    // Create categories
    const blackout = await storage.createCategory({
      name: "Blackout",
      slug: "blackout",
      description: "Persianas com bloqueio total de luz para ambientes que necessitam escurecimento completo",
      image: "/images/categories/blackout.png"
    });

    const rolo = await storage.createCategory({
      name: "Rolô",
      slug: "rolo",
      description: "Persianas práticas e elegantes com sistema de rolagem",
      image: "/images/categories/rolo.png"
    });

    const vertical = await storage.createCategory({
      name: "Vertical",
      slug: "vertical",
      description: "Ideais para janelas grandes e portas de vidro",
      image: "/images/categories/vertical.png"
    });

    const horizontal = await storage.createCategory({
      name: "Horizontal",
      slug: "horizontal",
      description: "Clássicas e versáteis para qualquer ambiente",
      image: "/images/categories/horizontal.png"
    });

    // Create products
    await storage.createProduct({
      name: "Persiana Blackout Premium",
      slug: "persiana-blackout-premium",
      description: "Persiana blackout de alta qualidade com tecido importado. Bloqueio total de luz, ideal para quartos e home theater.",
      price: "299.90",
      categoryId: blackout.id,
      images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop"],
      specifications: {
        material: "Tecido blackout importado",
        cores: ["Branco", "Bege", "Cinza", "Preto"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: true,
      active: true
    });

    await storage.createProduct({
      name: "Persiana Rolô Linho",
      slug: "persiana-rolo-linho",
      description: "Persiana rolô em tecido linho premium. Design clean e moderno para qualquer ambiente.",
      price: "249.90",
      categoryId: rolo.id,
      images: ["https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&h=600&fit=crop"],
      specifications: {
        material: "Tecido linho",
        cores: ["Natural", "Branco", "Bege"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: false,
      active: true
    });

    await storage.createProduct({
      name: "Persiana Vertical PVC",
      slug: "persiana-vertical-pvc",
      description: "Persiana vertical em PVC de alta resistência. Perfeita para janelas grandes e ambientes comerciais.",
      price: "349.90",
      categoryId: vertical.id,
      images: ["https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=800&h=600&fit=crop"],
      specifications: {
        material: "PVC resistente",
        cores: ["Branco", "Bege", "Cinza"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: false,
      active: true
    });

    await storage.createProduct({
      name: "Persiana Horizontal Alumínio",
      slug: "persiana-horizontal-aluminio",
      description: "Persiana horizontal em alumínio de alta qualidade. Clássica e durável.",
      price: "199.90",
      categoryId: horizontal.id,
      images: ["https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&h=800&fit=crop&q=80"],
      specifications: {
        material: "Alumínio",
        cores: ["Branco", "Prata", "Dourado"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: true,
      active: true
    });

    await storage.createProduct({
      name: "Persiana Blackout Total",
      slug: "persiana-blackout-total",
      description: "Persiana blackout com vedação lateral completa. Bloqueio 100% de luz externa.",
      price: "399.90",
      categoryId: blackout.id,
      images: ["https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop"],
      specifications: {
        material: "Tecido blackout + vedação",
        cores: ["Branco", "Cinza", "Preto"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: true,
      active: true
    });

    await storage.createProduct({
      name: "Persiana Rolô Screen",
      slug: "persiana-rolo-screen",
      description: "Persiana rolô em tecido screen. Filtra luz solar e mantém a visibilidade externa.",
      price: "279.90",
      categoryId: rolo.id,
      images: ["https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&h=600&fit=crop"],
      specifications: {
        material: "Tecido screen",
        cores: ["Branco", "Cinza", "Bronze"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: false,
      active: true
    });

    await storage.createProduct({
      name: "Persiana Vertical Tecido",
      slug: "persiana-vertical-tecido",
      description: "Persiana vertical em tecido premium. Elegância e sofisticação para ambientes requintados.",
      price: "429.90",
      categoryId: vertical.id,
      images: ["https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=800&h=600&fit=crop"],
      specifications: {
        material: "Tecido premium",
        cores: ["Bege", "Cinza", "Terracota"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: false,
      active: true
    });

    await storage.createProduct({
      name: "Persiana Horizontal Madeira",
      slug: "persiana-horizontal-madeira",
      description: "Persiana horizontal em madeira nobre. Charme e elegância atemporal.",
      price: "499.90",
      categoryId: horizontal.id,
      images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop&q=80"],
      specifications: {
        material: "Madeira nobre",
        cores: ["Mogno", "Cerejeira", "Nogueira"],
        instalacao: "Inclusa",
        garantia: "5 anos"
      },
      featured: true,
      active: true
    });

    // Create pages
    await storage.createPage({
      title: "Sobre Nós",
      slug: "sobre",
      content: "<h1>Sobre a Persianas Premium</h1><p>Há mais de 10 anos transformando ambientes com qualidade e sofisticação.</p>",
      metaDescription: "Conheça a história da Persianas Premium, líder em soluções de persianas sob medida",
      published: true
    });

    await storage.createPage({
      title: "Contato",
      slug: "contato",
      content: "<h1>Entre em Contato</h1><p>Estamos prontos para atendê-lo. Solicite seu orçamento sem compromisso.</p>",
      metaDescription: "Entre em contato com a Persianas Premium para orçamentos e informações",
      published: true
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
