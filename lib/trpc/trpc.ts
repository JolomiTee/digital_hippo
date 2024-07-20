import { ExpressContext } from "@/app/server";
import { initTRPC } from "@trpc/server";

const t = initTRPC.context<ExpressContext>().create();

export const router = t.router;

export const publicProcedure = t.procedure;
