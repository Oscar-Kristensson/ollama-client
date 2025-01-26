



class OllamaAPIContainer {
    constructor () {
        this.ollamaURLs = {
            hostURL: "http://127.0.0.1:11434/",
            promptURL: "api/generate"
        };

        // Contains all the prompts
        this.promptQue = [];
        
    };

    addToQue(prompt) {
        this.promptQue.push(prompt);
    };
}



const Ollama = new OllamaAPIContainer();