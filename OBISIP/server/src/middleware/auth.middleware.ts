import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { asyncHandler } from '../utils/asyncHandler';

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: 'customer' | 'admin';
    email: string;
  };
}

/**
 * Authenticates a request by verifying the JWT from the Authorization header.
 * Attaches the decoded user to `req.user`.
 */
export const authenticate = asyncHandler(
  async (req: AuthRequest, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // Support both Authorization header and cookie
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError('Authentication required. Please log in.', 401);
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      role: 'customer' | 'admin';
      email: string;
    };

    // Confirm user still exists
    const user = await User.findById(decoded.id).select('_id role email');
    if (!user) {
      throw new AppError('User belonging to this token no longer exists.', 401);
    }

    req.user = {
      _id: user._id.toString(),
      role: user.role,
      email: user.email,
    };

    next();
  }
);
