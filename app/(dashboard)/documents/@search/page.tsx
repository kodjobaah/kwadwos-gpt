'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { HfInference } from '@huggingface/inference';
import { Collections, Document } from '@/lib/model/documents/document-interface';
import SelectOptions from '@/components/documents/SelectOptions';
import { TextAccessibilityManager } from 'pdfjs-dist/types/web/text_accessibility';
import { AstraDocument, AstraDocumentData, astraDocumentSchema } from '@/lib/model/astra';
import { z } from 'zod';
import { SearchResults } from '@/components/documents/SearchResults';
import { DocumentSelection } from '@/components/documents/DocumentSelection';
import { useRouter } from 'next/navigation';
import { redirectToReadParams } from '@/lib/util/router/router';

export const fetchCache = 'force-no-store';


export default function DocumentSearch() {
    const [selectedDoc, setSelectedDoc] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<AstraDocument>();
    const [selectedDocuments, setSelectedDocuments] = useState<AstraDocumentData[]>();
    const router = useRouter();

    // Fetch documents from Astra DB
    const { data: documents, isLoading: isLoadingDocs } = useQuery<Collections>({
        queryKey: ['documents'],
        queryFn: async () => {
            console.log('Fetching documents...');
            const response = await fetch('/api/documents');
            if (!response.ok) {
                throw new Error('Failed to fetch documents');
            }
            const res = await response.json();
            console.log('Documents fetched:', res);

            setSelectedDoc(res.collections[0].name.name)
    
            return res;
        },
    });

    const llmMutation = useMutation({
        mutationFn: async({prompt, context}:{prompt: string, context: AstraDocumentData[]} ) => {

            const llmResponse = await fetch('/api/llm', {
                                 method: 'POST',
                                 headers: { 'Content-Type': 'application/json' },
                                 body: JSON.stringify({ prompt, context, selectedDoc }),
                });

            const resp = await llmResponse.json();

            const params = {
                astraDoc: selectedDoc,
              };
          

            const queryString = new URLSearchParams(params).toString();
            router.push(`/documents/rag?${queryString}`);
            console.log(resp)
            return resp;

        }
    })
    // Perform search mutation
    const searchMutation = useMutation({
        mutationFn: async ({ query, collectionName }: { query: string, collectionName: string }) => {
    
            console.log("**************** start ****************");

            const searchResponse = await fetch('/api/documents/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, collectionName }),
            });


            const searchData = await searchResponse.json()
            console.log("**************** after ****************", searchData);

            if (!searchResponse.ok) {
                throw new Error('Search failed');
            }


         //   const out: AstraDocument[] = z.array(astraDocumentSchema).parse(searchData);
            
   
          //  console.log(JSON.stringify(out));
            console.log("**********************************BOOHBAH");
            // console.log(searchData)

            setSearchResults(searchData)
            return searchData;

//             const prompt = `<s>[INST] Using the following context, answer this question: ${query}

// Context:
// ${searchData.contexts.join('\n')}

// Answer: [/INST]`;

//             const llmResponse = await fetch('/api/llm', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ prompt }),
//             });

//             if (!llmResponse.ok) {
//                 throw new Error('LLM processing failed');
//             }

//             return llmResponse.json();
        },
    onSuccess: (data) => {
            console.log("setting serach reuslst:"+JSON.stringify(data))
            setSearchResults(data);
        },
    });

    if (isLoadingDocs) {
        return (
            <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    function updateSelectedItems(items) {
        setSelectedDocuments(items);
        console.log(selectedDocuments)
    }
    

    return (
        <div className="flex-grow">
            {/* Document Selection */}

           
                <label className="label leading-normal">
                    <h1 className="text-3xl font-bold text-center mb-8">Select Document</h1>
                </label>
           

            <DocumentSelection  
            selectedDoc={selectedDoc}  
            setSelectedDoc={setSelectedDoc} 
            isLoadingDocs={isLoadingDocs} 
            documents={documents}/>

            {/* Search Input */}
            {selectedDoc && (
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Document Instructions</span>
                    </label>
                    <div className="flex gap-2">
                    <textarea id="message" 
                    placeholder="Enter your search query..." 
                    rows={4} onChange={(e) => setSearchQuery(e.target.value)} 
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    value={searchQuery}
                    />

                        <button
                            className="btn btn-primary"
                            onClick={() => searchMutation.mutate({ collectionName: selectedDoc, query: searchQuery })}
                            disabled={searchMutation.isPending || !searchQuery.trim()}
                        >
                            {searchMutation.isPending ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'Vector Search'
                            )}
                        </button>


                            {searchResults?.documents &&(
                                <button
                            className="btn btn-primary"
                            onClick={() => llmMutation.mutate({ prompt: searchQuery, context: selectedDocuments })}
                            disabled={searchMutation.isPending || !searchQuery.trim()}
                        >
                            {llmMutation.isPending ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                'RAG Search'
                            )}
                        </button>

                            )}
                         </div>
                </div>
            )}

            {/* Results */}
            {searchResults?.documents && (
                    <div className="flex-grow">
                <SearchResults results={searchResults} onSelectedItems = {updateSelectedItems} />
                </div>
            )}
        </div>
    );
}

