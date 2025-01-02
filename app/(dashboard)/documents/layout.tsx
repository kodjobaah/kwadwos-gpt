
interface ParallelLayoutProps {
    children: React.ReactNode;
    search: React.ReactNode;
    upload: React.ReactNode;
}

export default function Layout({ children, search, upload }: ParallelLayoutProps) {
    return (
        <>
        <div className="flex flex-row h-screen overflow-hidden">
            {/* Left Panel */}
            <div className="card bg-base-300 rounded-box flex-grow p-4 overflow-auto">
                <div className="h-full grid place-items-center">
                    {search}
                </div>
            </div>

            {/* Divider */}
            <div className="divider divider-vertical mx-2"></div>

            {/* Right Panel */}
            <div className="card bg-base-300 rounded-box flex-grow p-4 overflow-auto">
                <div className="h-full grid place-items-center">
                    {upload}
                </div>
            </div>
        </div>
        <script src="https://cdn.ckbox.io/ckbox/2.6.1/ckbox.js" ></script>

        </>
    );
}