import Link from 'next/link';
import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    
    return (
        <>
            <div className="p-4 md:p-10 w-full bg-fixed min-h-screen text-white bg-gray-900 bg-[radial-gradient(#1f2937_1px,#111827_1px)] bg-[size:20px_20px]">
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}

export default Layout;