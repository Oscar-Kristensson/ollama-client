const tempTestOutputElement = document.getElementById("tempTestOutputElement");

// Test code, temporary
const testPrompt = new Prompt(
    "Hello World!",
    "llama3.1"
)


function runTest() {
    console.log("Executing prompt!");

    
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