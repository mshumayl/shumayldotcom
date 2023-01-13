import Link from 'next/link';
import { ReactNode } from 'react';
import Navbar from './Navbar';

const Header: React.FC = () => {
    
    return (
        <>
            <div className="flex flex-row items-center">
                <Link href="/" className="flex font-grotesk font-bold text-2xl basis-1/6">Shumayl.com</Link>
                <div className="flex basis-5/6 shrink justify-end">
                    <Navbar/>
                </div>
            </div>
        </>
    )
}

export default Header;