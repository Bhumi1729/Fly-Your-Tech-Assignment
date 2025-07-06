import { Request } from "express";

export interface AuthRequest extends Request {
  user?: any; // customize as needed
}
