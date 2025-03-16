

class ChatControllerClass {
    constructor (chatContainer, textInputArea) {
        this.chatContainer = chatContainer;
        this.textInputArea = textInputArea;

        this.loadConversation(undefined, false);

        this.chatResponses = [];
        this.chatMessages = [];

        this.saveChat = false;


    };

    clearConversationHTML () {
        this.chatMessages.forEach(chatMessage => {
            chatMessage.removeHTML();
        });

        this.chatResponses.forEach(chatResponse => {
            chatResponse.removeHTML();
        });

        this.chatResponses = [];
        
        this.chatMessages = [];
    };

    loadConversation (conversationData = undefined, clearOld = true) {
        if (clearOld) {
            this.clearConversationHTML();
            saveChatToggleSwitch.setState(true);
            this.saveChat = true;
        };


        let startTime = new Date();

        
        
        
        if (conversationData)
            if (conversationData.hasOwnProperty("startTime"))
                startTime = conversationData.startTime;
        
        this.conversation = new ChatConversation(startTime);

        if (conversationData) 
            this.conversation.loadConversationData(conversationData.conversation);




        if (conversationData)
            conversationData.conversation.forEach(message => {

                if (message.role === "user") {
                    const chatMessageObject = new ChatMessage(this.chatContainer, message.content);
                    this.chatMessages.push(chatMessageObject);

                } else if (message.role === "assistant") {
                    const chatResponseObject = new ChatResponse(this.chatContainer, message.content);
                    this.chatResponses.push(chatResponseObject);
                };

                
            });


        // const message = new ChatMessage(this.chatContainer, prompt);

    };

    finishedGeneratingMessage () {
        if (this.saveChat)
            this.conversation.export();
    };

    sendMessage(model = "llama3.2:3b") {
        let textPrompt = this.textInputArea.value;
        
        if (textPrompt === "") return;
        this.textInputArea.value = "";

        const prompt = new ChatPrompt(textPrompt, model);

        prompt.addCallback("finished", () => { this.finishedGeneratingMessage(); });

        const message = new ChatMessage(this.chatContainer, prompt.prompt);
        this.chatMessages.push(message);

        const repsonse = new ChatResponse(this.chatContainer, prompt);
        this.chatResponses.push(repsonse);

        this.conversation.addPrompt(prompt);

        Ollama.executePrompt(this.conversation);

        if (this.conversation.prompts.length === 1) 
            this.conversation.getAndGenerateConversationName();

    
    };
};