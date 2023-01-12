import Link from 'next/link';
import { ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

const Layout: React.FC<Props> = ({children}) => {
    
    return (
        <>
            <div className="container flex flex-col m-12">
                <main>
                    {children}
                </main>
            </div>
        </>
    )
}

export default Layout;