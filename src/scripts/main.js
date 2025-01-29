const tempTestOutputElement = document.getElementById("tempTestOutputElement");

// Test code, temporary
const testPrompt = new Prompt(
    "Hello World!",
    "llama3.1"
)



// Most likely a function only for testing
function askPrompt(promptText) {
    const prompt = new Prompt(
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

    Ollama.executePrompt(prompt);


};

Ollama.initalize()


function runTest() {
    console.log("Executing prompt!");

    console.log(Ollama.getLocalModels());
    
    testPrompt.addCallback("startedResponding", (prompt) => {
        tempTestOutputElement.innerText = "";
        prompt.rawResponse = "";
    });


    testPrompt.addCallback("streamUpdate", (prompt) => {
        tempTestOutputElement.innerText = prompt.rawResponse;
    })

    testPrompt.addCallback("finished", (prompt) => { console.log(prompt.rawResponse); })
    Ollama.executePrompt(testPrompt);
}