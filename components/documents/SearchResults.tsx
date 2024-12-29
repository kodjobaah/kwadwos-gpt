import { useState } from 'react';

export const SearchResults = ({ results, onSelectedItems }) => {
  const [selectedItems, setSelectedItems] = useState({});

  const handleCheckboxChange = (index) => {
    setSelectedItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));


    const items = results.documents.filter((_, index) => selectedItems[index])
    onSelectedItems(items);
  };

  const getSelectedResults = () => {
    return results.documents.filter((_, index) => selectedItems[index]);

  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <h3 className="text-lg font-semibold">Search Results</h3>
      <div className="space-y-2 max-w-full">
        {results != undefined &&
          results.documents.map((result, index) => (
            <div key={index} className="card bg-base-200 max-w-full overflow-hidden flex items-center">
              <input
                type="checkbox"
                className="checkbox mr-4"
                checked={!!selectedItems[index]}
                onChange={() => handleCheckboxChange(index)}
              />
              <div className="card-body">
                <p className="overflow-scroll">{result.text}</p>
                <div className="text-sm text-base-content/70">
                  Relevance: {(result.similarity * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-base-content/70">
                  FileName: {result.filename}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
