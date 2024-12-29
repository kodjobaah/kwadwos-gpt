'use client'
import { QuestionAndAnswerResponse } from "@/lib/model/types";
import { fetchRagResults } from "@/lib/prisma";
import { useEffect, useState } from "react";

export default function RagResultsPage() {
  const [ragSearchResults, setRagSearchResults] = useState<QuestionAndAnswerResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  let astraDoc:string
  console.log("outside-astr-docs", astraDoc)

  useEffect(() => {
    // Fetch data when the component mounts or the page changes

    const searchParams = new URLSearchParams(document.location.search);
    console.log("user-params:", searchParams);
  
    astraDoc = searchParams.get('astraDoc');
    console.log("user-effect-astr-docs", astraDoc)
    const fetchData = async () => {
      setIsLoading(true);
      try {

        const res = await fetchRagResults(astraDoc as string, currentPage, 2);
        if (!res || res.length === 0) {
          setHasMore(false);
        } else {
          console.log('updd', (typeof res));
          setRagSearchResults(res);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage, astraDoc]);


  const handleNextPage = () => {
    if (hasMore) {
      const nextPage = currentPage + 1; // Calculate next page before updating state
      setCurrentPage(nextPage);
    }

  };
  
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const previousPage = currentPage - 1; // Calculate previous page before updating state
      setCurrentPage(previousPage);
    }
  };
  

  return (
    <div className="overflow-x-auto">
      <h1>Rag Search Results</h1>
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>Answer</th>
          </tr>
        </thead>
        <tbody>
          {ragSearchResults && ragSearchResults.map((rag, index) => (
            <tr key={index}>
              <td>
                <table className="table">
                  <thead>
                    <tr>
                    <th>Time</th>
                      <th>Score</th>
                      <th>Answer</th>
            <th>Prompt</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                    <td>{rag.update.toISOString()}</td>
                      <td>{rag.questionAndAnswer.score}</td>
                      <td>
                        <textarea value={rag.questionAndAnswer.answer} readOnly  
                        className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-purple-500 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50" 
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              <td>{rag.prompt.prompt}</td>
              
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
  <button
    type="button" // Explicitly set the button type to prevent default submission
    className="btn btn-primary"
    onClick={handlePreviousPage}
    disabled={currentPage === 1}
  >
    Previous
  </button>
  <button
    type="button" // Explicitly set the button type to prevent default submission
    className="btn btn-primary"
    onClick={handleNextPage}
    disabled={!hasMore || isLoading}
  >
    {isLoading ? "Loading..." : "Next"}
  </button>
</div>
    </div>
  );
}
