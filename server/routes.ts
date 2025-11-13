import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertCategoryColorSchema, insertCategoryControlTypeSchema, insertProductSchema, insertPageSchema, insertUserSchema, insertCustomerSchema, insertCustomerAddressSchema, insertOrderSchema, insertOrderItemSchema, insertOrderItemSchemaForCreate, insertSettingsSchema } from "@shared/schema";
import { z } from "zod";
import { authenticateUser, hashPassword, verifyPassword } from "./auth";
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

const manualUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max for PDFs
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos'));
    }
  },
});

async function applyWatermark(imageBuffer: Buffer, watermarkPath: string): Promise<Buffer> {
  try {
    let watermarkFullPath: string;
    const normalizedPath = watermarkPath.startsWith('/') ? watermarkPath.slice(1) : watermarkPath;
    
    if (watermarkPath.startsWith('/uploads/')) {
      watermarkFullPath = path.join(process.cwd(), normalizedPath);
    } else if (watermarkPath.startsWith('/images/')) {
      watermarkFullPath = path.join(process.cwd(), 'public', normalizedPath);
    } else {
      watermarkFullPath = path.join(process.cwd(), 'public', normalizedPath);
    }
    
    const watermarkExists = await fs.access(watermarkFullPath).then(() => true).catch(() => false);
    if (!watermarkExists) {
      console.warn(`Watermark not found at ${watermarkFullPath}, returning original image`);
      return imageBuffer;
    }

    const image = sharp(imageBuffer);
    const metadata = await image.metadata();
    const imageWidth = metadata.width || 1200;
    const imageHeight = metadata.height || 1200;

    const watermarkSize = Math.floor(Math.min(imageWidth, imageHeight) * 0.25);

    const watermarkBuffer = await sharp(watermarkFullPath)
      .resize(watermarkSize, Math.floor(watermarkSize * 0.5), {
        fit: 'inside',
        withoutEnlargement: true
      })
      .png()
      .toBuffer();

    const watermarkedImage = await image
      .composite([{
        input: watermarkBuffer,
        gravity: 'southeast',
        blend: 'over'
      }])
      .toBuffer();

    console.log(`Successfully applied watermark from ${watermarkFullPath}`);
    return watermarkedImage;
  } catch (error) {
    console.error('Error applying watermark:', error);
    return imageBuffer;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Color Image Upload API
  app.post("/api/upload/color-image", requireAuth, upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      const uploadsDir = path.join(process.cwd(), 'uploads', 'colors');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filepath = path.join(uploadsDir, filename);
      
      await sharp(file.buffer)
        .resize(100, 100, {
          fit: 'cover'
        })
        .webp({ quality: 85 })
        .toFile(filepath);

      res.json({ image: `/uploads/colors/${filename}` });
    } catch (error) {
      console.error('Error uploading color image:', error);
      res.status(500).json({ error: "Erro ao fazer upload da imagem" });
    }
  });

  // Control Type Image Upload API
  app.post("/api/upload/control-type-image", requireAuth, upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      const uploadsDir = path.join(process.cwd(), 'uploads', 'control-types');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filepath = path.join(uploadsDir, filename);
      
      await sharp(file.buffer)
        .resize(300, 300, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 90 })
        .toFile(filepath);

      res.json({ image: `/uploads/control-types/${filename}` });
    } catch (error) {
      console.error('Error uploading control type image:', error);
      res.status(500).json({ error: "Erro ao fazer upload da imagem" });
    }
  });

  // Category Image Upload API
  app.post("/api/upload/category-image", requireAuth, upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      const uploadsDir = path.join(process.cwd(), 'uploads', 'categories');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;
      const filepath = path.join(uploadsDir, filename);
      
      await sharp(file.buffer)
        .resize(800, 800, {
          fit: 'cover'
        })
        .webp({ quality: 90 })
        .toFile(filepath);

      res.json({ image: `/uploads/categories/${filename}` });
    } catch (error) {
      console.error('Error uploading category image:', error);
      res.status(500).json({ error: "Erro ao fazer upload da imagem" });
    }
  });

  // Watermark Image Upload API
  app.post("/api/upload/watermark-image", requireAuth, upload.single('image'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      const uploadsDir = path.join(process.cwd(), 'uploads', 'watermarks');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filename = `watermark-${Date.now()}.png`;
      const filepath = path.join(uploadsDir, filename);
      
      await sharp(file.buffer)
        .resize(400, 200, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .png()
        .toFile(filepath);

      res.json({ image: `/uploads/watermarks/${filename}` });
    } catch (error) {
      console.error('Error uploading watermark image:', error);
      res.status(500).json({ error: "Erro ao fazer upload da marca d'água" });
    }
  });

  // Image Upload API - Multiple images
  app.post("/api/upload/product-images", requireAuth, upload.array('images', 10), async (req, res) => {
    try {
      const files = req.files as Express.Multer.File[];
      
      if (!files || files.length === 0) {
        return res.status(400).json({ error: "Nenhuma imagem foi enviada" });
      }

      const settings = await storage.getSettings();
      const watermarkPath = settings?.watermarkImage || '/images/watermarks/default-watermark.png';

      const uploadsDir = path.join(process.cwd(), 'uploads', 'products');
      await fs.mkdir(uploadsDir, { recursive: true });

      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const baseFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
          
          const largeResized = await sharp(file.buffer)
            .resize(1200, 1200, {
              fit: 'inside',
              withoutEnlargement: true
            })
            .toBuffer();

          const largeWithWatermark = await applyWatermark(largeResized, watermarkPath);
          
          const largeFilename = `${baseFilename}-large.webp`;
          const largeFilepath = path.join(uploadsDir, largeFilename);
          
          await sharp(largeWithWatermark)
            .webp({ quality: 90 })
            .toFile(largeFilepath);

          const thumbResized = await sharp(file.buffer)
            .resize(400, 400, {
              fit: 'cover'
            })
            .toBuffer();

          const thumbWithWatermark = await applyWatermark(thumbResized, watermarkPath);
          
          const thumbFilename = `${baseFilename}-thumb.webp`;
          const thumbFilepath = path.join(uploadsDir, thumbFilename);
          
          await sharp(thumbWithWatermark)
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

  // Manual PDF Upload API
  app.post("/api/upload/manual", requireAuth, manualUpload.single('file'), async (req, res) => {
    try {
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
      }

      // Verify PDF signature (basic check)
      const pdfSignature = file.buffer.slice(0, 4).toString();
      if (!pdfSignature.startsWith('%PDF')) {
        return res.status(400).json({ error: "Arquivo inválido. Apenas PDFs são permitidos." });
      }

      const uploadsDir = path.join(process.cwd(), 'uploads', 'manuals');
      await fs.mkdir(uploadsDir, { recursive: true });

      const filename = `manual-${Date.now()}-${Math.random().toString(36).substring(7)}.pdf`;
      const filepath = path.join(uploadsDir, filename);
      
      await fs.writeFile(filepath, file.buffer);

      res.json({ file: `/uploads/manuals/${filename}` });
    } catch (error) {
      console.error('Error uploading manual:', error);
      res.status(500).json({ error: "Erro ao fazer upload do manual" });
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

    // Salvar a sessão explicitamente antes de retornar a resposta
    // Isso garante que a sessão seja persistida no banco antes da próxima requisição
    req.session.save((err) => {
      if (err) {
        console.error('Erro ao salvar sessão:', err);
        return res.status(500).json({ message: "Erro ao salvar sessão" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    });
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

  // Category Colors API
  app.get("/api/categories/:categoryId/colors", async (req, res) => {
    const colors = await storage.getCategoryColors(req.params.categoryId);
    res.json(colors);
  });

  app.post("/api/categories/:categoryId/colors", requireAuth, async (req, res) => {
    try {
      const data = insertCategoryColorSchema.parse({
        ...req.body,
        categoryId: req.params.categoryId
      });
      const color = await storage.createCategoryColor(data);
      res.status(201).json(color);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/categories/:categoryId/colors/:id", requireAuth, async (req, res) => {
    try {
      const existingColor = await storage.getCategoryColor(req.params.id);
      if (!existingColor) {
        return res.status(404).json({ error: "Color not found" });
      }
      if (existingColor.categoryId !== req.params.categoryId) {
        return res.status(404).json({ error: "Color not found in this category" });
      }
      
      const data = insertCategoryColorSchema.partial().parse(req.body);
      const color = await storage.updateCategoryColor(req.params.id, {
        ...data,
        categoryId: req.params.categoryId
      });
      if (!color) {
        return res.status(404).json({ error: "Color not found" });
      }
      res.json(color);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/categories/:categoryId/colors/:id", requireAuth, async (req, res) => {
    const existingColor = await storage.getCategoryColor(req.params.id);
    if (!existingColor) {
      return res.status(404).json({ error: "Color not found" });
    }
    if (existingColor.categoryId !== req.params.categoryId) {
      return res.status(404).json({ error: "Color not found in this category" });
    }
    
    const deleted = await storage.deleteCategoryColor(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Color not found" });
    }
    res.status(204).send();
  });

  // Category Control Types API
  app.get("/api/categories/:categoryId/control-types", async (req, res) => {
    const controlTypes = await storage.getCategoryControlTypes(req.params.categoryId);
    res.json(controlTypes);
  });

  app.post("/api/categories/:categoryId/control-types", requireAuth, async (req, res) => {
    try {
      const data = insertCategoryControlTypeSchema.parse({
        ...req.body,
        categoryId: req.params.categoryId
      });
      const controlType = await storage.createCategoryControlType(data);
      res.status(201).json(controlType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/categories/:categoryId/control-types/:id", requireAuth, async (req, res) => {
    try {
      const existingControlType = await storage.getCategoryControlType(req.params.id);
      if (!existingControlType) {
        return res.status(404).json({ error: "Control type not found" });
      }
      if (existingControlType.categoryId !== req.params.categoryId) {
        return res.status(404).json({ error: "Control type not found in this category" });
      }
      
      const data = insertCategoryControlTypeSchema.partial().parse(req.body);
      const controlType = await storage.updateCategoryControlType(req.params.id, {
        ...data,
        categoryId: req.params.categoryId
      });
      if (!controlType) {
        return res.status(404).json({ error: "Control type not found" });
      }
      res.json(controlType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/categories/:categoryId/control-types/:id", requireAuth, async (req, res) => {
    const existingControlType = await storage.getCategoryControlType(req.params.id);
    if (!existingControlType) {
      return res.status(404).json({ error: "Control type not found" });
    }
    if (existingControlType.categoryId !== req.params.categoryId) {
      return res.status(404).json({ error: "Control type not found in this category" });
    }
    
    const deleted = await storage.deleteCategoryControlType(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Control type not found" });
    }
    res.status(204).send();
  });

  app.patch("/api/categories/:categoryId/control-types/reorder", requireAuth, async (req, res) => {
    try {
      const schema = z.object({
        updates: z.array(z.object({
          id: z.string(),
          displayOrder: z.number()
        }))
      });
      const { updates } = schema.parse(req.body);
      
      for (const update of updates) {
        const controlType = await storage.getCategoryControlType(update.id);
        if (!controlType || controlType.categoryId !== req.params.categoryId) {
          return res.status(400).json({ error: "Invalid control type ID for this category" });
        }
      }
      
      await storage.updateControlTypesOrder(updates);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
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

  app.patch("/api/orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status } = z.object({ status: z.enum(["pending", "confirmed", "in_production", "delivered", "cancelled"]) }).parse(req.body);
      const order = await storage.updateOrder(req.params.id, { status });
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

  // Settings API
  app.get("/api/settings", async (req, res) => {
    const settings = await storage.getSettings();
    res.json(settings);
  });

  app.put("/api/settings", requireAdmin, async (req, res) => {
    try {
      const data = insertSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateSettings(data);
      if (!settings) {
        return res.status(404).json({ error: "Settings not found" });
      }
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Customer Authentication API
  app.post("/api/customer/register", async (req, res) => {
    try {
      const { name, email, password, phone, cpf } = insertCustomerSchema.parse(req.body);
      
      const existingCustomer = await storage.getCustomerByEmail(email);
      if (existingCustomer) {
        return res.status(400).json({ error: "Email já cadastrado" });
      }

      if (!password) {
        return res.status(400).json({ error: "Senha é obrigatória" });
      }

      const hashedPassword = await hashPassword(password);
      const customer = await storage.createCustomer({
        name,
        email,
        password: hashedPassword,
        phone,
        cpf,
        active: true
      });

      const { password: _, ...customerWithoutPassword } = customer;
      
      if (req.session) {
        req.session.customerId = customer.id;
      }

      res.status(201).json(customerWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/customer/login", async (req, res) => {
    try {
      const { email, password } = z.object({
        email: z.string().email(),
        password: z.string()
      }).parse(req.body);

      const customer = await storage.getCustomerByEmail(email);
      if (!customer || !customer.password) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      const isValidPassword = await verifyPassword(password, customer.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
      }

      if (!customer.active) {
        return res.status(401).json({ error: "Conta desativada" });
      }

      if (req.session) {
        req.session.customerId = customer.id;
      }

      const { password: _, ...customerWithoutPassword } = customer;
      res.json(customerWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/customer/logout", (req, res) => {
    if (req.session) {
      req.session.customerId = undefined;
    }
    res.status(204).send();
  });

  app.get("/api/customer/me", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const customer = await storage.getCustomer(req.session.customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const { password: _, ...customerWithoutPassword } = customer;
    res.json(customerWithoutPassword);
  });

  app.put("/api/customer/me", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const data = insertCustomerSchema.partial().omit({ password: true }).parse(req.body);
      const customer = await storage.updateCustomer(req.session.customerId, data);
      
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      const { password: _, ...customerWithoutPassword } = customer;
      res.json(customerWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/customer/me/password", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const { currentPassword, newPassword } = z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(6)
      }).parse(req.body);

      const customer = await storage.getCustomer(req.session.customerId);
      if (!customer) {
        return res.status(404).json({ error: "Customer not found" });
      }

      if (!customer.password) {
        return res.status(400).json({ error: "Conta vinculada ao Google não possui senha" });
      }

      const isValidPassword = await verifyPassword(currentPassword, customer.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: "Senha atual incorreta" });
      }

      const hashedPassword = await hashPassword(newPassword);
      await storage.updateCustomer(req.session.customerId, { password: hashedPassword });

      res.json({ message: "Senha atualizada com sucesso" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Customer Addresses API
  app.get("/api/customer/addresses", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const addresses = await storage.getCustomerAddresses(req.session.customerId);
    res.json(addresses);
  });

  app.post("/api/customer/addresses", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const data = insertCustomerAddressSchema.parse({
        ...req.body,
        customerId: req.session.customerId
      });
      
      const address = await storage.createCustomerAddress(data);
      
      if (data.isDefault) {
        await storage.setDefaultAddress(req.session.customerId, address.id);
      }
      
      res.status(201).json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/customer/addresses/:id", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const existingAddress = await storage.getCustomerAddress(req.params.id);
      if (!existingAddress || existingAddress.customerId !== req.session.customerId) {
        return res.status(404).json({ error: "Address not found" });
      }

      const data = insertCustomerAddressSchema.partial().parse(req.body);
      const address = await storage.updateCustomerAddress(req.params.id, data);
      
      if (data.isDefault) {
        await storage.setDefaultAddress(req.session.customerId, req.params.id);
      }
      
      res.json(address);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/customer/addresses/:id", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const existingAddress = await storage.getCustomerAddress(req.params.id);
    if (!existingAddress || existingAddress.customerId !== req.session.customerId) {
      return res.status(404).json({ error: "Address not found" });
    }

    const deleted = await storage.deleteCustomerAddress(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Address not found" });
    }
    
    res.status(204).send();
  });

  app.post("/api/customer/addresses/:id/set-default", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const address = await storage.getCustomerAddress(req.params.id);
    if (!address || address.customerId !== req.session.customerId) {
      return res.status(404).json({ error: "Address not found" });
    }

    await storage.setDefaultAddress(req.session.customerId, req.params.id);
    res.json({ message: "Endereço padrão atualizado" });
  });

  // Customer Orders API
  app.get("/api/customer/orders", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const orders = await storage.getOrdersByCustomer(req.session.customerId);
    
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await storage.getOrderItems(order.id);
        return { ...order, items };
      })
    );
    
    res.json(ordersWithItems);
  });

  app.get("/api/customer/orders/:id", async (req, res) => {
    if (!req.session?.customerId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const order = await storage.getOrder(req.params.id);
    if (!order || order.customerId !== req.session.customerId) {
      return res.status(404).json({ error: "Order not found" });
    }

    const items = await storage.getOrderItems(order.id);
    res.json({ ...order, items });
  });

  // Google OAuth Routes
  app.get("/auth/google", (req, res) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const host = req.get('host') || 'persianapratica.com.br';
    const redirectUri = `https://${host}/auth/google/callback`;
    
    console.log('[Google OAuth] Redirect URI:', redirectUri);
    console.log('[Google OAuth] Client ID:', clientId);
    
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", clientId!);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "code");
    googleAuthUrl.searchParams.set("scope", "openid email profile");
    googleAuthUrl.searchParams.set("access_type", "offline");
    
    res.redirect(googleAuthUrl.toString());
  });

  app.get("/auth/google/callback", async (req, res) => {
    try {
      const code = req.query.code as string;
      
      if (!code) {
        console.error('[Google OAuth] No code received');
        return res.redirect("/?error=auth_failed");
      }

      const clientId = process.env.GOOGLE_CLIENT_ID!;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
      const host = req.get('host') || 'persianapratica.com.br';
      const redirectUri = `https://${host}/auth/google/callback`;
      
      console.log('[Google OAuth Callback] Redirect URI:', redirectUri);

      const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code"
        })
      });

      const tokens = await tokenResponse.json();
      
      if (!tokens.access_token) {
        return res.redirect("/?error=auth_failed");
      }

      const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${tokens.access_token}` }
      });

      const googleUser = await userInfoResponse.json();
      
      let customer = await storage.getCustomerByGoogleId(googleUser.id);
      
      if (!customer) {
        const existingCustomer = await storage.getCustomerByEmail(googleUser.email);
        
        if (existingCustomer) {
          customer = await storage.updateCustomer(existingCustomer.id, {
            googleId: googleUser.id
          });
        } else {
          customer = await storage.createCustomer({
            name: googleUser.name,
            email: googleUser.email,
            googleId: googleUser.id,
            active: true
          });
        }
      }

      if (req.session && customer) {
        req.session.customerId = customer.id;
      }

      res.redirect("/");
    } catch (error) {
      console.error("Google OAuth error:", error);
      res.redirect("/?error=auth_failed");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
