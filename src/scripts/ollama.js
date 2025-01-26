



class OllamaAPIContainer {
    constructor () {
        this.ollamaURLs = {
            hostURL: "http://127.0.0.1:11434/",
            promptURL: "api/generate"
        }
        
    }
}



const Ollama = new OllamaAPIContainer();