

class ChatConversation extends Callbacks {
    constructor (startTime = new Date()) {
        super();
        this.startTime = startTime;
        if (this.startTime instanceof Date) {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1; // Months are zero-indexed, so add 1
            const day = currentDate.getDate();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const seconds = currentDate.getSeconds();

            this.startTime = `${year}-${month}-${day}T${hours}-${minutes}-${seconds}`;
        }

        this.prompts = [];

    };

    addPrompt (prompt) {
        this.prompts.push(prompt);
    };

    getConversation () {
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

    
    getAndGenerateConversationName () {
        console.log("Generating name!");

        if (this.prompts.length === 0)
            return;
        
        console.log(this.prompts[0]);

        return new Promise((resolve, reason) => {
            const prompt = new ChatPrompt(`What would you call a this conversation? \n Prompt: ${this.prompts[0].prompt}. Answer only and only with a descriptive name consisting of a single or few words. The name needs to let the user know the subject area. Answer example: "Quantum Computing"`, "llama3.2:1b");
            prompt.addCallback("finished", () => {
                this.conversationName = prompt.rawResponse;

                if (this.conversationName[0] === '"') this.conversationName = this.conversationName.slice(1);
                if (this.conversationName[this.conversationName.length - 1] === '"') this.conversationName = this.conversationName.slice(0, this.conversationName.length - 1);

                resolve(prompt.rawResponse);
            });
            Ollama.executePrompt(prompt);

        });



    };

    export () {
        const data = {
            startTime: this.startTime,
            conversation: this.getConversation(),
            name: this.conversationName
        };

        return window.electronAPI.writeFile(`save/chats/${this.startTime}.json`, JSON.stringify(data, null, 4));
    };


};