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
                <ul className="flex space-x-1 md:space-x-2 sm:items-center list-none">
                    <div>
                        Tags:
                    </div>
                    <div className="flex flex-row flex-wrap md:space-x-2">
                        {temp.map((t, index) => (
                            <Tags key={index} tag={t} onClick={handleTagClick}/>
                        ))}
                    </div>
                </ul>
            </div>
        </>
    )
}

export default TagSelector;