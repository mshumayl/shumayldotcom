import Link from 'next/link';
import Card from '../components/Card';


interface Posts {
    slug: string;
    frontmatter: { [key: string]: any }
  }
  

function filterPostsByTags(posts: Posts[], selectedTags = "") {
    return posts.filter((p) => p.frontmatter.tags[0].toLowerCase() == selectedTags.toLowerCase); //modify indexing here to accept more than 1 tag
}


const LatestPosts: React.FC<{posts: Posts[], selectedTags: string}> = ({ posts, selectedTags }) => {
    

    const isEmptyString = (data: string): boolean => typeof data === "string" && data.trim().length == 0;
    const latestPostSectionTitle = "Latest Posts";
    
    posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
    
    if (!isEmptyString(selectedTags)) {
        posts = filterPostsByTags(posts, selectedTags);
    }

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