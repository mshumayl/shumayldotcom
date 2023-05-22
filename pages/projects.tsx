import Header from '../components/Header';
import Image from 'next/image';
import IndexMetaTags from '../components/IndexMetaTags';
import Link from 'next/link';
import React from 'react';

interface Project {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}

export default function Projects({ projects }: { projects: Project[] }) {

  return (
    <>
      <IndexMetaTags/>
      <div>
        <Header/>
        <div className="my-20">
            <div className="mx-3">
                <div className="font-grotesk text-3xl font-extralight tracking-widest">Public Projects</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 my-10 gap-8">
                    <a className="flex flex-col border border-gray-700  rounded-3xl text-slate-300">
                        <li className="flex flex-col  p-4 h-full w-full">
                            <div className="font-grotesk text-md shrink-0 w-full h-56 relative rounded-xl overflow-hidden mb-4">
                                <Image className='shrink-0 object-cover' src={`/images/ai-daleel-landing-page.jpg`} alt={`AI-Daleel`} fill></Image>
                            </div>
                            <div className="font-grotesk text-3xl mb-2">
                                {`AI-Daleel`}
                            </div>
                            <div className="leading-relaxed font-grotesk text-md mb-2">
                              <span>
                                <p>Full-stack web app with generative AI technology to provide relevant Quran verses based on rough transliterations, plain language keywords, and semantic relevance.</p>
                                <p className="mt-4">I also published a <Link className="underline underline-offset-2 after:content-['_↗']" href='/post/aidaleel-architecture'>technical article on the systems architecture</Link>.</p></span>
                            </div>
                            <Link href="https://www.ai-daleel.com/" className="flex bg-slate-700 h-8 w-full items-center justify-center font-grotesk rounded-xl mt-4 hover:bg-slate-600">Live site</Link>
                        </li>
                    </a>
                </ul>
            </div>
        </div>
      </div>      
    </>
  )
}
