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




const formatter = importFormatter();


const tempTestOutputElement = document.getElementById("tempTestOutputElement");




const chatContainer = document.querySelector(".chatContainer");

const messageComposeElement = document.querySelector(".messageComposeElement");


const ChatController = new ChatControllerClass(chatContainer, messageComposeElement);




// Add listeners
messageComposeElement.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && event.ctrlKey)
        ChatController.sendMessage(model = testDropdown.getValue());
})


const sendButtonElement = document.querySelector(".button.send");
sendButtonElement.addEventListener("click", () => { ChatController.sendMessage(model = testDropdown.getValue()); });


const testContainer = document.querySelector(".testContainer");

const LLMSelectElement = document.querySelector(".LLMSelectElement");


const testDropdown = new CustomDropdown(LLMSelectElement, ["Model"], [1], CSS_Classes = ["test"], parentIsContainer = true);

Ollama.addCallback("cachedLocalModels", () => {
    console.log(Ollama.getLocalModels());

    let modelNames = [];

    const localModelsData = Ollama.getLocalModels();
    localModelsData.forEach(model => {
        modelNames.push(model.name)
        
    });
    testDropdown.setOptions(modelNames, modelNames);
});

window.electronAPI.deleteFile("save/chats/test.txt")
.then(success => {
    if (!success)
        console.log(">>>File not found!");
    console.log("Deleted file!");
})
.catch(error => {
    console.log("File deletion failed!");
    console.error(error);
})

const saveChatToggleSwitchContainer = document.getElementById("saveChatToggleSwitch");
const saveChatToggleSwitch = new ToggleSwitch(saveChatToggleSwitchContainer)
saveChatToggleSwitch.addCallback("changed", () => {
    ChatController.saveChat = saveChatToggleSwitch.checked;
    if (ChatController.saveChat)
        ChatController.conversation.export();
    else
        ChatController.conversation.deleteSave();
});