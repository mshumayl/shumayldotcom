import Link from 'next/link';

const ReturnHomeButton: React.FC = () => {
    
    return (
        <>
            <div className="flex flex-row ">
                <div>
                    <Link className="text-gray-50" href="/">Back</Link>    
                </div>
            </div>
        </>
    )
}

export default ReturnHomeButton;