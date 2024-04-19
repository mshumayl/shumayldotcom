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
            <div className="flex flex-row mt-5 mb-0 font-grotesk md:tracking-widest">
                <ul className="flex space-x-1 list-none">
                    <div>
                        Pages:
                    </div>
                    <button className="flex flex-row flex-wrap">
                        {pages.map((val) => (
                            <div onClick={() => handlePageClick(val)}  className="px-2" key={val}>{val}</div>
                        ))}     
                    </button>
                </ul>
            </div>
        </>
    )
}

export default PageSelector;