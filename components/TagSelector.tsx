import Link from 'next/link';
import Tags from './Tags';

interface TagSelectorProps {
    handleTagClick: (tag: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({handleTagClick}: TagSelectorProps) => {
    
    const temp = ["oss"]

    return (
        <>
            <div className="flex flex-row mt-5 mb-0 font-grotesk md:tracking-widest">
                <ul className="flex space-x-2 md:space-x-4 items-center list-none">
                    <div>
                        Tags:
                    </div>
                    <Tags tag={["all"]} onClick={handleTagClick}/>
                    <Tags tag={temp} onClick={handleTagClick}/>
                    <Tags tag={temp} onClick={handleTagClick}/>
                </ul>
            </div>
        </>
    )
}

export default TagSelector;