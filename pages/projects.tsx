import Header from '../components/Header';
import Image from 'next/image';
import IndexMetaTags from '../components/IndexMetaTags';
import Link from 'next/link';

interface Project {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
}


export async function getStaticProps(): Promise<{ props: { projects: Project[] } }> {
  const projects = [
        {
            title: "AI-Daleel",
            description: "AI-powered al-Quran research tool. Uses generative AI technology to provide relevant Quran verses based on rough transliterations, plain language keywords, and semantic relevance. I also wrote a <a href='/post/aidaleel-architecture'>deep dive on the systems architecture</a>.",
            imageUrl: "/images/my-life-through-a-lens-bq31L0jQAjU-unsplash.jpg",
            link: "https://www.ai-daleel.com/",
            status: "LIVE",
        },
  ]

  return {props: {projects}};
};


export default function Projects({ projects }: { projects: Project[] }) {

  return (
    <>
      <IndexMetaTags/>
      <div>
        <Header/>
        <div className="my-20">
            <div className="mx-3">
                <div className="font-grotesk text-3xl font-extralight tracking-widest">Projects</div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 my-10 gap-8">
                    {projects.map(p => {
                        return (
                            <a key={p.title} className="flex flex-col border border-gray-700 hover:border-gray-600 rounded-3xl">
                                <li className="flex flex-col  p-4 h-full w-full">
                                    <div className="font-grotesk text-md shrink-0 w-full h-56 relative rounded-xl overflow-hidden mb-4">
                                        <Image className='shrink-0 object-cover' src={p.imageUrl} alt={p.title} fill></Image>
                                    </div>
                                    <div className="font-grotesk text-3xl mb-2">
                                        {p.title}
                                    </div>
                                    <div className="font-grotesk text-md mb-2 [&>a]:underline [&>a]:underline-offset-4 [&>a]:after:content-['_↗']" dangerouslySetInnerHTML={{ __html: p.description }}></div>
                                </li>
                            </a>
                        )
                    })}
                </ul>
            </div>
        </div>
      </div>      
    </>
  )
}
