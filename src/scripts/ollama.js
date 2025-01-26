



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
        // Should this be a feature?
        if (prompt.isFinished) {
            console.error("Cannot add a prompt that is already finished!");
            return;
        };

        this.promptQue.push(prompt);
    };


    executePrompt (prompt) {
        const data = {
            model: prompt.model,
            prompt: prompt.prompt
        }

        fetch(this.ollamaURLs.hostURL + this.ollamaURLs.promptURL, 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            this.startedResponding = true;

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            prompt.callCallbacks("startedResponding");

            const readStream = () => {
                return reader.read().then(({ done, value }) => {

                    // Stops the reading when the prompt is done
                    if (done) {
                        prompt.isFinished = true;
                        prompt.callCallbacks("finished");
                        return;
                    };
    
                    // Converts bytes to string
                    let word = decoder.decode(value);
    
                    // Extracts the word from the reponse
                    let textResponse = JSON.parse(word)["response"];

                    
                    // Adds the string to the prompts output
                    prompt.rawResponse += textResponse;


                    prompt.callCallbacks("streamUpdate", () => {console.log("test!")});

                    return readStream();
                })
            }

            readStream();
        })


    };
}



const Ollama = new OllamaAPIContainer();