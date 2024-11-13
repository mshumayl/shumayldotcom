import Link from 'next/link';
import Image from 'next/image';
import path from 'path';
import Tags from './Tags';

interface CardProps {
    slug: string,
    frontmatter: { [key: string]: any; },
    handleTagClick: (tag: string) => void;
}

const Card: React.FC<CardProps> = ({slug, frontmatter, handleTagClick}: CardProps) => {
    
    const { title, image, excerpt, tags, date } = frontmatter;

    //Decompose tags here
    // console.log(tags)

    return (
        <>
            <div className="justify-items-center w-full my-10 min-h-fit rounded-lg">
            <div className="justify-items-center w-full flex md:flex-row flex-col h-full rounded-t-xl border-slate-800 border-l-2 border-t-2">
                    <Link href={`/post/${slug}`} className="shrink-0 w-full md:w-64 h-56 md:h-48 relative">
                        <Image className='shrink-0 p-2 rounded-xl object-cover' src={image} alt={title} fill></Image>
                    </Link>
                    <div className="shrink my-2 md:my-4 mx-5 md:mx-2 flex flex-col">
                        <Link href={`/post/${slug}`} className="mx-2 font-grotesk text-2xl align-middle hover:text-slate-300 transition-all">{title}</Link>
                        <div className="mx-2 font-grotesk text-sm tracking-wider text-gray-400 my-1">{date}</div>
                        {/* Map tags here */}
                        <div className="flex flex-row my-1">
                            {tags.map((t: string, idx: number) => (
                                <Tags key={idx} tags={t} onClick={handleTagClick} />
                            ))}
                        </div>
                        <div className="mx-2 my-2 font-grotesk text-gray-400 text-md">{excerpt}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card;