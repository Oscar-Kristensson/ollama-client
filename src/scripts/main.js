const tempTestOutputElement = document.getElementById("tempTestOutputElement");



Ollama.initalize()

const chatContainer = document.querySelector(".chatContainer");

const messageComposeElement = document.querySelector(".messageComposeElement");


const ChatController = new ChatControllerClass(chatContainer, messageComposeElement);





// Add listeners
messageComposeElement.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && event.ctrlKey)
        ChatController.sendMessage(model = testDropdown.getValue());
})


const sendButtonElement = document.querySelector(".button.send");
sendButtonElement.addEventListener("click", () => { ChatController.sendMessage(); });



const testContainer = document.querySelector(".testContainer");


const testDropdown = new CustomDropdown(testContainer, ["Model"], [1]);

Ollama.addCallback("cachedLocalModels", () => {
    console.log(Ollama.getLocalModels());

    let modelNames = [];

    const localModelsData = Ollama.getLocalModels();
    localModelsData.forEach(model => {
        modelNames.push(model.name)
        
    });
    testDropdown.setOptions(modelNames, modelNames);
});