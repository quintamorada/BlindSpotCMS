import { pgTable, text, varchar, numeric, boolean, timestamp, jsonb, pgEnum, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["admin", "editor"]);

export const categories = pgTable("categories", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  controlTypes: jsonb("control_types"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoryColors = pgTable("category_colors", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  categoryId: varchar("category_id", { length: 36 }).references(() => categories.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const categoryControlTypes = pgTable("category_control_types", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  categoryId: varchar("category_id", { length: 36 }).references(() => categories.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  image: text("image").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: varchar("category_id", { length: 36 }).references(() => categories.id),
  images: text("images").array(),
  specifications: jsonb("specifications"),
  featured: boolean("featured").default(false),
  active: boolean("active").default(true),
  hasBando: boolean("has_bando").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pages = pgTable("pages", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content"),
  metaDescription: text("meta_description"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("editor"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const bandoSideEnum = pgEnum("bando_side", ["left", "right"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "confirmed", "in_production", "delivered", "cancelled"]);
export const verticalControlEnum = pgEnum("vertical_control", ["lateral-esquerda", "lateral-direita", "central-esquerda", "central-direita", "invertido-esquerda", "invertido-direita"]);
export const verticalBandoEnum = pgEnum("vertical_bando", ["sem-laterais", "lateral-esquerda", "lateral-direita", "duas-laterais"]);

export const orders = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").default("pending").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const settings = pgTable("settings", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  aluminumBandoPrice: numeric("aluminum_bando_price", { precision: 10, scale: 2 }).notNull().default("0"),
  contactEmail: text("contact_email").default("contato@persianas.com.br"),
  contactPhone: text("contact_phone").default("(11) 9999-9999"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  orderId: varchar("order_id", { length: 36 }).references(() => orders.id).notNull(),
  productId: varchar("product_id", { length: 36 }).references(() => products.id).notNull(),
  productName: text("product_name").notNull(),
  width: numeric("width", { precision: 10, scale: 2 }).notNull(),
  height: numeric("height", { precision: 10, scale: 2 }).notNull(),
  bandoSide: bandoSideEnum("bando_side").notNull(),
  colorId: varchar("color_id", { length: 36 }),
  colorName: text("color_name"),
  colorCode: text("color_code"),
  aluminumBando: boolean("aluminum_bando").default(false).notNull(),
  aluminumBandoPrice: numeric("aluminum_bando_price", { precision: 10, scale: 2 }).default("0"),
  verticalControl: verticalControlEnum("vertical_control"),
  verticalBando: verticalBandoEnum("vertical_bando"),
  controlTypeId: varchar("control_type_id", { length: 36 }),
  controlTypeName: text("control_type_name"),
  pricePerSqm: numeric("price_per_sqm", { precision: 10, scale: 2 }).notNull(),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export const insertCategoryColorSchema = createInsertSchema(categoryColors).omit({
  id: true,
  createdAt: true,
});

export const insertCategoryControlTypeSchema = createInsertSchema(categoryControlTypes).omit({
  id: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type CategoryColor = typeof categoryColors.$inferSelect;
export type InsertCategoryColor = z.infer<typeof insertCategoryColorSchema>;

export type CategoryControlType = typeof categoryControlTypes.$inferSelect;
export type InsertCategoryControlType = z.infer<typeof insertCategoryControlTypeSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertOrderItemSchemaForCreate = insertOrderItemSchema.omit({
  orderId: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertOrderItemForCreate = z.infer<typeof insertOrderItemSchemaForCreate>;

export type Settings = typeof settings.$inferSelect;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;
