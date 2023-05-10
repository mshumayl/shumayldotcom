import Header from '../components/Header';
import Image from 'next/image';
import IndexMetaTags from '../components/IndexMetaTags';


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
            description: "AI-powered Quranic research tool.",
            link: "https://ai-daleel.com/",
            imageUrl: "/images/bing-ai.jpg"
        },
        {
            title: "AI-Daleel",
            description: "AI-powered Quranic research tool.",
            link: "https://ai-daleel.com/",
            imageUrl: "/images/bing-ai.jpg"
        }
    ];  

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
                <ul className="grid grid-cols-4 my-10 space-x-4">
                    {projects.map(p => {
                        return (
                        <li key={p.title} className="flex flex-col border border-gray-700 rounded-3xl px-6 py-4">
                            <span className="font-grotesk text-3xl">
                                {p.title}
                            </span>
                            <span className="font-grotesk text-md">
                                {p.description}
                            </span>
                            <span className="font-grotesk text-md shrink-0 w-full h-56 relative rounded-3xl">
                                <Image className='shrink-0 py-2 rounded-3xl object-cover' src={p.imageUrl} alt={p.title} fill></Image>
                            </span>
                        </li>)
                    })}
                </ul>
            </div>
        </div>
      </div>      
    </>
  )
}
