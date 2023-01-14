import Link from 'next/link';

const ReturnHomeButton: React.FC = () => {
    
    return (
        <>
            <div className="flex flex-row bg-teal-500">
                <div>
                    <Link href="/">Back</Link>    
                </div>
            </div>
        </>
    )
}

export default ReturnHomeButton;