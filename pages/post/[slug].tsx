import { promises as fs } from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import Header from '../../components/Header'
import PostMetaTags from '../../components/PostMetaTags';
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
            <PostMetaTags title={title} excerpt={excerpt} slug={slug} domain="www.shumayl.com"/>
            <Header/>
            <div className='prose my-10 mx-auto'>
                <h1 className="font-grotesk font-extralight text-gray-50">{title}</h1>
                <div className="font-grotesk text-sm tracking-wider text-gray-50">{date}</div>
                <div className="font-grotesk text-gray-300 [&>p>a]:text-gray-100 leading-loose
                 [&>ul>li>a]:text-gray-100 [&>h2]:text-gray-100 [&>h3]:text-gray-200 [&>h4]:text-gray-200 
                 [&>p>code]:text-gray-100 [&>p>code]:bg-gray-700 [&>p>code]:rounded-md [&>p>code]:p-0.5 [&>p>code]:m-0.5 [&>p>code]:text-xs
                 [&>p>em]:flex [&>p>em]:justify-center [&>p>em]:text-gray-400 [&>p>em]:text-sm 
                 [&>p>img]:flex [&>p>img]:mx-auto [&>p>img]:border-2 [&>p>img]:border-gray-700 [&>p>img]:rounded-xl
                 [&>pre]:m-auto [&>pre]:border-2 [&>pre]:border-gray-700 
                 [&>ol>li>code]:text-gray-100 [&>ol>li>code]:bg-gray-700 [&>ol>li>code]:rounded-md [&>ol>li>code]:p-0.5 [&>ol>li>code]:m-0.5 [&>ol>li>code]:text-xs
                 " dangerouslySetInnerHTML={{ __html: md().render(content) }}/>
                <div>
                    <ReturnHomeButton/>
                </div>
            </div>
        </>
    );
}