import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { eq, asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as schema from "@shared/schema";
import type { 
  Category, InsertCategory,
  CategoryColor, InsertCategoryColor,
  CategoryControlType, InsertCategoryControlType,
  Product, InsertProduct,
  Page, InsertPage,
  User, InsertUser,
  Customer, InsertCustomer,
  CustomerAddress, InsertCustomerAddress,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  Settings, InsertSettings
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

  // Category Colors
  getCategoryColors(categoryId: string): Promise<CategoryColor[]>;
  getCategoryColor(id: string): Promise<CategoryColor | undefined>;
  createCategoryColor(color: InsertCategoryColor): Promise<CategoryColor>;
  updateCategoryColor(id: string, color: Partial<InsertCategoryColor>): Promise<CategoryColor | undefined>;
  deleteCategoryColor(id: string): Promise<boolean>;

  // Category Control Types
  getCategoryControlTypes(categoryId: string): Promise<CategoryControlType[]>;
  getCategoryControlType(id: string): Promise<CategoryControlType | undefined>;
  createCategoryControlType(controlType: InsertCategoryControlType): Promise<CategoryControlType>;
  updateCategoryControlType(id: string, controlType: Partial<InsertCategoryControlType>): Promise<CategoryControlType | undefined>;
  updateControlTypesOrder(updates: Array<{ id: string; displayOrder: number }>): Promise<void>;
  deleteCategoryControlType(id: string): Promise<boolean>;

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

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: string): Promise<Customer | undefined>;
  getCustomerByEmail(email: string): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  // Customer Addresses
  getCustomerAddresses(customerId: string): Promise<CustomerAddress[]>;
  getCustomerAddress(id: string): Promise<CustomerAddress | undefined>;
  createCustomerAddress(address: InsertCustomerAddress): Promise<CustomerAddress>;
  updateCustomerAddress(id: string, address: Partial<InsertCustomerAddress>): Promise<CustomerAddress | undefined>;
  deleteCustomerAddress(id: string): Promise<boolean>;
  setDefaultAddress(customerId: string, addressId: string): Promise<void>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByCustomer(customerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, order: Partial<InsertOrder>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;

  // Order Items
  getOrderItems(orderId: string): Promise<OrderItem[]>;
  getOrderItem(id: string): Promise<OrderItem | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  deleteOrderItem(id: string): Promise<boolean>;

  // Settings
  getSettings(): Promise<Settings | undefined>;
  updateSettings(settings: Partial<InsertSettings>): Promise<Settings | undefined>;
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

  // Category Colors
  async getCategoryColors(categoryId: string): Promise<CategoryColor[]> {
    return await db.select().from(schema.categoryColors).where(eq(schema.categoryColors.categoryId, categoryId));
  }

  async getCategoryColor(id: string): Promise<CategoryColor | undefined> {
    const result = await db.select().from(schema.categoryColors).where(eq(schema.categoryColors.id, id));
    return result[0];
  }

  async createCategoryColor(insertColor: InsertCategoryColor): Promise<CategoryColor> {
    const id = randomUUID();
    const result = await db.insert(schema.categoryColors).values({ id, ...insertColor }).returning();
    return result[0];
  }

  async updateCategoryColor(id: string, color: Partial<InsertCategoryColor>): Promise<CategoryColor | undefined> {
    const result = await db.update(schema.categoryColors)
      .set(color)
      .where(eq(schema.categoryColors.id, id))
      .returning();
    return result[0];
  }

  async deleteCategoryColor(id: string): Promise<boolean> {
    const result = await db.delete(schema.categoryColors).where(eq(schema.categoryColors.id, id)).returning();
    return result.length > 0;
  }

  // Category Control Types
  async getCategoryControlTypes(categoryId: string): Promise<CategoryControlType[]> {
    return await db.select().from(schema.categoryControlTypes).where(eq(schema.categoryControlTypes.categoryId, categoryId)).orderBy(asc(schema.categoryControlTypes.displayOrder));
  }

  async getCategoryControlType(id: string): Promise<CategoryControlType | undefined> {
    const result = await db.select().from(schema.categoryControlTypes).where(eq(schema.categoryControlTypes.id, id));
    return result[0];
  }

  async createCategoryControlType(insertControlType: InsertCategoryControlType): Promise<CategoryControlType> {
    const id = randomUUID();
    const result = await db.insert(schema.categoryControlTypes).values({ id, ...insertControlType }).returning();
    return result[0];
  }

  async updateCategoryControlType(id: string, controlType: Partial<InsertCategoryControlType>): Promise<CategoryControlType | undefined> {
    const result = await db.update(schema.categoryControlTypes)
      .set(controlType)
      .where(eq(schema.categoryControlTypes.id, id))
      .returning();
    return result[0];
  }

  async updateControlTypesOrder(updates: Array<{ id: string; displayOrder: number }>): Promise<void> {
    await db.transaction(async (tx) => {
      for (const { id, displayOrder } of updates) {
        await tx.update(schema.categoryControlTypes)
          .set({ displayOrder })
          .where(eq(schema.categoryControlTypes.id, id));
      }
    });
  }

  async deleteCategoryControlType(id: string): Promise<boolean> {
    const result = await db.delete(schema.categoryControlTypes).where(eq(schema.categoryControlTypes.id, id)).returning();
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

  // Customers
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(schema.customers);
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(schema.customers).where(eq(schema.customers.id, id));
    return result[0];
  }

  async getCustomerByEmail(email: string): Promise<Customer | undefined> {
    const result = await db.select().from(schema.customers).where(eq(schema.customers.email, email));
    return result[0];
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const result = await db.insert(schema.customers).values({ id, ...insertCustomer }).returning();
    return result[0];
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const result = await db.update(schema.customers)
      .set({ ...customer, updatedAt: new Date() })
      .where(eq(schema.customers.id, id))
      .returning();
    return result[0];
  }

  async deleteCustomer(id: string): Promise<boolean> {
    const result = await db.delete(schema.customers).where(eq(schema.customers.id, id)).returning();
    return result.length > 0;
  }

  // Customer Addresses
  async getCustomerAddresses(customerId: string): Promise<CustomerAddress[]> {
    return await db.select().from(schema.customerAddresses).where(eq(schema.customerAddresses.customerId, customerId));
  }

  async getCustomerAddress(id: string): Promise<CustomerAddress | undefined> {
    const result = await db.select().from(schema.customerAddresses).where(eq(schema.customerAddresses.id, id));
    return result[0];
  }

  async createCustomerAddress(insertAddress: InsertCustomerAddress): Promise<CustomerAddress> {
    const id = randomUUID();
    const result = await db.insert(schema.customerAddresses).values({ id, ...insertAddress }).returning();
    return result[0];
  }

  async updateCustomerAddress(id: string, address: Partial<InsertCustomerAddress>): Promise<CustomerAddress | undefined> {
    const result = await db.update(schema.customerAddresses)
      .set({ ...address, updatedAt: new Date() })
      .where(eq(schema.customerAddresses.id, id))
      .returning();
    return result[0];
  }

  async deleteCustomerAddress(id: string): Promise<boolean> {
    const result = await db.delete(schema.customerAddresses).where(eq(schema.customerAddresses.id, id)).returning();
    return result.length > 0;
  }

  async setDefaultAddress(customerId: string, addressId: string): Promise<void> {
    await db.transaction(async (tx) => {
      await tx.update(schema.customerAddresses)
        .set({ isDefault: false })
        .where(eq(schema.customerAddresses.customerId, customerId));
      
      await tx.update(schema.customerAddresses)
        .set({ isDefault: true })
        .where(eq(schema.customerAddresses.id, addressId));
    });
  }

  // Orders
  async getOrders(): Promise<(Order & { items: OrderItem[] })[]> {
    const orders = await db.select().from(schema.orders);
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        const items = await this.getOrderItems(order.id);
        return { ...order, items };
      })
    );
    return ordersWithItems;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(schema.orders).where(eq(schema.orders.id, id));
    return result[0];
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    return await db.select().from(schema.orders).where(eq(schema.orders.customerId, customerId));
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

  // Settings
  async getSettings(): Promise<Settings | undefined> {
    const result = await db.select().from(schema.settings).where(eq(schema.settings.id, 'default'));
    return result[0];
  }

  async updateSettings(settings: Partial<InsertSettings>): Promise<Settings | undefined> {
    const result = await db.update(schema.settings)
      .set({ ...settings, updatedAt: new Date() })
      .where(eq(schema.settings.id, 'default'))
      .returning();
    return result[0];
  }
}

export const storage = new DbStorage();
