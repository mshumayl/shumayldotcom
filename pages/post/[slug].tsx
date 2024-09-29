import { promises as fs } from 'fs';
import matter from 'gray-matter';
import Header from '../../components/Header'
import PostMetaTags from '../../components/PostMetaTags';
import ReturnHomeButton from '../../components/ReturnHomeButton';
import rehypeDocument from 'rehype-document';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkSlug from 'remark-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { unified } from 'unified';
import rehypeToc from 'rehype-toc';
import PostDisclaimer from '../../components/PostDisclaimer';

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

    const processor = unified()
        .use(remarkParse)
        .use(remarkSlug)
        .use(remarkRehype)
        .use(rehypeAutolinkHeadings)
        .use(rehypeToc, {
            customizeTOC: (tocTree) => {
                const modifyTree = (node: any) => {
                    if (node.tagName === 'ol') {
                      node.tagName = 'ul';
                    }
                    if (node.children) {
                      node.children.forEach(modifyTree);
                    }
                  };
                  modifyTree(tocTree);
                  return tocTree;
              },
        })
        .use(rehypeDocument, {title: slug})
        .use(rehypeStringify);

    const htmlContent = await processor.process(content)

    const htmlString = htmlContent.toString()

    return { 
        props: {
            frontmatter,
            content: htmlString,
            slug
        }
     };
}


export default function PostPage({ frontmatter, content, slug }: { frontmatter: any, content: any, slug: string }) {
    const { title, date, excerpt } = frontmatter;
    
    return (
        <>
            <PostMetaTags title={title} excerpt={excerpt} slug={slug} domain="www.shumayl.site"/>
            <Header/>
            <div className='prose md:prose-lg my-10 mx-auto'>
                <h1 className="font-grotesk font-extralight text-gray-50">{title}</h1>
                <div className="font-grotesk text-sm tracking-wider text-gray-50">{date}</div>
                <div className="font-hubot text-gray-300 [&>p>a]:text-gray-100 leading-loose
                 [&>ul>li>a]:text-gray-100 [&>h2]:text-gray-100 [&>h3]:text-gray-200 [&>h4]:text-gray-200 
                 [&>p>code]:text-gray-100 [&>p>code]:bg-gray-700 [&>p>code]:rounded-md 
                 [&>p>code]:p-0.5 [&>p>code]:m-0.5 [&>p>code]:text-xs [&>p>code]:font-grotesk [&>p>code]:tracking-wider
                 [&>pre>code]:font-grotesk
                 [&>p>em]:flex [&>p>em]:justify-center [&>p>em]:text-gray-400 [&>p>em]:text-sm 
                 [&>p>img]:flex [&>p>img]:mx-auto  [&>p>img]:rounded-xl
                 [&>pre]:m-auto 
                 [&>nav]:rounded-md [&>nav]:mt-6 [&>nav]:px-8 [&>nav]:py-6 
                 [&>nav]:bg-slate-800
                 [&>nav]:before:content-['Table_of_Contents']
                 [&>ol>li>code]:text-gray-100 [&>ol>li>code]:bg-gray-700 [&>ol>li>code]:rounded-md [&>ol>li>code]:p-0.5 [&>ol>li>code]:m-0.5 [&>ol>li>code]:text-xs
                 [&>ul>li>code]:text-gray-100 [&>ul>li>code]:bg-gray-700 [&>ul>li>code]:rounded-md [&>ul>li>code]:p-0.5 [&>ul>li>code]:m-0.5 [&>ul>li>code]:text-xs
                 [&>ol>li>ul>li>code]:text-gray-100 [&>ol>li>ul>li>code]:bg-gray-700 [&>ol>li>ul>li>code]:rounded-md [&>ol>li>ul>li>code]:p-0.5 [&>ol>li>ul>li>code]:m-0.5 [&>ol>li>ul>li>code]:text-xs
                 [&>ul>li>em>code]:text-gray-100 [&>ul>li>em>code]:bg-gray-700 [&>ul>li>em>code]:rounded-md [&>ul>li>em>code]:p-0.5 [&>ul>li>em>code]:m-0.5 [&>ul>li>em>code]:text-xs
                 [&>p>a>code]:text-gray-100 [&>p>a>code]:bg-gray-700 [&>p>a>code]:rounded-md [&>p>a>code]:p-0.5 [&>p>a>code]:m-0.5 [&>p>a>code]:text-xs
                 " dangerouslySetInnerHTML={{ __html: content }}/>
                <PostDisclaimer/>
                <div>
                    <ReturnHomeButton/>
                </div>
            </div>
        </>
    );
}