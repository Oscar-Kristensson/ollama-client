if (window.electronAPI === undefined) console.warn("The electron API could not be accessed. This could be " +
    "due to the project running directly with a server rather than using node. The implications of this can " +
    "be seen in the README: Running with an HTTP server/directly in a browser."
);

// Create folder structure for saves
if (window.electronAPI)
    window.electronAPI.createFolder("save/chats")
    .catch(error => {
        console.warn("Could not create folder structure");
    });



const saveChatToggleSwitchContainer = document.getElementById("saveChatToggleSwitch");
const saveChatToggleSwitch = new ToggleSwitch(saveChatToggleSwitchContainer);
saveChatToggleSwitch.addCallback("changed", () => {
    ChatController.saveChat = saveChatToggleSwitch.checked;

    if (ChatController.saveChat) {
        ChatController.conversation.export();
        mainChatSelector.chatData.push(ChatController.conversation.getConversationData());
        mainChatSelector.createChatElement(ChatController.conversation.conversationName, mainChatSelector.chatData.length - 1);
        mainChatSelector.openChat(mainChatSelector.chatData.length - 1);
    }
    else {
        console.log(mainChatSelector.currentChat);
        mainChatSelector.deleteChat(mainChatSelector.currentChat);
        // ChatController.conversation.deleteSave();
    }

});




const tempTestOutputElement = document.getElementById("tempTestOutputElement");




const chatContainer = document.querySelector(".chatContainer");
const messageComposeElement = document.querySelector(".messageComposeElement");
const conversationNameInputElement = document.getElementById("conversationNameInput");

/**
 * @type {ChatControllerClass}
 */
const ChatController = new ChatControllerClass(chatContainer, messageComposeElement, conversationNameInputElement);




// Add listeners
messageComposeElement.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && event.ctrlKey)
        ChatController.sendMessage(model = modelDropdown.getValue());
})


const sendButtonElement = document.querySelector(".button.send");
sendButtonElement.addEventListener("click", () => { ChatController.sendMessage(model = modelDropdown.getValue()); });


const testContainer = document.querySelector(".testContainer");

const LLMSelectElement = document.querySelector(".LLMSelectElement");


const modelDropdown = new CustomDropdown(LLMSelectElement, ["Model"], [1], CSS_Classes = ["test"], parentIsContainer = true);


Ollama.addCallback("cachedLocalModels", () => {
    let modelNames = [];

    const localModelsData = Ollama.getLocalModels();
    localModelsData.forEach(model => {
        modelNames.push(model.name)
        
    });
    
    modelDropdown.setOptions(modelNames, modelNames);

    modelDropdown.selectElementByValue(config.defaultModels.normal);
});


