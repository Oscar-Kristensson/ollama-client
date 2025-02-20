

class ChatConversation extends Callbacks {
    constructor() {
        super();
        this.prompts = [];

    };

    addPrompt(prompt) {
        this.prompts.push(prompt);
    };

    getConversation() {
        let conversationHistory = [];

        this.prompts.forEach((promptObject) => {
            conversationHistory.push({
                "role": "user",
                "content": promptObject.prompt
            });


            if (!promptObject.isFinished) return;

            conversationHistory.push({
                "role": "assistant",
                "content": promptObject.rawResponse
            });
        });


        return conversationHistory;
    };

};