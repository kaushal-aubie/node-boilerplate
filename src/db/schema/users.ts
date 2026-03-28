import { z } from '@hono/zod-openapi';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 128 }),
  lastName: varchar('last_name', { length: 128 }),
  email: varchar('email', { length: 128 }).notNull().unique(),
  password: varchar('password', { length: 128 }),
  mobile: varchar('mobile', { length: 128 }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

const userSelect = createSelectSchema(users);

const insertUser = createInsertSchema(users, {
  email: () => z.email(),
  password: (s) => s.min(8),
});

const registerBodyBase = insertUser.omit({ id: true, createdAt: true, updatedAt: true }).extend({
  password: z.string().min(8),
});

/** API: register body (Drizzle insert minus server-managed fields). */
export const registerBodySchema = registerBodyBase.openapi('RegisterBody');
export type RegisterBody = z.infer<typeof registerBodyBase>;

const loginBodyBase = z.object({
  email: userSelect.shape.email,
  password: z.string().min(1),
});

/** API: login body (email from row shape + password). */
export const loginBodySchema = loginBodyBase.openapi('LoginBody');
export type LoginBody = z.infer<typeof loginBodyBase>;

/** Serialized user for JSON (no password; ISO date strings). */
export const selectUserPublicSchema = userSelect
  .omit({ password: true })
  .extend({
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi('UserPublic');
