import Head from 'next/head';

const IndexMetaTags: React.FC = () => {
    
    const excerpt = "Notes on software and tech.";
    const title = "Shumayl.com";
    const domain = "www.shumayl.com"

    return (
        <>
            <Head>
                <title>{title}</title>

                <meta property="og:image" content={`https://${domain}/api/ogIndex?title=${title}`}></meta>
                <meta name="description" content={excerpt}></meta>

                <meta property="og:url" content={`https://${domain}`}></meta>
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content={title}></meta>
                <meta property="og:description" content={excerpt}></meta>
                <meta property="og:image" content={`https://${domain}/api/ogIndex?title=${title}`}></meta>

                <meta name="twitter:card" content="summary_large_image"></meta>
                <meta property="twitter:domain" content={domain}></meta>
                <meta property="twitter:url" content={`https://${domain}`}></meta>
                <meta name="twitter:title" content={title}></meta>
                <meta name="twitter:description" content={excerpt}></meta>
                <meta name="twitter:image" content={`https://${domain}/api/ogIndex?title=${title}`}></meta>
            </Head>
        </>
    )
}

export default IndexMetaTags;