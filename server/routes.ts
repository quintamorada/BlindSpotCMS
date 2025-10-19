import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertProductSchema, insertPageSchema, insertUserSchema, insertOrderSchema, insertOrderItemSchema, insertOrderItemSchemaForCreate } from "@shared/schema";
import { z } from "zod";
import { authenticateUser, hashPassword } from "./auth";
import { requireAuth, requireAdmin } from "./middleware";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import { promises as fs } from "fs";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens JPEG, PNG e WebP são permitidas'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Image Upload API - Multiple images
  app.post("/api/upload/product-images", requireAuth, upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
      await fs.mkdir(uploadsDir, { recursive: true });

      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const baseFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
          
          // Criar versão grande (para página de detalhes)
          const largeFilename = `${baseFilename}-large.webp`;
          const largeFilepath = path.join(uploadsDir, largeFilename);
          
          await sharp(file.buffer)
            .resize(1200, 1200, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .webp({ quality: 90 })
            .toFile(largeFilepath);

          // Criar versão thumbnail (para home/listagens)
          const thumbFilename = `${baseFilename}-thumb.webp`;
          const thumbFilepath = path.join(uploadsDir, thumbFilename);
          
          await sharp(file.buffer)
            .resize(400, 400, {
              fit: 'cover'
            })
            .webp({ quality: 80 })
            .toFile(thumbFilepath);

          return {
            large: `/uploads/products/${largeFilename}`,
            thumb: `/uploads/products/${thumbFilename}`
          };
        })
      );

      res.json({ images: uploadedImages });
    } catch (error) {
      console.error('Error uploading images:', error);
      res.status(500).json({ error: "Erro ao fazer upload das imagens" });
    }
  });

  // Auth API
  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: "Username e senha são obrigatórios" });
    }

    const user = await authenticateUser(username, password);
    
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    req.session.userId = user.id;
    req.session.userRole = user.role;

    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Erro ao fazer logout" });
      }
      res.json({ message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const user = await storage.getUser(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  });

  // Users API (Admin only)
  app.get("/api/users", requireAdmin, async (req, res) => {
    const users = await storage.getUsers();
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    res.json(usersWithoutPasswords);
  });

  app.post("/api/users", requireAdmin, async (req, res) => {
    try {
      const data = insertUserSchema.parse(req.body);
      const hashedPassword = await hashPassword(data.password);
      const user = await storage.createUser({ ...data, password: hashedPassword });
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/users/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertUserSchema.partial().parse(req.body);
      if (data.password) {
        data.password = await hashPassword(data.password);
      }
      const user = await storage.updateUser(req.params.id, data);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", requireAdmin, async (req, res) => {
    const deleted = await storage.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(204).send();
  });

  // Categories API (Protected)
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategory(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  });

  app.post("/api/categories", requireAuth, async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/categories/:id", requireAuth, async (req, res) => {
    try {
      const data = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, data);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/categories/:id", requireAuth, async (req, res) => {
    const deleted = await storage.deleteCategory(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(204).send();
  });

  // Products API
  app.get("/api/products", async (req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  });

  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const data = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(req.params.id, data);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    const deleted = await storage.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).send();
  });

  // Pages API
  app.get("/api/pages", async (req, res) => {
    const pages = await storage.getPages();
    res.json(pages);
  });

  app.get("/api/pages/:id", async (req, res) => {
    const page = await storage.getPage(req.params.id);
    if (!page) {
      return res.status(404).json({ error: "Page not found" });
    }
    res.json(page);
  });

  app.post("/api/pages", requireAuth, async (req, res) => {
    try {
      const data = insertPageSchema.parse(req.body);
      const page = await storage.createPage(data);
      res.status(201).json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/pages/:id", requireAuth, async (req, res) => {
    try {
      const data = insertPageSchema.partial().parse(req.body);
      const page = await storage.updatePage(req.params.id, data);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/pages/:id", requireAuth, async (req, res) => {
    const deleted = await storage.deletePage(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Page not found" });
    }
    res.status(204).send();
  });

  // Orders API
  app.get("/api/orders", requireAdmin, async (req, res) => {
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.get("/api/orders/:id", requireAdmin, async (req, res) => {
    const order = await storage.getOrder(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body.order);
      const itemsData = z.array(insertOrderItemSchemaForCreate).parse(req.body.items);

      const order = await storage.createOrder(orderData);

      const items = await Promise.all(
        itemsData.map(item => storage.createOrderItem({ ...item, orderId: order.id }))
      );

      res.status(201).json({ order, items });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/orders/:id", requireAdmin, async (req, res) => {
    try {
      const data = insertOrderSchema.partial().parse(req.body);
      const order = await storage.updateOrder(req.params.id, data);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/orders/:id", requireAdmin, async (req, res) => {
    const deleted = await storage.deleteOrder(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.status(204).send();
  });

  // Order Items API
  app.get("/api/orders/:orderId/items", requireAdmin, async (req, res) => {
    const items = await storage.getOrderItems(req.params.orderId);
    res.json(items);
  });

  const httpServer = createServer(app);
  return httpServer;
}
