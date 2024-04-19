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
            <div className="justify-items-center w-full my-10 min-h-fit rounded-3xl">
                <div className="justify-items-center flex md:flex-row flex-col h-full border border-gray-700 rounded-3xl">
                    <Link href={`/post/${slug}`} className="shrink-0 w-full md:w-64 h-56 md:h-48 relative rounded-3xl">
                        <Image className='shrink-0 p-2 rounded-3xl object-cover' src={image} alt={title} fill></Image>
                    </Link>
                    <div className="shrink my-2 md:my-4 mx-5 md:mx-2 flex flex-col">
                        <Link href={`/post/${slug}`} className="mx-2 font-grotesk text-2xl font-black">{title}</Link>
                        <div className="mx-2 font-grotesk text-sm tracking-wider text-gray-100">{date}</div>
                        {/* Map tags here */}
                        <div className="flex flex-row">
                            {tags.map((t: string, idx: number) => (
                                <Tags key={idx} tags={t} onClick={handleTagClick} />
                            ))}
                        </div>
                        <div className="mx-2 font-grotesk text-gray-100 pb-2">{excerpt}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card;