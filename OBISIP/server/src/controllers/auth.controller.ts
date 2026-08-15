import { Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { env } from '../config/env';

/** Generate a signed JWT for a user */
const generateToken = (id: string, role: string, email: string): string => {
  const options: SignOptions = { expiresIn: '7d' };
  return jwt.sign({ id, role, email }, env.JWT_SECRET, options);
};

// ── Validation schemas ──────────────────────────────────────────────────────

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits').optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ── Controllers ─────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 * Creates a new customer account.
 */
export const register = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = registerSchema.parse(req.body);

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new AppError('Email already registered. Please log in.', 409);
    }

    const user = await User.create({
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      role: 'customer',
    });

    const token = generateToken(
      user._id.toString(),
      user.role,
      user.email
    );

    res.status(201).json(
      new ApiResponse(201, 'Account created successfully', {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      })
    );
  }
);

/**
 * POST /api/auth/login
 * Authenticates an existing user and returns a JWT.
 */
export const login = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = loginSchema.parse(req.body);

    // Explicitly select password (excluded by default in schema)
    const user = await User.findOne({ email: body.email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(body.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(
      user._id.toString(),
      user.role,
      user.email
    );

    res.status(200).json(
      new ApiResponse(200, 'Login successful', {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          addresses: user.addresses,
        },
      })
    );
  }
);

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 */
export const getMe = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.user!._id);
    if (!user) throw new AppError('User not found', 404);

    res.status(200).json(
      new ApiResponse(200, 'Profile fetched', {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      })
    );
  }
);

/**
 * PUT /api/auth/profile
 * Updates the current user's name, phone, and addresses.
 */
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const updateSchema = z.object({
      name: z.string().min(2).optional(),
      phone: z.string().regex(/^\d{10}$/).optional(),
      addresses: z
        .array(
          z.object({
            label: z.string(),
            street: z.string(),
            city: z.string(),
            state: z.string(),
            pincode: z.string().regex(/^\d{6}$/),
            isDefault: z.boolean().optional(),
          })
        )
        .optional(),
    });

    const body = updateSchema.parse(req.body);
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!user) throw new AppError('User not found', 404);

    res.status(200).json(new ApiResponse(200, 'Profile updated', user));
  }
);
