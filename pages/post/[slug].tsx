import { promises as fs } from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import Header from '../../components/Header'
import ReturnHomeButton from '../../components/ReturnHomeButton';

export async function getStaticPaths() {
    const files = await fs.readdir('posts');

    const paths = files.map((fileName: string) => {
        return {
            params: { 
                slug: fileName.replace('.md', '')
            }
        }; 
    });
    return { paths, fallback: false }
}

export async function getStaticProps({ params: { slug } }: { params: { slug: string } }) {
    const file = await fs.readFile(`posts/${slug}.md`);
    const { data: frontmatter, content } = matter(file);

    console.log(content);

    return { 
        props: {
            frontmatter,
            content,
            slug
        }
     };
}


export default function PostPage({ frontmatter, content, slug }: { frontmatter: any, content: any, slug: string }) {
    const { title, date, excerpt } = frontmatter;
    
    return (
        <>
            <head>
                <title>{title}</title>
                <meta property="og:image" content={`https://www.shumayl.com/api/og?title=${title}`}></meta>
                <meta name="description" content={`${excerpt}`}></meta>

                <meta property="og:url" content={`https://www.shumayl.com/pages/${slug}`}></meta>
                <meta property="og:type" content="website"></meta>
                <meta property="og:title" content={`${title}`}></meta>
                <meta property="og:description" content={`${excerpt}`}></meta>
                <meta property="og:image" content={`https://www.shumayl.com/api/og?title=${title}`}></meta>

                <meta name="twitter:card" content="summary_large_image"></meta>
                <meta property="twitter:domain" content="shumayl.com"></meta>
                <meta property="twitter:url" content={`https://www.shumayl.com/pages/${slug}`}></meta>
                <meta name="twitter:title" content={`${title}`}></meta>
                <meta name="twitter:description" content={`${excerpt}`}></meta>
                <meta name="twitter:image" content={`https://www.shumayl.com/api/og?title=${title}`}></meta>
            </head>
            <Header/>
            <div className='prose my-10 mx-auto'>
                <h1 className="font-grotesk font-extralight text-gray-50">{title}</h1>
                <div className="font-grotesk text-sm tracking-wider text-gray-50">{date}</div>
                <div className="font-grotesk text-gray-300 [&>p>a]:text-gray-100 leading-loose [&>ul>li>a]:text-gray-100 [&>h2]:text-gray-100 [&>p>code]:text-gray-100 [&>p>code]:bg-gray-700 [&>p>em]:flex [&>p>em]:justify-center [&>p>img]:flex [&>p>img]:justify-center" dangerouslySetInnerHTML={{ __html: md().render(content) }}/>
                <div>
                    <ReturnHomeButton/>
                </div>
            </div>
        </>
    );
}