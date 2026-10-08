import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaClient } from "@/app/generated/prisma";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;


const prismaClientSingleton = () => {
    if (!connectionString) {
        console.warn("⚠️ Warning: DATABASE_URL is not configured in .env. Database operations will fail until configured.");
        return new Proxy({} as PrismaClient, {
            get(target, prop, receiver) {
                if (prop in target) return Reflect.get(target, prop, receiver);
                return new Proxy(() => { }, {
                    get() {
                        return () => Promise.resolve(null);
                    },
                    apply() {
                        return Promise.resolve(null);
                    },
                });
            },
        });
    }
    const adapter = new PrismaNeon({ connectionString });
    return new PrismaClient({ adapter });
};

declare const globalThis: {
    prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = db;