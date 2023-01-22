import Link from 'next/link';
import { ReactNode } from 'react';
import Navbar from './Navbar';

const Header: React.FC = () => {
    
    return (
        <>
            <div className="flex flex-row items-center">
                <div className="flex font-grotesk font-bold text-2xl sm:basis-1/6">
                    <Link href="/" className="bg-white text-gray-900 px-2 py-1">Shumayl.com</Link>
                </div>
                <div className="flex basis-5/6 shrink justify-end">
                    <Navbar/>
                </div>
            </div>
        </>
    )
}

export default Header;