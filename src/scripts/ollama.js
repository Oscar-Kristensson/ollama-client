



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
            console.log("Reading Response!", response);
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }


            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");



            const readStream = () => {
                return reader.read().then(({ done, value }) => {
                    console.log("Reading stream!");

                    if (done) {
                        prompt.callCallbacks("finished");
                        console.log("Stream finished");
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