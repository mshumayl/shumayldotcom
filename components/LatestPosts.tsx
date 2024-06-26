import Link from 'next/link';
import Card from '../components/Card';
import TagSelector from '../components/TagSelector';
import { useState, useEffect } from 'react';
import PageSelector from './PageSelector';
import Breakline from './Breakline';

interface LatestPostsProps {
    slug: string;
    frontmatter: { [key: string]: any }
}

function filterPostsByTags(posts: LatestPostsProps[], selectedTags = "") {
    // console.log(selectedTags)
    return posts.filter((p) => p.frontmatter.tags.includes(selectedTags)); //modify indexing here to accept more than 1 tag
}

function paginatePosts(posts: LatestPostsProps[], currentPage: number, pageCount: number, pageSize: number = 3) {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return posts.slice(startIdx, endIdx)
}

const LatestPosts: React.FC<{posts: LatestPostsProps[]}> = ({ posts }) => {
    
    const [selectedTags, setSelectedTags] = useState("");
    const [filteredPosts, setFilteredPosts] = useState<LatestPostsProps[]>([]);
    const [paginatedPosts, setPaginatedPosts] = useState<LatestPostsProps[]>([]);
    const [pageCount, setPageCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3
    
    useEffect(() => {
        if (selectedTags === "" || selectedTags === "all") {
            setFilteredPosts(posts);
        } else {
            setFilteredPosts(filterPostsByTags(posts, selectedTags));
        }
    }, [selectedTags, posts]);

    useEffect(() => {
        if (filteredPosts.length > 0) {
            filteredPosts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
            setPageCount(Math.ceil(filteredPosts.length/pageSize))
            setPaginatedPosts(paginatePosts(filteredPosts, currentPage, pageCount))   
        }
    }, [filteredPosts, currentPage, pageSize, pageCount]);

    const handleTagClick = (tag: string) => {
        setSelectedTags(tag); 
        setCurrentPage(1);
    }

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    }

    const latestPostSectionTitle = "Latest Posts";

    const tags = posts.map(({frontmatter}) => {
        const tagsArr = [...frontmatter.tags]
        return tagsArr
    })
    
    const flatTags = tags.flat()

    flatTags.unshift("all");
    const uniqueTags = [...new Set(flatTags)];

    return (
        <>
            <div className="my-20">
                <div className="mx-3">
                    <div className="font-grotesk text-3xl font-extralight tracking-widest">{latestPostSectionTitle}</div>
                    <TagSelector tags={uniqueTags} handleTagClick={handleTagClick}/>
                    <PageSelector currentPage={currentPage} pageRange={pageCount} handlePageClick={handlePageClick}/>
                </div>
                {!paginatedPosts && 'No posts found.'}
                {paginatedPosts.map(({ slug, frontmatter }, idx) => (
                    <div className="w-full" key={`${idx}-${slug}`}>
                        {(idx===0) && (
                            <div className="-my-6 mt-10">
                                {/* <Breakline/> */}
                            </div>
                        )}
                        <Card slug={slug} frontmatter={frontmatter} handleTagClick={handleTagClick}/>
                        <div className="-my-6">
                            {/* <Breakline/> */}
                        </div>
                    </div>
                ))}
                <div className="mt-10">
                    <PageSelector currentPage={currentPage} pageRange={pageCount} handlePageClick={handlePageClick}/>
                </div> 
            </div>
        </>
    )
}

export default LatestPosts;