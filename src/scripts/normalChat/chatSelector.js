const conversationContainer = document.querySelector(".conversationsContainer");


class ChatSelector {
    constructor (container, chatFilesArray) {
        this.container = container;
        this.chatFilesArray = chatFilesArray;
        console.log(this.chatFilesArray);
        this.chatData = Array(chatFilesArray.length);
        console.log(this.chatData);
        this.loadChats();
    };

    createChatElement(name, index) {
        console.log(name);
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
            console.log(name);
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
                console.log(loadedFilesCount, this.chatFilesArray.length);

                if (loadedFilesCount === this.chatFilesArray.length)
                    this.createChatElements();
            });
            
        });
    };

    createChatElements () {
        console.log("Creating chat elements!", this.chatData);

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
        console.log("NOT IMPLEMENTED: OPEN CHAT", index);
    }
};


if (window.electronAPI)
    window.electronAPI.readFolder("save/chats")
        .then(files => {
            new ChatSelector(conversationContainer, files)
        })
        .catch(error => {
            console.error("Error reading folder:", error.message);
        });
