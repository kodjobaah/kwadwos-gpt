import 'server-only'
import { pipeline, PipelineType } from "@huggingface/transformers";

export class QuestionAnswerPipelineSingleton {
    static task = 'question-answering';
    static model = 'Xenova/distilbert-base-uncased-distilled-squad';
    static instance = null;

    static async getInstance(progress_callback = null) {
        if (this.instance === null) {
            this.instance =  await pipeline(this.task as PipelineType, this.model, {

                progress_callback,
            });
        }
        return this.instance;
    }
}