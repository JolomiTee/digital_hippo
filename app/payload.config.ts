import dotenv from "dotenv";
import path from "path";

dotenv.config({
	path: path.resolve(__dirname, "../.env"),
});

import { Users } from "../lib/collections/Users";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { slateEditor } from "@payloadcms/richtext-slate";
import { buildConfig } from "payload/config";
import { Products } from "../lib/collections/Products/Products";
import { Media } from "../lib/collections/Media";
import { ProductFiles } from "../lib/collections/ProductFiles";
import { Orders } from "../lib/collections/Orders";

export default buildConfig({
	serverURL: process.env.NEXT_PUBLIC_SERVER_URL || "",
	collections: [Users, Products, Media, ProductFiles, Orders],
	routes: {
		admin: "/sell",
	},
	admin: {
		user: "users",
		bundler: webpackBundler(),
		meta: {
			titleSuffix: "- DigitalHippo",
			favicon: "/favicon.ico",
			ogImage: "/thumbnail.jpg",
		},
	},
	rateLimit: {
		max: 2000,
	},
	editor: slateEditor({}),
	db: mongooseAdapter({
		url: process.env.MONGDB_URL!,
	}),
	typescript: {
		outputFile: path.resolve(__dirname, "payload-types.ts"),
	},
});
