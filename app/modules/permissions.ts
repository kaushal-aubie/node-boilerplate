import { allow, rule, shield } from 'graphql-shield';
import { IContext } from '@/interfaces';

const isAuthenticated = rule({ cache: 'contextual' })(
  (_parent: unknown, _args: unknown, context: IContext) => context.user !== null
);

const permissions = shield({
  Query: {
    getUser: isAuthenticated,
    getAllUsers: isAuthenticated,
    getOne: isAuthenticated,
  },
  Mutation: {
    '*': allow,
  },
});

export { permissions };
