import { z } from 'zod';
import { ENV_MODE } from './constants';

const envSchema = z.object({
  NODE_ENV: z.enum([ENV_MODE.PRODUCTION, ENV_MODE.DEVELOPMENT, ENV_MODE.TEST]),
  PORT: z.coerce.number().default(5000),
  COOKIE_SECRET: z.string().min(1),
  COOKIE_EXP: z.string().default('15'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_SECRET: z.string().min(1),

  DB_PORT: z.coerce.number(),
  DB_NAME: z.string().min(1),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().optional().default(''),
  DB_HOST: z.string().min(1),
  DATABASE_URL: z.string().optional(),

  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional().default(''),
  REDIS_DB: z.coerce.number().default(0),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USERNAME: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    throw new Error(`Config validation error: ${parsed.error.message}`);
  }
  cached = parsed.data;
  return parsed.data;
}

export const envVars = new Proxy({} as Env, {
  get(_t, prop: string) {
    return getEnv()[prop as keyof Env];
  },
});
