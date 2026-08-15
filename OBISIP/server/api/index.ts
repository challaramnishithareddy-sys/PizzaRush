/**
 * Vercel Serverless Function entry point.
 * Re-exports the compiled Express app so Vercel can serve it.
 * All API routes and Socket.IO (via long-polling) are handled here.
 */
import app from '../src/app';
import { connectDatabase } from '../src/config/database';

export default async function handler(req: any, res: any) {
  await connectDatabase();
  return app(req, res);
}
