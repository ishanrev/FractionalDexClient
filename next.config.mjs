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
	env: {
		SUPABASE_PROJECT_URL: 'https://bjjabpcpawelwqlsrioi.supabase.co',
		SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqamFicGNwYXdlbHdxbHNyaW9pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjExNTc3NDQsImV4cCI6MjAzNjczMzc0NH0.LFAaunA42Caw-4a_0i1pF3Wg2BAW-sAMHiBq15V0OiA'
	}
};

export default nextConfig;
