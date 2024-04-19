import Link from 'next/link';
import Image from 'next/image';
import path from 'path';
import Tags from './Tags';

interface PageSelectorProps {
    currentPage: number;
    pageRange: number;
    handlePageClick: (page: number) => void;
}

const PageSelector: React.FC<PageSelectorProps> = ({currentPage, pageRange, handlePageClick}: PageSelectorProps) => {
    const pages = Array.from({ length: pageRange }, (_, index) => index+1);
    return (
        <>
            <div className="justify-end flex flex-row mt-5 mb-0 font-grotesk md:tracking-widest">
                <ul className="flex space-x-1 list-none">
                    <button className="focus:text-slate-500" onClick={() => handlePageClick(1)}>{"<<"}</button>
                    <div className="flex flex-row flex-wrap">
                        {pages.map((val) => (
                            (currentPage === val) ?
                            (<button onClick={() => handlePageClick(val)}  className="underline underline-offset-4 px-2" key={val}>{val}</button>) :
                            (<button onClick={() => handlePageClick(val)}  className="focus:text-slate-500 px-2" key={val}>{val}</button>)
                        ))}     
                    </div>
                    <button className="focus:text-slate-500" onClick={() => handlePageClick(pageRange)}>{">>"}</button>
                </ul>
            </div>
        </>
    )
}

export default PageSelector;