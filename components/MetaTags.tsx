import Head from 'next/head';
import Card from '../components/Card';


interface Posts {
    slug: string;
    frontmatter: { [key: string]: any }
}
  

const MetaTags: React.FC<{title: string, excerpt: string, slug:string, domain: string}> = ({ title, excerpt, slug, domain }) => {
    
    return (
        <>
            <Head>
                <title>{title}</title>

                <meta property="og:image" content={`https://${domain}/api/og?title=${title}`}></meta>
                <meta name="description" content={excerpt}></meta>

                <meta property="og:url" content={`https://${domain}/pages/${slug}`}></meta>
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content={title}></meta>
                <meta property="og:description" content={excerpt}></meta>
                <meta property="og:image" content={`https://${domain}/api/og?title=${title}`}></meta>

                <meta name="twitter:card" content="summary_large_image"></meta>
                <meta property="twitter:domain" content={domain}></meta>
                <meta property="twitter:url" content={`https://${domain}/pages/${slug}`}></meta>
                <meta name="twitter:title" content={title}></meta>
                <meta name="twitter:description" content={excerpt}></meta>
                <meta name="twitter:image" content={`https://${domain}/api/og?title=${title}`}></meta>
            </Head>
        </>
    )
}

export default MetaTags;