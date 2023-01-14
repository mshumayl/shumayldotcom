import Link from 'next/link';

const Tags: React.FC<{ tag: string }> = ({ tag }) => {
    
    return (
        <>
            <div className="text-sm px-3 py-1 flex flex-row bg-slate-700 rounded-full w-max">
                { tag }
            </div>
        </>
    )
}

export default Tags;