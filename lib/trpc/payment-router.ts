import { z } from "zod";
import { privateProcedure, router } from "./trpc";
import { getPayloadClient } from "../../app/get-payload";
import { stripe } from "../stripe";
import { Product } from "../../app/payload-types";
import type Stripe from "stripe";
import { TRPCError } from "@trpc/server";

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
					products: filteredProducts.map((prod) => prod.id) as (
						| string
						| Product
					)[],
					user: user.id,
				},
			});

			const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

			filteredProducts.forEach((product) => {
				line_items.push({
					price: product.priceId! as string,
					quantity: 1,
				});
			});

			line_items.push({
				price: "price_1PiHA12LMUBfV12CcxqbFn1D",
				quantity: 1,
				adjustable_quantity: {
					enabled: false,
				},
			});

			try {
				const stripeSession = await stripe.checkout.sessions.create({
					success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
					cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
					payment_method_types: ["card", "cashapp"],
					mode: "payment",
					metadata: {
						userId: user.id,
						orderId: order.id,
					},
					line_items,
				});

				return { url: stripeSession.url };
			} catch (error) {
				console.log(error);

				return { url: null };
			}
		}),
});
