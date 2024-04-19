import { promises as fs } from 'fs';
import matter from 'gray-matter';
import md from 'markdown-it';
import Head from 'next/head';
import Header from '../components/Header'
import IndexMetaTags from '../components/IndexMetaTags';
import ReturnHomeButton from '../components/ReturnHomeButton';


export async function getStaticProps() {
    const file = await fs.readFile(`content/about.md`);
    const { data: frontmatter, content } = matter(file);

    return { 
        props: {
            frontmatter,
            content,
        }
     };
}

export default function AboutPage({ frontmatter, content }: { frontmatter: any, content: any }) {
    const { title } = frontmatter;
    
    return (
        <>
            <IndexMetaTags/>
            <div>
                <Header/>
                <div className="prose my-10 mx-auto">
                    <h1 className="font-grotesk font-extralight text-gray-50">{title}</h1>
                    <div className="font-hubot text-gray-300 [&>p>a]:text-gray-100 leading-loose [&>ul>li>a]:text-gray-100" dangerouslySetInnerHTML={{ __html: md().render(content) }}/>
                    <div>
                        <ReturnHomeButton/>
                    </div>
                </div>
            </div>
        </>
    );
}