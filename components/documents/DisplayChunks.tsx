

const DisplayChunks = ({chunks}) => {
  return (<>
<div className="flex flex-col h-screen">
    {/* Scrollable Content */}
    <div className="flex-grow overflow-y-auto scrollbar scrollbar-thumb-sky-700 scrollbar-track-sky-300">
        {chunks.map((result, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-md mb-2">
                <p className="font-medium">{result.filename}</p>
                <p className="text-sm text-gray-600 mt-2">{result.chunk}</p>
            </div>
        ))}
    </div>
</div>

    </>
  );
}

export default DisplayChunks