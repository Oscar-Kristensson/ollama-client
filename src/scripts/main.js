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



const TESTMessage = `
Quantum physics, also known as quantum mechanics, is a branch of physics that studies the behavior of matter and energy at an atomic and subatomic level. It's a fundamental theory that explains how the universe works at its most basic level.

**Key Principles:**

1. **Wave-Particle Duality**: Quantum objects, such as electrons, can exhibit both wave-like and particle-like behavior depending on how they're observed.
2. **Uncertainty Principle**: It's impossible to know certain properties of a quantum object, such as its position and momentum, simultaneously with infinite precision.
3. **Superposition**: Quantum objects can exist in multiple states simultaneously, which is known as a superposition of states.
4. **Entanglement**: Quantum objects can be connected in such a way that the state of one object is dependent on the state of the other, even when they're separated by large distances.
5. **Quantization**: Energy comes in discrete packets, or quanta, rather than being continuous.

undefinedundefinedundefinedories:**

1. **Schrödinger Equation**: A mathematical equation that describes the time-evolution of a quantum system.
2. **Heisenberg Uncertainty Principle**: A mathematical statement that describes the limits of precision in measuring certain properties of a quantum object.
3. **Dirac Equation**: A relativistic wave equation that describes the behavior of fermions, such as electrons and quarks.

**Applications:**

1. **Transistors**: The building blocks of modern electronics, transistors rely on quantum mechanics to control the flow of electric current.
2. **Lasers**: The amplification of light through stimulated emission relies on quantum mechanics.
3. **Computer Chips**: The speed and efficiency of computer chips depend on the principles of quantum mechanics.
4. **Magnetic Resonance Imaging (MRI)**: MRI machines use quantum mechanics to create detailed images of the body.

**Quantum Phenomena:**

1. **Entanglement Swapping**: When two particles are entangled, and then a third particle is also entangled with one of the original particles, the state of the third particle is correlated with the original particle, even if it's separated by large distances.
2. **Quantum Tunneling**: Particles can pass through barriers or gaps that they wouldn't normally be able to cross.
3. **Quantum Eraser Experiment**: A thought experiment that demonstrates the ability to retroactively change the outcome of a measurement.

**Open Questions:**

1. **Interpretation of Quantum Mechanics**: There are many different interpretations of quantum mechanics, including the Copenhagen interpretation, the Many-Worlds Interpretation, and the pilot-wave theory.
2. **Quantum Gravity**: The integration of quantum mechanics and general relativity is still an open problem in physics.

**Challenges:**

1. **Scalability**: Quantum systems are fragile and easily disrupted by interactions with the environment.
2. **Computational Complexity**: Quantum algorithms can be very complex and difficult to program.
3. **Interpretation**: There's ongoing debate about how to interpret the meaning of quantum mechanics.

In conclusion, quantum physics is a fascinating field that explores the behavior of matter and energy at its most fundamental level. While we've made significant progress in understanding quantum phenomena, there's still much to be discovered, and ongoing research continues to push the boundaries of our knowledge. chatResponse.js:46:17


`




// formatter.formatToHTML(testContainer, TESTMessage);