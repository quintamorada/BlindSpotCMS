import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as schema from "@shared/schema";
import type { 
  Category, InsertCategory,
  Product, InsertProduct,
  Page, InsertPage,
  User, InsertUser,
  Order, InsertOrder,
  OrderItem, InsertOrderItem
} from "@shared/schema";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategory(categoryId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Pages
  getPages(): Promise<Page[]>;
  getPage(id: string): Promise<Page | undefined>;
  getPageBySlug(slug: string): Promise<Page | undefined>;
  createPage(page: InsertPage): Promise<Page>;
  updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined>;
  deletePage(id: string): Promise<boolean>;

  // Users
  getUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  getOrderItem(id: string): Promise<OrderItem | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  deleteOrderItem(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db.select().from(schema.categories);
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const result = await db.select().from(schema.categories).where(eq(schema.categories.id, id));
    return result[0];
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(schema.categories).where(eq(schema.categories.slug, slug));
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const result = await db.insert(schema.categories).values({ id, ...insertCategory }).returning();
    return result[0];
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const result = await db.update(schema.categories)
      .set(category)
      .where(eq(schema.categories.id, id))
      .returning();
    return result[0];
  }

  async deleteCategory(id: string): Promise<boolean> {
    const result = await db.delete(schema.categories).where(eq(schema.categories.id, id)).returning();
    return result.length > 0;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(schema.products);
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const result = await db.select().from(schema.products).where(eq(schema.products.id, id));
    return result[0];
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    const result = await db.select().from(schema.products).where(eq(schema.products.slug, slug));
    return result[0];
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    return await db.select().from(schema.products).where(eq(schema.products.categoryId, categoryId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const result = await db.insert(schema.products).values({ id, ...insertProduct }).returning();
    return result[0];
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const result = await db.update(schema.products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(schema.products.id, id))
      .returning();
    return result[0];
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await db.delete(schema.products).where(eq(schema.products.id, id)).returning();
    return result.length > 0;
  }

  // Pages
  async getPages(): Promise<Page[]> {
    return await db.select().from(schema.pages);
  }

  async getPage(id: string): Promise<Page | undefined> {
    const result = await db.select().from(schema.pages).where(eq(schema.pages.id, id));
    return result[0];
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const result = await db.select().from(schema.pages).where(eq(schema.pages.slug, slug));
    return result[0];
  }

  async createPage(insertPage: InsertPage): Promise<Page> {
    const id = randomUUID();
    const result = await db.insert(schema.pages).values({ id, ...insertPage }).returning();
    return result[0];
  }

  async updatePage(id: string, page: Partial<InsertPage>): Promise<Page | undefined> {
    const result = await db.update(schema.pages)
      .set({ ...page, updatedAt: new Date() })
      .where(eq(schema.pages.id, id))
      .returning();
    return result[0];
  }

  async deletePage(id: string): Promise<boolean> {
    const result = await db.delete(schema.pages).where(eq(schema.pages.id, id)).returning();
    return result.length > 0;
  }

  // Users
  async getUsers(): Promise<User[]> {
    return await db.select().from(schema.users);
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(schema.users).where(eq(schema.users.email, email));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const result = await db.insert(schema.users).values({ id, ...insertUser }).returning();
    return result[0];
  }

  async updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(schema.users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(schema.users.id, id))
      .returning();
    return result[0];
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(schema.users).where(eq(schema.users.id, id)).returning();
    return result.length > 0;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(schema.orders);
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    return result[0];
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const result = await db.insert(schema.orders).values({ id, ...insertOrder }).returning();
    return result[0];
  }

  async updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined> {
    const result = await db.update(schema.orders)
      .set({ ...order, updatedAt: new Date() })
      .where(eq(schema.orders.id, id))
      .returning();
    return result[0];
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await db.delete(schema.orders).where(eq(schema.orders.id, id)).returning();
    return result.length > 0;
  }

  // Order Items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return await db.select().from(schema.orderItems).where(eq(schema.orderItems.orderId, orderId));
  }

  async getOrderItem(id: string): Promise<OrderItem | undefined> {
    const result = await db.select().from(schema.orderItems).where(eq(schema.orderItems.id, id));
    return result[0];
  }

  async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
    const id = randomUUID();
    const result = await db.insert(schema.orderItems).values({ id, ...insertOrderItem }).returning();
    return result[0];
  }

  async deleteOrderItem(id: string): Promise<boolean> {
    const result = await db.delete(schema.orderItems).where(eq(schema.orderItems.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new DbStorage();
