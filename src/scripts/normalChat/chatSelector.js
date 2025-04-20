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
        this.currentChat = undefined;
        this.loadChats();
    };

    /**
     * Adds a conversation to the list
     * @param {String} name - The displayed conversation name
     * @param {Number} index - The storage location of the conversation data
     */
    createChatElement(name, index) {
        const container = document.createElement("div");
        container.className = "container";

        this.container.appendChild(container);

        const label = document.createElement("div");
        label.innerText = name;
        label.addEventListener("click", () => {
            this.openChat(index);
        });

        container.appendChild(label);

        const deleteButton = document.createElement("div");
        deleteButton.textContent = "Delete";
        deleteButton.className = "deleteButton";
        deleteButton.addEventListener("click", () => {
            this.deleteChat(index);
        });
        container.appendChild(deleteButton);
    };


    createNewConversation() {
        let index = this.chatData.length;
        this.openChat(index);
        saveChatToggleSwitch.setState(false, false);
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
    createChatElements() {
        for (let i = 0; i < this.chatData.length; i++) {            
            let name;
            if (this.chatData[i].hasOwnProperty("name")) 
                name = this.chatData[i].name;
            else 
                name = "Unkown";
    
            this.createChatElement(name, i);
        };

    };


    openChat(index, emptyConversation = false) {
        this.currentChat = index;
        mainWindowSwitcher.setCurrentState("chat");

        let chatData = undefined;
        if (!emptyConversation)
            this.chatData[index];
        
        ChatController.loadConversation(chatData, true);
    };

    deleteChat(index) {
        console.log(this.chatData, index);
        
        window.electronAPI.deleteFile(`save/chats/${this.chatData[index].startTime}.json`)
        .catch(error => {
            console.log("An error occured when deleting save: " + error.message);
        });
        
        this.container.children[index].classList.add("deleted");
        this.chatData[index] = undefined;
        
        if (this.currentChat === index) {
            this.currentChat = undefined;
        };
    };

};

/**
 * @type {ChatSelector}
 */
let mainChatSelector = undefined;

if (window.electronAPI)
    window.electronAPI.readFolder("save/chats")
        .then(files => {
            mainChatSelector = new ChatSelector(conversationContainer, files);
        })
        .catch(error => {
            console.error("Error reading folder:", error.message);
        });
