import { buildConfig } from "payload/config";

export default buildConfig({
	serverURL: process.env.NEXT_PUBLIC_SERVER || "",
	collections: [],
	routes: {
		admin: "/sell",
   },
   admin:
});
