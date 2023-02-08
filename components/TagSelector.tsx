import Link from 'next/link';
import Tags from './Tags';

interface TagSelectorProps {
    handleTagClick: (tag: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({handleTagClick}: TagSelectorProps) => {
    
    const temp = ["oss"]

    return (
        <>
            <div className="flex flex-row font-grotesk md:tracking-widest">
                <ul className="flex space-x-2 md:space-x-6 list-none">
                    <Tags tag={temp} onClick={handleTagClick}/>
                </ul>
            </div>
        </>
    )
}

export default TagSelector;