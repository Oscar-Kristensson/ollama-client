

class ChatMessage {
    constructor (parent, prompt) {
        this.container = document.createElement("div");
        this.container.className = "messageContainer";
        this.container.classList.add("user");

        this.messageTextContainer = document.createElement("div");
        this.messageTextContainer.className = "messageText";
        this.messageTextContainer.innerText = prompt.prompt;
        this.container.appendChild(this.messageTextContainer);


        this.prompt = prompt;
        parent.appendChild(this.container);

    };
};