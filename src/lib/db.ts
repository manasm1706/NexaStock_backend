import "dotenv/config";
import { PrismaClient, Prisma } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL!;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
export { pool };
export type PrismaInstance = Prisma.TransactionClient;
