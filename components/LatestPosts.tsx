import Link from 'next/link';
import Card from '../components/Card';
import { useState, useEffect } from 'react';

interface Posts {
    slug: string;
    frontmatter: { [key: string]: any }
}
  

function filterPostsByTags(posts: Posts[], selectedTags = "") {
    console.log("In filterPostsByTags")
    console.log(selectedTags)
    return posts.filter((p) => p.frontmatter.tags[0].toLowerCase() == selectedTags); //modify indexing here to accept more than 1 tag
}


const LatestPosts: React.FC<{posts: Posts[]}> = ({ posts }) => {
    
    const [selectedTags, setSelectedTags] = useState("");
    const [filteredPosts, setFilteredPosts] = useState<Posts[]>([]);


    useEffect(() => {
        if (selectedTags === "") {
            console.log("No tags selected")
            setFilteredPosts(posts);
        } else {
            console.log("Filter by")
            console.log(selectedTags)
            setFilteredPosts(filterPostsByTags(posts, selectedTags));
        }
    }, [selectedTags, posts]);


    const handleTagClick = (tag: string) => {
        setSelectedTags(tag[0]);
        console.log(posts)
    }

    const isEmptyString = (data: string): boolean => typeof data === "string" && data.trim().length == 0;
    const latestPostSectionTitle = "Latest Posts";
    
    filteredPosts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
    

    return (
        <>
            <div className="my-20">
                <div className="font-grotesk font-extralight text-3xl mx-3 tracking-widest">{latestPostSectionTitle}</div>
                {!filteredPosts && 'No posts found.'}
                {filteredPosts.map(({ slug, frontmatter }) => (
                    <Card key={slug} slug={slug} frontmatter={frontmatter} handleTagClick={handleTagClick}/>
                ))}
            </div>
        </>
    )
}

export default LatestPosts;