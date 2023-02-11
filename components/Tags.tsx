import Link from 'next/link';

interface TagsProps {
    key?: number; //optional, only for mapped tags
    tag: string[];
    onClick: (tag: string[]) => void;
}

const Tags: React.FC<TagsProps> = ({ tag, onClick }: TagsProps) => {

    console.log(tag)

    return (
        <>
            <div className="">
                <button className="flex flex-row text-xs tracking-wider my-1 mx-1 items-center px-2 py-1 rounded-lg w-max
             bg-slate-700 hover:bg-slate-600 focus:bg-slate-500" 
             onClick={() => onClick(tag)}>
                    { tag }
                </button>
            </div>
        </>
    )
}

export default Tags;