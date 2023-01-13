import { promises as fs } from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import Header from '../../components/Header'

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
        }
     };
}


export default function PostPage({ frontmatter, content }: { frontmatter: any, content: any }) {
    const { title, tag } = frontmatter;
    
    return (
        <>
            <Header/>
            <div className='prose my-10 mx-auto'>
                <h1 className="font-grotesk font-extrabold">{title}</h1>
                <div className="font=grotesk" dangerouslySetInnerHTML={{ __html: md().render(content) }}/>
            </div>
        </>
    );
}