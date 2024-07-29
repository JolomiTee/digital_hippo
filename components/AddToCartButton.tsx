"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useCart } from "@/hooks/use-cart";
import { Product } from "@/app/payload-types";

const AddToCartButton = ({ product }: { product: Product }) => {
	const { addItem } = useCart();
	const [isSuccess, setIsSuccess] = useState<boolean>(false);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setIsSuccess(false);
		}, 2000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<Button
			size={"lg"}
			className="w-full"
			onClick={() => {
				addItem(product);
				setIsSuccess(true);
			}}
		>
			{isSuccess ? "Added" : "Add to cart"}
		</Button>
	);
};

export default AddToCartButton;
