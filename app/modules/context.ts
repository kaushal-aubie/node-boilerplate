import type { Request, Response } from 'express';
import type { IContext } from '@/interfaces';
import { Jwt } from '@/libs';
import { User } from '@/models';
import { TokenUtils } from '@/utils';
import { services } from './service';

const contextHandler = async ({ req, res }: { req: Request; res: Response }): Promise<IContext> => {
  const token = TokenUtils.getToken(req);
  let user: User | null = null;
  if (token) {
    const tokenVerificationRes = await Jwt.verify(token);
    user = await User.findByPk(tokenVerificationRes.user_id);
  }
  return {
    user,
    req,
    res,
    ip: req.ip || (req.socket || {}).remoteAddress || '',
    requestedBy: req.get('x-requested-by') || null,
    token: token || null,
    payload: null,
    services,
  };
};

export default contextHandler;
