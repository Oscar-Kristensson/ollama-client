

class ChatPrompt extends Callbacks {
    constructor (prompt, model) {
        super();
        console.log("Created new prompt: ", prompt);

        // Input
        this.prompt = prompt;
        this.model = model;

        // Output
        this.clearResponse();
    }

    clearResponse() {
        this.startedReponding = false;
        this.isFinished = false;
        this.rawResponse = "";
        this.resultResponse = undefined;
    };
};