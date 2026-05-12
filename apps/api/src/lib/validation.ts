import { z } from 'zod';

// Chat request validation
export const ChatRequestSchema = z.object({
  sessionId: z.string().optional().nullable(),
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message too long'),
});

// Helper function to validate and parse
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }));
    const error = new Error('Validation failed');

    (error as any).status = 400;
    (error as any).errors = errors;

    throw error;
  }
  return result.data;
}
