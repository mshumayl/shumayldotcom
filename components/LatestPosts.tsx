import Link from 'next/link';
import Card from '../components/Card';


interface Posts {
    slug: string;
    frontmatter: { [key: string]: any }
  }
  

const LatestPosts: React.FC<{posts: Posts[]}> = ({ posts }) => {
    
    const latestPostSectionTitle = "Latest Posts";
    
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

    return (
        <>
            <div className="my-20">
                <div className="font-grotesk font-extralight text-3xl mx-3 tracking-widest">{latestPostSectionTitle}</div>
                {!posts && 'No posts found.'}
                {posts.map(({ slug, frontmatter }) => (
                    <Card key={slug} slug={slug} frontmatter={frontmatter}/>
                ))}
            </div>
        </>
    )
}

export default LatestPosts;