'use client'
import Editor from "@/components/editor/Jodit";
import { QuestionAndAnswerResponse } from "@/lib/model/types";
import { fetchRagResult, fetchRagResults } from "@/lib/prisma";
import { useEffect, useState, useMemo } from "react";




export default function RagResultsPage() {
  const [ragSearchResults, setRagSearchResults] = useState<QuestionAndAnswerResponse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [documentContent, setDocumentContent] = useState("");
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

        const r = await fetchRagResult(searchParams.get("id"));
        console.log("response from database:", JSON.stringify(r))
        setDocumentContent(r.questionAndAnswer.answer);
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
    <div className="">
      <div className="border-rose-600 border-10">

    <Editor doc={documentContent}/>
      </div>
   
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
