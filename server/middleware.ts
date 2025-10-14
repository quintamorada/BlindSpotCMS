import { Request, Response, NextFunction } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Não autorizado. Faça login para continuar." });
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Não autorizado. Faça login para continuar." });
  }
  
  if (req.session.userRole !== "admin") {
    return res.status(403).json({ message: "Acesso negado. Apenas administradores podem acessar." });
  }
  
  next();
}
