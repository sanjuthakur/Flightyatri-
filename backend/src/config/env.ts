import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8080),
  CLIENT_ORIGIN: z.string().url().or(z.literal("*")).default("http://localhost:5173"),
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  AVIATIONSTACK_API_KEY: z.string().min(1, "AVIATIONSTACK_API_KEY is required")
});

export const env = envSchema.parse(process.env);

