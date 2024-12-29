import { z } from "zod";



export const astraDocumentDataSchema = z.object({
    id: z.string(),
    filename: z.string(),
    text: z.string(),
    similarity: z.number()

})

export const astraDocumentSchema = z.object( 
    {
    documents: z.array(z.record(z.string(), z.any()))
    });



export type AstraDocumentData = z.infer<typeof astraDocumentDataSchema>;
export type AstraDocument = z.infer<typeof astraDocumentSchema>;


