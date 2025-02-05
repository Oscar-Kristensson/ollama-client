const tempTestOutputElement = document.getElementById("tempTestOutputElement");


Ollama.initalize()

const chatContainer = document.querySelector(".chatContainer");

const messageComposeElement = document.querySelector(".messageComposeElement");


const ChatController = new ChatControllerClass(chatContainer, messageComposeElement);


messageComposeElement.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && event.ctrlKey)
        ChatController.sendMessage();
})


const sendButtonElement = document.querySelector(".button.send");
sendButtonElement.addEventListener("click", () => { ChatController.sendMessage(); });