import authResolver from './auth/auth.resolver';
import userResolver from './user/user.resolver';

const resolvers = {
  ...userResolver,
  ...authResolver,
};

export default resolvers;
