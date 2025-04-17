const conversationContainer = document.querySelector(".conversationsContainer");

/**
 * Creates and controlls the elements for the conversation selector
 */
class ChatSelector {
    /**
     * Creates a new ChatSelector instance.
     * @param {HTMLElement} container - The container where the HTML elements are added
     * @param {Array} chatFilesArray - An array with the filenames for the conversations
     */
    constructor (container, chatFilesArray) {
        this.container = container;
        this.chatFilesArray = chatFilesArray;
        this.chatData = Array(chatFilesArray.length);
        this.loadChats();
    };

    /**
     * Adds a conversation to the list
     * @param {String} name - The displayed conversation name
     * @param {Number} index - The storage location of the conversation data
     */
    createChatElement(name, index) {
        const element = document.createElement("div");
        element.className = "label";
        element.innerText = name;
        element.addEventListener("click", () => {
            this.openChat(index);
        });
        this.container.appendChild(element);
    };




    loadChats () {
        let loadedFilesCount = 0;
        this.chatFilesArray.forEach((name, i) => {
            window.electronAPI.loadFile(`save/chats/${name}`)
            .then(value => {
                return JSON.parse(value);
            })
            .then(chatData => {
                this.chatData[i] = chatData;
            })
            .catch(error => {
                console.error("Error: ", error.message);
            })
            .finally(() => {
                loadedFilesCount++;

                if (loadedFilesCount === this.chatFilesArray.length)
                    this.createChatElements();
            });
            
        });
    };

    /**
     * Creates the chat elements from the chatData
     */
    createChatElements () {
        for (let i = 0; i < this.chatData.length; i++) {            
            let name;
            if (this.chatData[i].hasOwnProperty("name")) 
                name = this.chatData[i].name;
            else 
                name = "Unkown";
    
            this.createChatElement(name, i);
        };

    };


    openChat(index) {
        mainWindowSwitcher.setCurrentState("chat");
        ChatController.loadConversation(this.chatData[index]);
    };
};


if (window.electronAPI)
    window.electronAPI.readFolder("save/chats")
        .then(files => {
            new ChatSelector(conversationContainer, files)
        })
        .catch(error => {
            console.error("Error reading folder:", error.message);
        });
