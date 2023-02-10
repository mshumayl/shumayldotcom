import Link from 'next/link';
import Tags from './Tags';

interface TagSelectorProps {
    handleTagClick: (tag: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({handleTagClick}: TagSelectorProps) => {
    
    const temp = [["all"], ["oss"], ["machine-learning"], ["web-dev"]]

    return (
        <>
            <div className="flex flex-row mt-5 mb-0 font-grotesk md:tracking-widest">
                <ul className="flex space-x-2 md:space-x-4 items-center list-none">
                    <div>
                        Tags:
                    </div>
                    {temp.map((t) => (
                        <Tags tag={t} onClick={handleTagClick}/>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default TagSelector;