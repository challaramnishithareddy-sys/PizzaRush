import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Pizza } from '../models/Pizza';
import { AppError } from '../utils/AppError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthRequest } from '../middleware/auth.middleware';

// ── Validation ───────────────────────────────────────────────────────────────

const pizzaSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  category: z.enum(['veg', 'non-veg', 'specialty']),
  basePrice: z.number().min(1),
  sizes: z.array(
    z.object({
      size: z.enum(['small', 'medium', 'large']),
      price: z.number().min(1),
    })
  ),
  crusts: z.array(z.string()).optional(),
  toppings: z
    .array(z.object({ name: z.string(), price: z.number().min(0) }))
    .optional(),
  image: z.string().url().optional(),
  isFeatured: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

// ── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/pizzas
 * Public. Supports search, category filter, sort, and pagination.
 */
export const getAllPizzas = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      search,
      category,
      sort = '-createdAt',
      page = '1',
      limit = '12',
      available = 'true',
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (available === 'true') filter.isAvailable = true;
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$text = { $search: search };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [pizzas, total] = await Promise.all([
      Pizza.find(filter)
        .sort(sort as string)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Pizza.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(200, 'Pizzas fetched', {
        pizzas,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      })
    );
  }
);

/**
 * GET /api/pizzas/featured
 * Public. Returns featured pizzas for the home page.
 */
export const getFeaturedPizzas = asyncHandler(
  async (_req: Request, res: Response) => {
    const pizzas = await Pizza.find({ isFeatured: true, isAvailable: true })
      .limit(6)
      .lean();
    res.status(200).json(new ApiResponse(200, 'Featured pizzas', { pizzas }));
  }
);

/**
 * GET /api/pizzas/:id
 * Public. Single pizza detail.
 */
export const getPizzaById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id || id.startsWith('custom-') || !mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Pizza not found', 404);
    }
    const pizza = await Pizza.findById(id);
    if (!pizza) throw new AppError('Pizza not found', 404);
    res.status(200).json(new ApiResponse(200, 'Pizza found', { pizza }));
  }
);

/**
 * POST /api/pizzas
 * Admin only. Creates a new pizza.
 */
export const createPizza = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = pizzaSchema.parse(req.body);
    const pizza = await Pizza.create(body);
    res
      .status(201)
      .json(new ApiResponse(201, 'Pizza created successfully', { pizza }));
  }
);

/**
 * PUT /api/pizzas/:id
 * Admin only. Updates a pizza.
 */
export const updatePizza = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const body = pizzaSchema.partial().parse(req.body);
    const pizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      { $set: body },
      { new: true, runValidators: true }
    );
    if (!pizza) throw new AppError('Pizza not found', 404);
    res.status(200).json(new ApiResponse(200, 'Pizza updated', { pizza }));
  }
);

/**
 * DELETE /api/pizzas/:id
 * Admin only. Deletes a pizza.
 */
export const deletePizza = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const pizza = await Pizza.findByIdAndDelete(req.params.id);
    if (!pizza) throw new AppError('Pizza not found', 404);
    res.status(200).json(new ApiResponse(200, 'Pizza deleted', null));
  }
);

/**
 * PATCH /api/pizzas/:id/toggle-availability
 * Admin only. Toggles pizza availability.
 */
export const toggleAvailability = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) throw new AppError('Pizza not found', 404);

    pizza.isAvailable = !pizza.isAvailable;
    await pizza.save();

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Pizza is now ${pizza.isAvailable ? 'available' : 'unavailable'}`,
          { pizza }
        )
      );
  }
);
