import { z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../validators/QueryValidator";
import { getPayloadClient } from "../../app/get-payload";
import { equal } from "assert";

export const appRouter = router({
	auth: authRouter,

	getInfinitProducts: publicProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100),
				cursor: z.number().nullish(),
				query: QueryValidator,
			})
		)
		.query(async ({ input }) => {
			const { query, cursor } = input;
			const { sort, limit, ...queryOpts } = query;

			const payload = await getPayloadClient();

			const parsedQueryOptions: Record<string, { equals: string }> = {};

			Object.entries(queryOpts).forEach(([key, value]) => {
				parsedQueryOptions[key] = {
					equals: value,
				};
			});

			const page = cursor || 1;

			const {
				docs: items,
				hasNextPage,
				nextPage,
			} = await payload.find({
				collection: "products",
				where: {
					approvedForSale: {
						equals: "approved",
					},
					...parsedQueryOptions,
				},
				sort,
				depth: 1,
				limit,
				page,
			});

			return {
				items,
				nextPage: hasNextPage ? nextPage : null,
			};
		}),
});

export type AppRouter = typeof appRouter;
