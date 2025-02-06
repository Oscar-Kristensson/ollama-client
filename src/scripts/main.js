const tempTestOutputElement = document.getElementById("tempTestOutputElement");



Ollama.initalize()

const chatContainer = document.querySelector(".chatContainer");

const messageComposeElement = document.querySelector(".messageComposeElement");


const ChatController = new ChatControllerClass(chatContainer, messageComposeElement);


Ollama.addCallback("cachedLocalModels", () => {
    console.log(Ollama.getLocalModels());
});


// Add listeners
messageComposeElement.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && event.ctrlKey)
        ChatController.sendMessage();
})


const sendButtonElement = document.querySelector(".button.send");
sendButtonElement.addEventListener("click", () => { ChatController.sendMessage(); });



const testContainer = document.querySelector(".testContainer");


const testDropdown = new CustomDropdown(testContainer, ["Test1", "Test2", "Test3"], [1, 2, 3]);