

class ChatResponse {
    constructor (parent, prompt) {
        this.parent = parent;

        this.container = document.createElement("div");
        this.container.className = "messageContainer";
        this.container.classList.add("response");

        this.messageTextContainer = document.createElement("div");
        this.messageTextContainer.className = "messageText";
        this.messageTextContainer.classList.add("response");
        this.container.appendChild(this.messageTextContainer);


        this.informationBar = document.createElement("div");
        this.informationBar.className = "informationBar";
        this.container.appendChild(this.informationBar);

        this.modelDisplayElement = document.createElement("div");
        this.modelDisplayElement.className = "displayElement";
        this.modelDisplayElement.classList.add("model");
        this.modelDisplayElement.innerText = prompt.model;
        this.informationBar.appendChild(this.modelDisplayElement);

        this.timeDisplayElement = document.createElement("div");
        this.timeDisplayElement.className = "displayElement";
        this.timeDisplayElement.classList.add("model");
        this.timeDisplayElement.innerText = "Running";
        this.informationBar.appendChild(this.timeDisplayElement);
        this.informationBar.style.userSelect = "none";

        this.prompt = prompt;

        this.prompt.addCallback("streamUpdate", () => { this.updateResponse(); });

        this.prompt.addCallback("finished", () => { this.finishedResponse() });

        this.parent.appendChild(this.container);       

    }

    finishedResponse() {
        this.timeDisplayElement.innerText = String(Math.round(this.prompt.resultResponse.total_duration / 10**6) / 10**3) + "s";
    };


    updateResponse(prompt) {
        this.messageTextContainer.innerText = this.prompt.rawResponse;


        // Scrolls the parent to the bottom, but not currently implemented: this.parent.scrollTop = this.parent.scrollHeight;   
    };
};