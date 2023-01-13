import { promises as fs } from 'fs';
import matter from 'gray-matter';

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
    const fileName = await fs.readFile(`posts/${slug}`);
    const { data: frontmatter, content } = matter(fileName);

    console.log(content);

    return { 
        props: {
            frontmatter,
            content,
        }
     };
}


export default function PostPage({ frontmatter, content }: { frontmatter: any, content: any }) {
    return (
        <>
            <div>
                
            </div>
        </>
    );
}