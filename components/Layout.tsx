import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const Layout: React.FC<Props> = ({children}) => {
    
    return (
        <>
            <div className="p-4 md:p-10 w-full bg-blue-500">
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}

export default Layout;