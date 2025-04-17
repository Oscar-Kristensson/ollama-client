
/**
 * Class that contains the api for communicating with Ollama
 */
class OllamaAPIContainer extends Callbacks {
    /**
     * Creates an instance of the Ollama API. Note that the instance needs to be configured and initalized before use.
     */
    constructor () {
        super();
    };

    /**
     * Starts the ollama server
     */
    sendStart() {
        if (window.electronAPI && config.autoLaunchOllama)
            window.electronAPI.launchOllama();
    };

    /**
    * Starts the ollama server
     * @param {String} hostURL - The location of the ollama API
     * @param {String} promptURL - The path to the generation URL
     * @param {String} chatURL - The path to the conversation generation URL
     * @param {String} modelsURL - The path to the loaded models URL
     * @param {String} downloadModelURL - The path to the download models URL
    */
    configure(hostURL = "http://127.0.0.1:11434/", promptURL = "api/generate", chatURL = "api/chat", modelsURL = "api/tags", downloadModelURL = "api/pull") {
        this.ollamaURLs = {
            hostURL: hostURL,
            promptURL: promptURL,
            chatURL: chatURL,
            modelsURL: modelsURL,
            downloadModelURL: downloadModelURL
        };
    };

    ping() {
        return fetch(this.ollamaURLs.hostURL)
        .then((response) => {
            // Check if the response is ok (status code 200-299)
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            
            // Parse the JSON response
            return response.text();
        })
        .then(result => {
            if (result === "Ollama is running") {
                return true;
            }
            else {
                console.log("Ollama is not running");
                return false;
            }
        })
        .catch(error => {
            console.error("There was a problem with the fetch operation. This could be because the Ollama API is not on the following url: " + this.ollamaURLs.hostURL + " Error: " + error.message);
            return false;
        });
    };


    initalize() {
        if (!this.ollamaURLs) {
            console.error("Ollama must be configured before initalization");
            return;
        }

        // Contains all the prompts. Should the que be a feature?
        this.promptQue = [];

        this.localModels = undefined;

        this.cacheLocalModels();

        // Return a promise (or some other form of callback)
        
        
    };



    addToQue(prompt) {
        console.error("Should this be a feature?");
        // Should this be a feature?
        if (prompt.isFinished) {
            console.error("Cannot add a prompt that is already finished!");
            return;
        };

        this.promptQue.push(prompt);
    };

    cacheLocalModels() {
        return fetch(this.ollamaURLs.hostURL + this.ollamaURLs.modelsURL)
            .then((response) => {
                // Check if the response is ok (status code 200-299)
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                // Parse the JSON response
                return response.json();
            })
            .then((data) => {
                // Handle the data received from the API
                this.localModels = data.models;
                this.callCallbacks("cachedLocalModels");
                
            })
            .catch((error) => {
                // Handle any errors that occur during the fetch
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    getLocalModels() {
        if (!this.localModels) return undefined;
        return this.localModels;
    };

    isModelInstalled(model, digest = undefined) {
        if (!this.localModels) return undefined;

        for (let i = 0; i < this.localModels.length; i++) {
            if (this.localModels[i].model === model && (!digest || digest === this.localModels[i].digest))
                return true;
        };

        return false;
    };


    installModel(model, 
        onupdateCallback = (latest, currentPull, completedData, totalData) => {
            console.log(`Latest: ${latest}, Current Pull: ${currentPull}, CompletedData: ${completedData}, Total Data: ${totalData}`);
        },
        onfinish = () => {console.log("Finished Download")}
            
    ){

        if (this.isModelInstalled(model))
            console.log("Is already installed!");


        const body =  {
            model: model
        }


        const request = {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        }


        fetch(this.ollamaURLs.hostURL + this.ollamaURLs.downloadModelURL, request)
        .then(response => {
            /* Response: 
            {"status":"pulling dbe81da1e4ba","digest":"sha256:dbe81da1e4bad3cc6ccb77540915ffe53e7a3ac0745ffa5e9d4626d39c15e09a","total":815310432,"completed":394494560}
             */

            if (!response.ok) 
                throw new Error(`HTTP Error! Status: ${response.status}`);

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            let previousPull = "";
            let completed = 0;
            let total = 0;

            const readStream = () => {
                return reader.read().then(({ done, value }) => {
                    // Stops the reading when the prompt is done
                    if (done) {
                        onfinish();
                        return;
                    };

    
                    // Converts bytes to string
                    let string = decoder.decode(value);
                    console.log(string);

                    let chunks = string.split("}\n{");
                    if (chunks.length > 1) console.log("!!!");

                    for (let i = 0; i < chunks.length; i++) {
                        console.log("=======", "\nChunk:", chunks[i], i)
                        let correctedChunk;
                        const isFirstChunk = i === 0;
                        const isLastChunk = i === chunks.length - 1;
                        if (isFirstChunk && chunks.length === 1) {
                            correctedChunk = chunks[i];
                        }
                        else if (isFirstChunk) {
                            correctedChunk = chunks[i] + "}";
                        } else if (isLastChunk) {
                            correctedChunk = "{" + chunks[i];
                        } else
                            correctedChunk = "{" + chunks[i] + "}";


                        let data;
                        try {
                            data = JSON.parse(correctedChunk);
    
                        } catch (error) {
                            console.error("Some error when parsing!", error.message, "Input>", string, "CC>", correctedChunk);
                            return readStream();
                        };

                        let currentPull;
                        
                        try {
                            currentPull = data.status.split(" ")[1];
                        } catch (error) {
                            console.error("Some error trying to split data.status!", error.message, "Input>", data.status);
                        }
    
                        const newPull = currentPull !== previousPull;
                        const downloadingProcess = data.hasOwnProperty("completed");
    
                        if (data.hasOwnProperty("total"))
                            total = data.total;
    
                        let latest = "nothing";
    
                        if (newPull)
                            latest = "newPull";

                        else if (data.status === "success")
                            latest = "finished";
                        
                        else if (downloadingProcess) {
                            latest = "downloading";
                            completed = data.completed;
                        };
    
                        onupdateCallback(latest, currentPull, completed, total);
                        previousPull = currentPull;  
                    };


                    return readStream();
                });
            };

            readStream();

            
        })
    }


    executePrompt (promptOrConversation) {
        // NOTE! This function is really long and should be split up

        if (!this.ollamaURLs.hostURL) {
            console.error("Ollama not initalized");
            return;
        };

        let promptInConversation = promptOrConversation instanceof ChatConversation;
        
        let fetchURL;
        if (promptInConversation) 
            fetchURL = this.ollamaURLs.hostURL + this.ollamaURLs.chatURL;
        else
            fetchURL = this.ollamaURLs.hostURL + this.ollamaURLs.promptURL;

        let data = {};

        let prompt;

        // Add the prompt data. The data is different depending on whether it is
        // a simple prompt or part of a conversation
        if (promptInConversation) {
            data.messages = promptOrConversation.getConversation();
            prompt = Utils.getLastElement(promptOrConversation.prompts);
        } else {
            data.prompt = promptOrConversation.prompt;
            prompt = promptOrConversation;
        };

        data.model = prompt.model;

        


        const request = {

            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }


        fetch(fetchURL, request)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            this.startedResponding = true;

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");

            prompt.callCallbacks("startedResponding");

            let responseCache = "";

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

                    if (responseCache !== "") {
                        word = responseCache + word;
                        responseCache = "";
                    };

                    let responseChunks = word.split("}\n");

                    let responseObjects = [];
                    responseChunks.forEach((chunk) => {
                        if (chunk === "") return;
                        responseObjects.push(JSON.parse(chunk + "}\n"));
                    });

                    responseObjects.forEach((response) => {
                        this.#executePrompt_processSingleJSONObjectResponse(prompt, response, promptInConversation);
                        
                    });

                    return readStream();
                })
            }

            readStream();

        })





    };

    #executePrompt_processSingleJSONObjectResponse(prompt, response, isConversation = false) {

        let textResponse;

        if (isConversation)
            textResponse = response.message.content;

        else
            textResponse = response.response;
        

        if (textResponse == "undefined") alert("Undefined error!" + String(response));

        if (response.done) { 
            prompt.resultResponse = response;
        };

        
        // Adds the string to the prompts output
        prompt.rawResponse += textResponse;


        prompt.callCallbacks("streamUpdate", () => { console.log("test!")});


    };
}


/**
 * @type {OllamaAPIContainer}
 */
const Ollama = new OllamaAPIContainer();