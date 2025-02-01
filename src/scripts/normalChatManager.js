

class ChatResponse {
    constructor (parent, prompt) {
        this.container = document.createElement("div");
        this.container.className = "messageContainer";
        this.container.classList.add("response");

        this.messageTextContainer = document.createElement("div");
        this.messageTextContainer.className = "messageText";
        this.messageTextContainer.classList.add("response");
        this.container.appendChild(this.messageTextContainer);


        this.prompt = prompt;

        this.prompt.addCallback("streamUpdate", () => { this.updateResponse(); });

        parent.appendChild(this.container);       

    }


    updateResponse(prompt) {
        this.messageTextContainer.innerText = this.prompt.rawResponse;
    };
}