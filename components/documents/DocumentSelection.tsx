import SelectOptions from "./SelectOptions";

export const DocumentSelection = ({ selectedDoc, setSelectedDoc, isLoadingDocs, documents }) => {

    return( 
    
    <div className='flex-auto border-rose-200'>
            <div className="form-control">
                <select
                    className="select select-bordered w-full mt-2"
                    value={selectedDoc}
                    onChange={(e) => {
                        console.log('Selected Document:', e.target.value);
                        setSelectedDoc(e.target.value);
                    }}
                    disabled={isLoadingDocs || !documents || documents.collections.length === 0}
                >
                    <SelectOptions documents={documents} isLoadingDocs={isLoadingDocs} />
                </select>

            </div>
        </div>
    );
}