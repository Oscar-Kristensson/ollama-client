const tempTestOutputElement = document.getElementById("tempTestOutputElement");

// Test code, temporary
const testPrompt = new ChatPrompt(
    "Hello World!",
    "llama3.1"
)



// Most likely a function only for testing
function askPrompt(promptText) {
    const prompt = new ChatPrompt(
        promptText,
        "llama3.2:3b"
    )

    prompt.addCallback("startedResponding", (prompt) => {
        tempTestOutputElement.innerText = "";
        prompt.rawResponse = "";
    });


    prompt.addCallback("streamUpdate", (prompt) => {
        tempTestOutputElement.innerText = prompt.rawResponse;
    })

    prompt.addCallback("finished", (prompt) => {
        console.log(prompt.resultResponse);
    })

    Ollama.executePrompt(prompt);


};

Ollama.initalize()

const chatContainer = document.querySelector(".chatContainer");

function runTest() {
    console.log("Executing prompt!");

    console.log(Ollama.getLocalModels());


    const prompt = new ChatPrompt("What is python", "llama3.2:3b");

    const response = new ChatResponse(chatContainer, prompt);

    Ollama.executePrompt(prompt);
    
}