import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import Header from '../components/Header';
import LatestPosts from '../components/LatestPosts';

import { promises as fs } from 'fs';
import matter from 'gray-matter';
import IndexMetaTags from '../components/IndexMetaTags';


const inter = Inter({ subsets: ['latin'] })


interface Posts {
  slug: string;
  frontmatter: { [key: string]: any }
}


async function getPosts() {
  const files = await fs.readdir('posts')

  const getFiles = files.map((fileName: string) => {
    return fs.readFile(`posts/${fileName}`, 'utf-8');
  });

  const parseFiles = await Promise.all(getFiles);
  
  const posts = parseFiles.map((unparsedFile: string, index: number) => {
    const slug = files[index].replace('.md', '');
    const { data: frontmatter } = matter(unparsedFile);
  
    return { slug, frontmatter };
  });

  return posts;
}


export async function getStaticProps(): Promise<{ props: { posts: Posts[] } }> {
  const posts = await getPosts();  

  return {props: {posts}};
};


export default function Home({ posts }: { posts: Posts[] }) {
  
  return (
    <>
      <IndexMetaTags/>
      <div>
        <Header/>
        <LatestPosts posts={posts} />
      </div>      
    </>
  )
}
