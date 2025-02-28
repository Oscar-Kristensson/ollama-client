function isBulletListItem(line) {
    return line.startsWith("*") || line.startsWith("•");
}

function isNumberedListItem(line) {
    for (let charNumber = 0; charNumber < line.length; charNumber++) {
        const char = line[charNumber];

        if (!Utils.isNumber(char)) {
            return (char === "." && charNumber !== 0)
        };

    }
    return false;
};




class Line {
    constructor (lineContent, lineNumber, isLastLine = false) {
        this.content = lineContent;
        this.number = lineNumber;

        // NOTE: This code could be optimizied by not running the check if it is not needed
        this.isEmpty = this.content === "";
        if (!this.isEmpty) {
            this.isHeading = this.content.startsWith("**") && this.content.endsWith("**");
            this.isBulletListItem = !this.isHeading && isBulletListItem(this.content);
            this.isNumberListItem = isNumberedListItem(this.content);
            this.isCodeStartOrEnd = this.content.startsWith("```");
            this.isTable = this.content.startsWith("|");
        };

        this.isFirstLine = this.number === 0;
        this.isLastLine = isLastLine;
    };
};



function formatToHTML(string) {
    let stringLines = string.split("\n");
    let tmpDebugString = "";
    let tmpLines = [];
    stringLines.forEach((stringLine, number) => {
        tmpLines.push(new Line(stringLine, number, stringLines.length - 1 === number));
        tmpDebugString += `${number}: ${stringLine}\n`;
    });

    console.log(tmpDebugString);

    const lines = tmpLines;
    console.log(lines);

    let inBulletList = false;
    let inNumberedList = false;
    let inCode = false;
    let previousLineWasEmpty = false;
    let inTable = false;


    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber];


        // Processing heading
        if (line.isHeading) {
            console.log("Heading!", line.number);
            continue;
        };

        // Processing list
        if (line.isBulletListItem) {
            inBulletList = true;
        }

        // Check if list was left
        else if (inBulletList) {
            const leftBulletListWithNewLine = previousLineWasEmpty && line.number !== 2 && !lines[line.number - 2].isBulletListItem;
            const leftBulletList = !lines.isNumberListItem && !lines.isEmpty;
    
            if (leftBulletList || leftBulletListWithNewLine) {
                inBulletList = false;
                console.log("Left bullet list", line.number);
            }

        };

        // Processing numbered list
        if (isNumberedListItem(line.content)) {
            inNumberedList = true;
            
        }

        else if (inNumberedList) {
            const leftNumberedListWithNewLine = line.isEmpty && !lines.isFirstLine && lines[line.number - 1].isNumberListItem;
            const leftNumberedListWithOtherLine = !line.isEmpty || !line.isNumberListItem;

            if (leftNumberedListWithNewLine || leftNumberedListWithOtherLine) {
                inNumberedList = false;
                console.log("Left number list", line.number);
            }

            
        };


        // Code processing
        if (line.isCodeStartOrEnd) {
            inCode = !inCode;

            if (inCode)
                console.log("In code", line.number);

            else
                console.log("Exited code", line.number);
        };


        // Table processing
        if (line.isTable) {
            console.log("Table!", line.number);
        }


        previousLineWasEmpty = line.content === "";

    };
};


















































const testingData = `Quantum physics, also known as quantum mechanics, is a branch of physics that studies the behavior of matter and energy at an atomic and subatomic level. At these scales, the classical laws of physics no longer apply, and strange, seemingly random phenomena govern the behavior of particles.

**Key Principles of Quantum Physics:**

1. **Wave-Particle Duality**: Quantum objects, such as electrons, can exhibit both wave-like and particle-like behavior depending on how they are observed.
2. **Uncertainty Principle**: It is impossible to know certain properties of a quantum object, such as its position and momentum, simultaneously with infinite precision.
3. **Superposition**: Quantum objects can exist in multiple states simultaneously, which is known as a superposition of states.
4. **Entanglement**: Quantum objects can become "entangled" in a way that the state of one object is dependent on the state of the other, even if they are separated by large distances.
5. **Quantum Tunneling**: Particles can pass through barriers or walls without being affected by them, which is known as quantum tunneling.

**Types of Quantum Phenomena:**

1. **Schrödinger's Cat**: A thought experiment that illustrates the concept of superposition and the idea that quantum objects can exist in multiple states at once.
2. **Quantum Eraser**: An experiment that demonstrates the concept of entanglement and how it can be used to "erase" information about a quantum object's state.
3. **Entangled Particles**: Two particles that are connected in such a way that their properties are correlated, even if they are separated by large distances.

**Applications of Quantum Physics:**

1. **Transistors**: The foundation of modern electronics, transistors rely on quantum physics to control the flow of electricity.
2. **Lasers**: Lasers use quantum physics to amplify light and create a concentrated beam.
3. **Computer Chips**: The tiny transistors used in computer chips are made possible by quantum physics.
4. **Magnetic Resonance Imaging (MRI)**: MRI machines rely on quantum physics to create detailed images of the body.
5. **Quantum Computing**: Quantum computers use quantum physics to perform calculations that are beyond the capabilities of classical computers.

**Theories and Models:**

1. **Wave Function**: A mathematical description of a quantum system's state, which is used to predict its behavior.
2. **Schrödinger Equation**: A mathematical equation that describes the time-evolution of a quantum system.
3. **Heisenberg Uncertainty Principle**: A fundamental principle that states it is impossible to know certain properties of a quantum object simultaneously with infinite precision.

**Open Questions and Debates:**

1. **Interpretation of Quantum Mechanics**: There are many different interpretations of quantum mechanics, including the Copenhagen interpretation, the Many-Worlds Interpretation, and the pilot-wave theory.
2. **Quantum Gravity**: A long-standing problem in physics, quantum gravity seeks to merge quantum mechanics with general relativity.
3. **Black Hole Information Paradox**: A paradox that arises when considering what happens to information contained in matter that falls into a black hole.

In summary, quantum physics is a branch of physics that studies the behavior of matter and energy at an atomic and subatomic level. It has led to many innovative technologies and continues to be an active area of research with many open questions and debates.

And now the LLM response ended, so I added some more:

* Bullet 1
* Bullet 2
* Bullet 3
* Bullet 4

\`\`\`
print("Hello World!")


\`\`\`

And here comes a table, generated by AI:

| Column Name | Data Type |
| --- | --- |
| Customer ID | Integer |
| Name | String |
| Email | String |


`


formatToHTML(testingData);