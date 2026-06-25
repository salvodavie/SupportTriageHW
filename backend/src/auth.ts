import type { NextFunction, Request, Response } from 'express';
import type { AuthenticatedUser } from './types.js';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

const demoUsersByToken: Record<string, AuthenticatedUser> = {
  'candidate-admin-token': { id: 'u-admin', role: 'admin' },
  'candidate-instructor-token': { id: 'u-instructor', role: 'instructor' },
  'candidate-student-token': { id: 'u-student', role: 'student' },
  'candidate-observer-token': { id: 'u-observer', role: 'observer' },
};

function getBearerToken(req: Request): string | null {
  const header = req.header('authorization') || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export function requireAuthenticatedUser(req: Request, res: Response, next: NextFunction): void {
  const token = getBearerToken(req);
  const user = token ? demoUsersByToken[token] : null;

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      timestamp: Date.now(),
    });
    return;
  }

  req.user = user;
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin role required',
      timestamp: Date.now(),
    });
    return;
  }

  next();
}

