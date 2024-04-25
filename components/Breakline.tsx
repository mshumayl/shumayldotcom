import { useEffect, useState } from 'react';
import useScreenSize from './hooks/useScreenSize';

const Breakline: React.FC = () => {
    const screenSize = useScreenSize();
    const [numHashes, setNumHashes] = useState(1)

    useEffect(() => {
        setNumHashes(Math.floor(0.1*screenSize.width))
    }, [screenSize])

    return (
        <>
            <div className="flex flex-row font-mono -my-6 space-x-2 text-slate-700 text-sm text-center w-full items-center justify-center overflow-clip">
            {Array(numHashes).fill(null).map((_, index) => (
                // eslint-disable-next-line react/jsx-no-comment-textnodes
                <span key={index}>{"/"}</span>
            ))}    
            </div> 
        </>
    )
}

export default Breakline;