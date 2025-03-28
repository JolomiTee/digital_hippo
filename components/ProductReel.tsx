"use client";

import Link from "next/link";
import { TQueryVAlidator } from "@/lib/validators/QueryValidator";
import { trpc } from "@/lib/trpc/client";
import { Product } from "@/app/payload-types";
import ProductListing from "./ProductListing";

interface ProductReelProps {
	title: string;
	subtitle?: string;
	href?: string;
	query: TQueryVAlidator;
}

const FALLBACK_LIMIT = 4;

const ProductReel = (props: ProductReelProps) => {
	const { title, subtitle, href, query } = props;

	const { data: queryResults, isLoading } =
		trpc.getInfinitProducts.useInfiniteQuery(
			{
				limit: query.limit ?? FALLBACK_LIMIT,
				query,
			},
			{
				getNextPageParam: (lastPage) => lastPage.nextPage,
			}
		);

	// Explicitly typing the products with Product type cuz it doesnt work with just passing the product to map
	const products: Product[] =
		queryResults?.pages.flatMap((page) =>
			page.items.map((item: any) => ({
				id: item.id,
				name: item.name,
				price: item.price,
				category: item.category,
				product_files: item.product_files,
				images: item.images,
				user: item.user ?? null,
				description: item.description ?? null,
				approvedForSale: item.approvedForSale ?? null,
				priceId: item.priceId ?? null,
				stripeId: item.stripeId ?? null,
				updatedAt: item.updatedAt,
				createdAt: item.createdAt,
			}))
		) || [];

	let map: (Product | null)[] = [];

	if (products && products.length) {
		map = products;
	} else if (isLoading) {
		map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
	}

	return (
		<section className="py-12">
			<div className="md:flex md:items-center md:justify-between mb-4">
				<div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
					{title ? (
						<h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
							{title}
						</h1>
					) : null}
					{subtitle ? (
						<p className="mt-2 text-sm text-muted-foreground">
							{subtitle}
						</p>
					) : null}
				</div>

				{href ? (
					<Link
						href={href}
						className="hidden text-sm font-medium text-blue-600 hover:text-blue-500 md:block"
					>
						Shop the collection <span aria-hidden="true">&rarr;</span>
					</Link>
				) : null}
			</div>

			<div className="relative">
				<div className="mt-6 flex items-center w-full">
					<div className="w-full grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-10 lg:gap-x-8">
						{map.map((product, i) => (
							<ProductListing
								key={`product-${i}`}
								product={product}
								index={i}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default ProductReel;
