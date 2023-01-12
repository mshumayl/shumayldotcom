import Link from 'next/link';

const Navbar: React.FC = () => {
    
    return (
        <>
            <div className="container flex flex-row">
                <ul className="flex space-x-6 list-none">
                    <li>Blog</li>
                    <li>About</li>
                    <li>Other</li>
                </ul>
            </div>
        </>
    )
}

export default Navbar;