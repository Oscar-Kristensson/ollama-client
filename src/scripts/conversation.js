

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
        this.conversationHistory = [];

    };

    loadConversationData (data) {
        console.log("Conversation data 2", data)
        this.conversationHistory = data;
    };

    clearPrompts () {
        this.prompts = [];
    };

    addPrompt (prompt) {
        this.prompts.push(prompt);
    };

    getConversation () {
        let conversationHistory = [ ... this.conversationHistory ];

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

    setName(name) {
        this.conversationName = name;
        this.callCallbacks("nameChange");
    }
    
    getAndGenerateConversationName(model = "gemma3:1b") {
        if (this.prompts.length === 0)
            return;
        
        return new Promise((resolve, reason) => {
            const prompt = new ChatPrompt(`What would you call a this conversation? \n Prompt: ${this.prompts[0].prompt}. Answer only and only \
                with a descriptive name consisting of a single or few words. The name needs to let the user know the subject area. Answer \
                example: "Quantum Computing"`, model); // There may be issues if the model is not installed

            prompt.addCallback("finished", () => {
                let name = prompt.rawResponse;


                if (name[0] === '"') name = name.slice(1);
                if (name[name.length - 1] === '"') name = name.slice(0, name.length - 1);

                resolve(name);
                this.setName(name);

            });
            Ollama.executePrompt(prompt);

        });
    };

    getConversationData() {
        return {
            startTime: this.startTime,
            conversation: this.getConversation(),
            name: this.conversationName
        };
    }

    export () {
        if (!window.electronAPI) {
            console.error("Electron API was not loaded");
            return;
        }

        if (this.prompts.length === 0) {
            console.warn("Did not save empty conversation");
            return;
        };
    
        const data = this.getConversationData();

        return window.electronAPI.writeFile(`save/chats/${this.startTime}.json`, JSON.stringify(data, null, 4));
    };

    deleteSave () {
        if (!window.electronAPI) {
            console.error("Electron API was not loaded");
            return;
        };

        window.electronAPI.deleteFile(`save/chats/${this.startTime}.json`)
        .catch(error => {
            console.log("An error occured when deleting save: " + error.message);
        });

    };


};