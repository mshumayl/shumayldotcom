import Link from 'next/link';
import Image from 'next/image';
import path from 'path';
import Tags from './Tags';

interface PostSnippet {
    slug: string,
    frontmatter: { [key: string]: any; },
}

const Card: React.FC<PostSnippet> = ({slug, frontmatter}) => {
    
    const { title, image, excerpt, tags } = frontmatter;

    return (
        <>
            <div className="justify-items-center w-full my-10 h-80 md:h-40 rounded-3xl">
                <div className="justify-items-center flex md:flex-row flex-col h-full border border-gray-700 rounded-3xl">
                    <Link href={`/post/${slug}`} className="shrink-0 w-full md:w-64 h-1/2 md:h-full relative rounded-3xl">
                        <Image className='shrink-0 p-2 rounded-3xl object-cover' src={image} alt={title} fill></Image>
                    </Link>
                    <div className="shrink my-2 space-y-1 md:my-3 mx-5 md:mx-10 flex flex-col">
                        <Link href={`/post/${slug}`} className="font-grotesk text-2xl font-black">{title}</Link>
                        <Tags tag={tags}/>
                        <div className="font-grotesk">{excerpt}</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Card;