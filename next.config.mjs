/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'preview.redd.it',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'ipfs.io',
				port: '',
				pathname: '/**',
			},
		],
	},
	
};

export default nextConfig;
