


class Prompt extends Callbacks {
    constructor (prompt, model) {
        super();

        // Input
        this.prompt = prompt;
        this.model = model;

        // Output
        this.startedReponding = false;
        this.isFinished = false;
        this.rawResponse = "";
    }
}