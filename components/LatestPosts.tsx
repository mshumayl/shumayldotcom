import Link from 'next/link';
import Card from '../components/Card';


interface Posts {
    slug: string;
    frontmatter: { [key: string]: any }
  }
  

const LatestPosts: React.FC<{posts: Posts[]}> = ({ posts }) => {
    
    return (
        <>
            <div className="my-20 bg-yellow-500">
                {!posts && 'No posts found.'}
                {posts.map(({ slug, frontmatter }) => (
                    <Card slug={slug} frontmatter={frontmatter}/>
                ))}
            </div>
        </>
    )
}

export default LatestPosts;