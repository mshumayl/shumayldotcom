import Link from 'next/link';

const TagSelector: React.FC = () => {
    
    return (
        <>
            <div className="flex flex-row font-grotesk md:tracking-widest">
                <ul className="flex space-x-2 md:space-x-6 list-none">
                    <Link href="/">Tag1</Link>
                    <Link href="/">Tag2</Link>
                    <Link href="/">Tag3</Link>
                </ul>
            </div>
        </>
    )
}

export default TagSelector;