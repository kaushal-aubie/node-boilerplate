import type { User } from '@/db/schema';

export type ApiEnv = {
  Variables: {
    user?: User;
  };
};
