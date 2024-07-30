import { User } from "../../app/payload-types";
import { ExpressContext } from "../../app/server";
import { initTRPC, TRPCError } from "@trpc/server";
import { PayloadRequest } from "payload/types";

const t = initTRPC.context<ExpressContext>().create();

const middleware = t.middleware;

const isAuthenticated = middleware(async ({ ctx, next }) => {
	const req = ctx.req as PayloadRequest;

	const { user } = req as { user: User | null };

	if (!user || !user.id) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}

	return next({
		ctx: {
			user,
		},
	});
});

export const router = t.router;

export const publicProcedure = t.procedure;

export const privateProcedure = t.procedure.use(isAuthenticated);
