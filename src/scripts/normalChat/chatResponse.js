/**
 * Displays the response from the LLM. 
 * Manages the HTML objects, updates the response when more is streamed in and formats the response.
 */
class ChatResponse {
    /**
     * Creates a new ChatResposne instance.
     * @param {HTMLElement} parent - The parent container where the response will be displayed
     * @param {ChatPrompt, string} prompt - The chat prompt object containg the responses. If the prompt is provided as a string, the response is already done. 
     */
    constructor (parent, prompt) {
        this.parent = parent;
        
        this.preloaded = typeof prompt === 'string';

        this.container = document.createElement("div");
        this.container.className = "messageContainer";
        this.container.classList.add("response");

        this.messageTextContainer = document.createElement("div");
        this.messageTextContainer.className = "messageText";
        this.messageTextContainer.classList.add("response");
        this.container.appendChild(this.messageTextContainer);


        // Generates a information bar if the ChatResponse is provided as a prompt and is streamed in
        if (!this.preloaded) {
            this.informationBar = document.createElement("div");
            this.informationBar.className = "informationBar";
            this.container.appendChild(this.informationBar);
    
            this.modelDisplayElement = document.createElement("div");
            this.modelDisplayElement.className = "displayElement";
            this.modelDisplayElement.classList.add("model");
            this.modelDisplayElement.innerText = prompt.model;
            this.informationBar.appendChild(this.modelDisplayElement);
    
            this.tokensPerSecondDisplayElement = document.createElement("div");
            this.tokensPerSecondDisplayElement.className = "displayElement";
            this.tokensPerSecondDisplayElement.classList.add("tokensPerSecond");
            this.informationBar.appendChild(this.tokensPerSecondDisplayElement);
    
            this.timeDisplayElement = document.createElement("div");
            this.timeDisplayElement.className = "displayElement";
            this.timeDisplayElement.classList.add("model");
            this.timeDisplayElement.innerText = "Running";
            this.informationBar.appendChild(this.timeDisplayElement);
            this.informationBar.style.userSelect = "none";

        };

        this.prompt = prompt;


        // Adds callbacks if the prompt is provided as a string
        if (!this.preloaded) {
            this.prompt.addCallback("streamUpdate", () => { this.updateResponse(); });
    
            this.prompt.addCallback("finished", () => { this.finishedResponse() });

        // If the response is already done, display it
        } else {
            try {
                let string = this.prompt;
                formatToHTML(string, this.messageTextContainer);
                
            } catch (error) {
                console.error("An error occured when formatting to HTML:", error.message);
                this.messageTextContainer.innerText = this.prompt.rawResponse;
            };
        };

        this.parent.appendChild(this.container);       

    }

    /**
     * Called when the response is completely done.
     * Formatts the response and updates informationBar
     */
    finishedResponse() {
        // Formats the code
        this.messageTextContainer.innerHTML = "";
        formatToHTML(this.prompt.rawResponse, this.messageTextContainer);

        // Updates the informationBar
        this.timeDisplayElement.innerText = String(Math.round(this.prompt.resultResponse.total_duration / 10**6) / 10**3) + "s";
        this.tokensPerSecondDisplayElement.innerText = String(Math.round(this.prompt.resultResponse.eval_count / this.prompt.resultResponse.eval_duration * 10**10) / 10**1) + "tokens/s";
    };



    /**
     * Updates the displayed text when more data is streamed in
     */
    updateResponse() {
        // Clears the HTML container
        while (this.messageTextContainer.children.length !== 0)
            this.messageTextContainer.children[0].remove();
        
        // Updates the response
        this.messageTextContainer.innerText = this.prompt.rawResponse;


        // Scrolls the parent to the bottom, but not currently implemented: this.parent.scrollTop = this.parent.scrollHeight;   
    };

    /**
     * Removes the containers HTML
     */
    removeHTML() {
        this.container.remove();
    };
};