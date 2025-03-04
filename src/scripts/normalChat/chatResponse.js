

class ChatResponse {
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


        if (!this.preloaded) {
            this.prompt.addCallback("streamUpdate", () => { this.updateResponse(); });
    
            this.prompt.addCallback("finished", () => { this.finishedResponse() });

        } else {
            try {
                let string;
                if (this.prompt instanceof ChatPrompt)
                    string = this.prompt.rawResponse;
                    
                else
                    string = this.prompt;

                formatToHTML(string, this.messageTextContainer);
                
            } catch (error) {
                console.error("An error occured when formatting to HTML:", error.message);
                this.messageTextContainer.innerText = this.prompt.rawResponse;
            };
        };

        this.parent.appendChild(this.container);       

    }

    finishedResponse() {
        this.messageTextContainer.innerHTML = "";
        formatToHTML(this.prompt.rawResponse, this.messageTextContainer);
        this.timeDisplayElement.innerText = String(Math.round(this.prompt.resultResponse.total_duration / 10**6) / 10**3) + "s";
        this.tokensPerSecondDisplayElement.innerText = String(Math.round(this.prompt.resultResponse.eval_count / this.prompt.resultResponse.eval_duration * 10**10) / 10**1) + "tokens/s";
    };


    updateResponse(prompt) {
        while (this.messageTextContainer.children.length !== 0)
            this.messageTextContainer.children[0].remove();
        
        this.messageTextContainer.innerText = this.prompt.rawResponse;


        // Scrolls the parent to the bottom, but not currently implemented: this.parent.scrollTop = this.parent.scrollHeight;   
    };

    removeHTML() {
        this.container.remove();
    };
};