import Link from 'next/link';

interface Posts {
    slug: string;
    frontmatter: { [key: string]: any }
  }
  

const LatestPosts: React.FC<{posts: Posts[]}> = ({ posts }) => {
    
    return (
        <>
            <div className="">
                {!posts && 'No posts found.'}
                {posts.map(({ slug, frontmatter }) => (
                    <div key={slug}>{slug}</div>
                ))}
            </div>
        </>
    )
}

export default LatestPosts;