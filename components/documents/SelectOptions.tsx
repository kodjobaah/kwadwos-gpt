import { Collections, Document } from '@/lib/model/documents/document-interface';

interface SelectOptionsProps {
  documents: Collections;
  isLoadingDocs: boolean;  // If you need to track loading status, add this prop.
}

const SelectOptions: React.FC<SelectOptionsProps> = ({ documents, isLoadingDocs }) => {
  return (
    <>
      { documents !== undefined && documents.collections.length > 0 ? (
        documents.collections.map((doc) => {
        return <option key={doc.name.name} value={doc.name.name}>
            {doc.name.name}
          </option>
        })
      ) : null}
    </>
  );
}

export default SelectOptions;
