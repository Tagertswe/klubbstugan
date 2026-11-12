import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

let client: PrismaClient | undefined;

/** One Prisma client per server process, created on first use. */
export function useDb(): PrismaClient {
  if (!client) {
    const connectionString = useRuntimeConfig().databaseUrl || process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    client = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  }
  return client;
}
