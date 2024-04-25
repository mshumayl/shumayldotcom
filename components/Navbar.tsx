import Link from 'next/link';

const Navbar: React.FC = () => {
    
    return (
        <>
            <div className="flex flex-row font-grotesk text-xs md:text-lg tracking-tighter md:tracking-widest">
                <ul className="flex space-x-2 md:space-x-6 list-none">
                    <Link href="/" className="">Blog</Link>
                    <Link href="/about">About</Link>
                    {/* <Link href="/projects">Projects</Link> */}
                </ul>
            </div>
        </>
    )
}

export default Navbar;