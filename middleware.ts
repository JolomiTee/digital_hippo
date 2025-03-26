import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

export async function middleware(req: NextRequest) {
	try {
		console.log("Middleware running...");
		const { nextUrl, cookies } = req;

		const { user } = await getServerSideUser(cookies);
		console.log("User:", user);
		console.log("Next URL:", nextUrl.pathname);

		if (user && ["/sign-in", "/sign-up"].includes(nextUrl.pathname)) {
			console.log("Redirecting to home...");
			return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
		}

		return NextResponse.next();
	} catch (error) {
		console.error("Middleware Error:", error);
		return NextResponse.next(); // Prevent crashing the app
	}
}
