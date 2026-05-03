import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async redirects() {
    return [
      {
        // This Next.js instance serves the Q&A pages. The bare URL is shared
        // with students for the Q&A board, so redirect / to the student
        // /qa view rather than the quiz dashboard.
        source: '/',
        destination: '/qa',
        permanent: false,
      },
      {
        source: '/host',
        destination: '/host/qa',
        permanent: false,
      },
    ]
  },
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
})

export default withMDX(nextConfig)
