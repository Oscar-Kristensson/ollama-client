

class ChatControllerClass {
    constructor (chatContainer, textInputArea) {
        this.chatContainer = chatContainer;
        this.textInputArea = textInputArea;

        this.conversation = new ChatConversation();

        this.conversation.addCallback("streamUpdate", () => { console.log(this.conversation); }) // TEMP

        this.chatResponses = [];
        this.chatMessages = [];


    };

    finishedGeneratingMessage () {
        
        this.conversation.export();
    };

    sendMessage(model = "llama3.2:3b") {
        let textPrompt = this.textInputArea.value;
        
        if (textPrompt === "") return;
        this.textInputArea.value = "";

        const prompt = new ChatPrompt(textPrompt, model);

        prompt.addCallback("finished", () => { this.finishedGeneratingMessage(); });

        const message = new ChatMessage(this.chatContainer, prompt);

        const repsonse = new ChatResponse(this.chatContainer, prompt);

        this.conversation.addPrompt(prompt);

        Ollama.executePrompt(this.conversation);

        if (this.conversation.prompts.length === 1) 
            this.conversation.getAndGenerateConversationName();

    
    };
};