import type { Request, Response } from 'express';
import type { User } from '@/models';
import { IServices } from '../modules/service';

export interface IContext {
  ip: string;
  requestedBy: string | null;
  token: string | null;
  payload: unknown | null;
  user: User | null;
  services: IServices;
  req: Request;
  res: Response;
}
