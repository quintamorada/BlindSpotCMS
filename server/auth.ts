import bcrypt from "bcryptjs";
import { storage } from "./storage";
import type { User } from "@shared/schema";

declare module 'express-session' {
  interface SessionData {
    customerId?: string;
  }
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function authenticateUser(username: string, password: string): Promise<User | null> {
  const user = await storage.getUserByUsername(username);
  
  if (!user || !user.active) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    return null;
  }

  return user;
}
