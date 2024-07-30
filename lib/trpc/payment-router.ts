import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../../app/get-payload";
import { stripe } from "../stripe";

export const paymentRouter = router({
	createSession: privateProcedure
		.input(z.object({ productIds: z.array(z.string()) }))
		.mutation(async ({ ctx, input }) => {
			const { user } = ctx;
			let { productIds } = input;

			if (productIds.length === 0) {
				throw new TRPCError({ code: "BAD_REQUEST" });
			}

			const payload = await getPayloadClient();

			const { docs: products } = await payload.find({
				collection: "products",
				where: {
					id: {
						in: productIds,
					},
				},
			});

			const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

			const order = await payload.create({
				collection: "orders",
				data: {
					_isPaid: false,
					products: filteredProducts,
					user: user.id,
				},
			});

			try {
				const stripeSession = await stripe.checkout.sessions.create({
					success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
				});
			} catch (err) {}
		}),
});
