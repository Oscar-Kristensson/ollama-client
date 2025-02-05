

class ChatControllerClass {
    constructor (chatContainer, textInputArea) {
        this.chatContainer = chatContainer;
        this.textInputArea = textInputArea;

        this.chatResponses = [];
        this.chatMessages = [];


    }

    sendMessage() {
        let textPrompt = this.textInputArea.value;
        
        if (textPrompt == "") return;
        this.textInputArea.value = "";

        let model = "llama3.2:3b";

        const prompt = new ChatPrompt(textPrompt, model);

        const message = new ChatMessage(this.chatContainer, prompt);

        const repsonse = new ChatResponse(this.chatContainer, prompt);

        Ollama.executePrompt(prompt);
    
    };
};