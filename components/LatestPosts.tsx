import Link from 'next/link';
import Card from '../components/Card';
import TagSelector from '../components/TagSelector';
import { useState, useEffect } from 'react';

interface LatestPostsProps {
    slug: string;
    frontmatter: { [key: string]: any }
}
  

function filterPostsByTags(posts: LatestPostsProps[], selectedTags = "") {
    // console.log(selectedTags)
    return posts.filter((p) => p.frontmatter.tags.includes(selectedTags)); //modify indexing here to accept more than 1 tag
}


const LatestPosts: React.FC<{posts: LatestPostsProps[]}> = ({ posts }) => {
    
    const [selectedTags, setSelectedTags] = useState("");
    const [filteredPosts, setFilteredPosts] = useState<LatestPostsProps[]>([]);


    useEffect(() => {
        if (selectedTags === "" || selectedTags === "all") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(filterPostsByTags(posts, selectedTags));
        }
    }, [selectedTags, posts]);


    const handleTagClick = (tag: string) => {
        setSelectedTags(tag); // TODO: Tags are currently arrays. Tweak this to support posts with multitags in the future. 
    }


    const isEmptyString = (data: string): boolean => typeof data === "string" && data.trim().length == 0;
    const latestPostSectionTitle = "Latest Posts";

    const tags = posts.map(({frontmatter}) => {
        const tagsArr = [...frontmatter.tags]
        return tagsArr
    })
    
    const flatTags = tags.flat()

    flatTags.unshift("all");
    const uniqueTags = [...new Set(flatTags)];

    filteredPosts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

    // console.log("tags:", tags);
    // console.log("uniqueTags:", uniqueTags);

    return (
        <>
            <div className="my-20">
                <div className="mx-3">
                    <div className="font-grotesk text-3xl font-extralight tracking-widest">{latestPostSectionTitle}</div>
                    <TagSelector tags={uniqueTags} handleTagClick={handleTagClick}/>
                </div>
                {!filteredPosts && 'No posts found.'}
                {filteredPosts.map(({ slug, frontmatter }) => (
                    <Card key={slug} slug={slug} frontmatter={frontmatter} handleTagClick={handleTagClick}/>
                ))}
            </div>
        </>
    )
}

export default LatestPosts;