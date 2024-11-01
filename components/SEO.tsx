import Head from 'next/head'

interface SEOProps {
    title: string
    description: string
    image?: string
    url?: string
}

export function SEO({ title, description, image, url }: SEOProps) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com'
    const fullUrl = url ? `${siteUrl}${url}` : siteUrl
    const defaultImage = `${siteUrl}/og-image.png`

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image || defaultImage} />
            <meta property="og:url" content={fullUrl} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image || defaultImage} />
        </Head>
    )
}