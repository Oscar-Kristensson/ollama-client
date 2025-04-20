
/**
 * Controlls the conversation by doing the following:
 * 
 * * Handling the UI for the chats
 * * Sending messages based on the user input
 * 
 * The ChatController has a link to the current ChatConversation
 */
class ChatControllerClass {
    constructor (chatContainer, textInputArea, conversationNameInput) {
        this.chatContainer = chatContainer;
        this.textInputArea = textInputArea;
        this.conversationNameInput = conversationNameInput;
        this.conversationNameInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter")
                this.updateNameFromUserInput();
            else
                this.conversationNameInput.classList.add("inputting");
        });

        this.loadConversation(undefined, false, false);

        this.chatResponses = [];
        this.chatMessages = [];

        this.saveChat = false;
    };

    /**
     * Unlinks all the data that the ChatController has. This includes removing all the HTML 
     * elements and clearing the internal data.
     */
    clearConversationHTML () {
        this.chatMessages.forEach(chatMessage => {
            chatMessage.removeHTML();
        });

        this.chatResponses.forEach(chatResponse => {
            chatResponse.removeHTML();
        });

        this.chatResponses = [];
        
        this.chatMessages = [];

        this.conversation = undefined;

        this.conversationNameInput.value = "";
    };

    /**
     * Loads in a new ChatConversation object. Optionally, the conversationData is imported 
     * to the ChatConversation. If clearOld is true, the previous conversation is removed 
     * (se clearConversationHTML).
     * 
     * @param {*} conversationData 
     * @param {boolean} clearOld If true, the previous conversation will be cleared
     * @param {boolean} saveNewConversation If true, the conversation will be automatically saved when a new prompt is finished
     */
    loadConversation (conversationData = undefined, saveNewConversation = false, clearOld = true) {
        if (clearOld) {
            this.clearConversationHTML();
        };
        
        this.saveChat = saveNewConversation;

        let startTime = new Date();
        
        
        if (conversationData)
            if (conversationData.hasOwnProperty("startTime"))
                startTime = conversationData.startTime;
        
        this.conversation = new ChatConversation(startTime);

        this.conversation.addCallback("nameChange", () => {
            this.updateNameUI();
        });

        if (conversationData) {
            this.conversation.loadConversationData(conversationData.conversation);
            conversationData.conversation.forEach(message => {
    
                if (message.role === "user") {
                    const chatMessageObject = new ChatMessage(this.chatContainer, message.content);
                    this.chatMessages.push(chatMessageObject);
    
                } else if (message.role === "assistant") {
                    const chatResponseObject = new ChatResponse(this.chatContainer, message.content);
                    this.chatResponses.push(chatResponseObject);
                };
    
                
            });

            // Set the conversation name of the conversation
            this.conversation.conversationName = conversationData.name;
            this.conversation.callCallbacks("nameChange");
        };


        saveChatToggleSwitch.setState(saveNewConversation, false);





        // const message = new ChatMessage(this.chatContainer, prompt);

    };

    /**
     * Function that is called each time when the prompt generation is finished. Does the following:
     * 
     * * Exports the conversation if this.saveChat is true
     */
    finishedGeneratingMessage () {
        if (this.saveChat)
            this.conversation.export();
    };

    /**
     * Should be called when the name of the conversation object is changed 
     * 
     * Updates the UI interface with the new name from the linked conversation object
     */
    updateNameUI() {
        if (!this.conversation.conversationName) {
            console.warn("Can not update the conversation name to undefined");
            return;
        };


        this.conversationNameInput.value = this.conversation.conversationName;
    };



    updateNameFromUserInput() {
        this.conversation.setName(this.conversationNameInput.value);
        this.conversationNameInput.blur();
        this.conversationNameInput.classList.remove("inputting");
    };



    /**
     * Takes the text prompt from the input field and sends it to the Ollama API 
     * for chat completions. Also calls for the HTML elements to be generated 
     * and stores the messages for the next chatCompletion. Finally, a conversation 
     * name is given
     * 
     * @param {String} model The name of the model that should be used 
     */
    sendMessage(model = "gemma3:1b") {
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
            this.conversation.getAndGenerateConversationName(model);

    
    };
};