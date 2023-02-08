import Link from 'next/link';

interface TagsProps {
    tag: string[];
    onClick: (tag: string[]) => void;
}

const Tags: React.FC<TagsProps> = ({ tag, onClick }: TagsProps) => {

    return (
        <>
            <div className="text-xs tracking-wider my-1 mx-1 px-2 py-1 flex flex-row bg-slate-700 rounded-full w-max">
                <button onClick={() => onClick(tag)}>
                    { tag }
                </button>
            </div>
        </>
    )
}

export default Tags;