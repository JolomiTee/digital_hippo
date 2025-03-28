/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "digital-hippo-pearl.vercel.app",
				pathname: "**",
			},
			{
				protocol: "https",
				hostname: "digital-hippo.payloadcms.app",
				pathname: "**",
			},
		],
	},
};

export default nextConfig;
