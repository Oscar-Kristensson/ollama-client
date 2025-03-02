/**
 * Checks if a given string represents a bullet list item.
 * 
 * A bullet list item starts with either an asterisk (*) or a bullet (•) character.
 *
 * @param {string} line - The string to check.
 * @returns {boolean} True if the line is a bullet list item, false otherwise.
 */
function isBulletListItem(line) {
    return line.startsWith("*") || line.startsWith("•");
}

/**
 * Checks if a given string represents a numbered list item.
 * 
 * A numbered list item consists of numbers followed by optional decimal points.
 *
 * @param {string} line - The string to check.
 * @returns {boolean} True if the line is a numbered list item, false otherwise.
 */
function isNumberedListItem(line) {
    for (let charNumber = 0; charNumber < line.length; charNumber++) {
        const char = line[charNumber];

        // If we encounter a non-digit character and it's not at the start of the line, return false
        if (!Utils.isNumber(char)) {
            return char === "." && charNumber !== 0;
        }
    }

    // If we've iterated over the entire line without returning false, it's not a numbered list item
    return false;
};






class HTMLFormattedObjectInterface {
    constructor (tag = "div") {
        this.lines = [];
        this.container = document.createElement(tag);
        this.isFinished = false;
    };

    addLine(line) {
        if (!line instanceof Line) {
            console.warn("Can not add a line that is not of type Line");
            return;
        };

        this.lines.push(line);
    };

    finished () {
        this.isFinished = true;
        this.onfinished();

    }; 
    
    onfinished() {
        this.container.innerHTML = formatInlineMarkdownToHTML(this.lines.toString());
        // Overide this function in the children
    };

    getObject() {
        return this.container;
    };
};


class BulletList extends HTMLFormattedObjectInterface {
    constructor() {
        super("ul");
    };

    #trimLine(line) {
        return line.content.slice(1);
    };

    onfinished () {
        this.isFinished = true;
        this.lines.forEach(line => {
            const bulletPointContainer = document.createElement("li");
            bulletPointContainer.innerHTML = formatInlineMarkdownToHTML(this.#trimLine(line));
            this.container.appendChild(bulletPointContainer);

        });
    };
};



class NumberedList extends HTMLFormattedObjectInterface {
    constructor() {
        super("ol");
    };

    #trimLine(line) {
        let startStringLength = 0;
        for (let charNumber = 0; charNumber < line.content.length; charNumber++) {
            const char = line.content[charNumber];

            if (!Utils.isNumber(char) && char === ".") {
                startStringLength = charNumber;
                break;
            };
        };

        return line.content.slice(startStringLength + 2);
    };


    onfinished() {
            this.lines.forEach(line => {
            const bulletPointContainer = document.createElement("li");
            let test = this.#trimLine(line);

            bulletPointContainer.innerHTML = formatInlineMarkdownToHTML(test); 
            this.container.appendChild(bulletPointContainer);

        });
    };
};



class Paragraph extends HTMLFormattedObjectInterface {
    constructor() {
        super("p");
    };

    onfinished() {
        let htmlContent = "";
        this.lines.forEach((line, index) => {
            if (index !== 0)
                htmlContent += "<br>";
            htmlContent += line.content;
        });

        this.container.innerHTML = formatInlineMarkdownToHTML(htmlContent);
    };
};


class Heading extends HTMLFormattedObjectInterface {
    constructor() {
        super("h1");
    };

    onfinished() {
        let string = this.lines[0].content.slice(2, this.lines[0].content.length - 2);

        this.container.innerHTML = formatInlineMarkdownToHTML(string);
    };
};


class Table extends HTMLFormattedObjectInterface {
    constructor() {
        super("table");
    };

    onfinished() {
        this.lines.forEach((line, index) => {
            const isLastRow = index + 1 === this.lines.length;
            let row = document.createElement("tr")
            const isHeaderRow = line.content.includes("| --- |");
            const nextIsHeaderRow = !isLastRow && this.lines[index + 1].content.includes("| --- |");

            if (isHeaderRow)
                return;

            let tagName = "td";
            if (nextIsHeaderRow)
                tagName = "th";

            let columns = line.content.split("|");
            delete columns[0];
            delete columns[columns.length - 1];

            columns.forEach(column => {
                const tdOrTh = document.createElement(tagName);
                tdOrTh.innerText = formatInlineMarkdownToHTML(column);
                row.appendChild(tdOrTh);
            });

            this.container.appendChild(row);
        });
    };
};

class Code extends HTMLFormattedObjectInterface {
    constructor() {
        super("div");
        this.container.className = "code";

    };

    onfinished() {
        let firstLine = this.lines[0];
        let codeLines = this.lines.slice(2);

        let codeString = "";
        codeLines.forEach((line, lineNumber) => {
            codeString += line.content;
            if (lineNumber !== codeLines.length - 1)
                codeString += "\n";
        });

        this.container.innerText = codeString;
    };
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



function formatToHTML(string, container) {
    let stringLines = string.split("\n");
    let tmpLines = [];
    stringLines.forEach((stringLine, number) => {
        tmpLines.push(new Line(stringLine, number, stringLines.length - 1 === number));
    });


    const lines = tmpLines;
    delete tmpLines;

    let inBulletList = false;
    let currentBulletListObject = undefined;

    let inNumberedList = false;
    let currentNumberedListObject = undefined;

    let inCode = false;
    let currentCodeObject = undefined;

    let previousLineWasEmpty = false;

    let currentParagraphObject = undefined;
    let inParagraph = false;

    let inTable = false;
    let currentTableObject = undefined;


    let HTMLContent = [];


    for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
        const line = lines[lineNumber];


        // Processing heading
        if (line.isHeading) {
            const heading = new Heading();
            heading.addLine(line);
            heading.finished();
            HTMLContent.push(heading);
            continue;
        };

        // Processing list
        if (line.isBulletListItem) {
            if (!inBulletList) {
                currentBulletListObject = new BulletList();
                HTMLContent.push(currentBulletListObject);
                
            };
            currentBulletListObject.addLine(line);

            inBulletList = true;
        }

        // Check if list was left
        else if (inBulletList) {
            const leftBulletListWithNewLine = previousLineWasEmpty && line.number !== 2 && !lines[line.number - 2].isBulletListItem;
            const leftBulletList = !lines.isNumberListItem && !lines.isEmpty;
    
            if (leftBulletList || leftBulletListWithNewLine) {
                inBulletList = false;
                currentBulletListObject.finished();
            };

        };

        // Processing numbered list
        if (line.isNumberListItem) {
            if (!inNumberedList) {
                currentNumberedListObject = new NumberedList();
                HTMLContent.push(currentNumberedListObject);
            }
            inNumberedList = true;
            
        }

        else if (inNumberedList) {
            const leftNumberedListWithNewLine = line.isEmpty && !lines.isFirstLine && lines[line.number - 1].isNumberListItem;
            const leftNumberedListWithOtherLine = !line.isEmpty || !line.isNumberListItem;

            if (leftNumberedListWithNewLine || leftNumberedListWithOtherLine) {
                inNumberedList = false;
                currentNumberedListObject.finished();
            }

            
        };

        if (inNumberedList)
            currentNumberedListObject.addLine(line);


        // Code processing
        
        if (line.isCodeStartOrEnd) {
            inCode = !inCode;
            
            if (inCode) {
                currentCodeObject = new Code();
                HTMLContent.push(currentCodeObject);
                currentCodeObject.addLine(line);
            }
            
            else {
                currentCodeObject.finished();
                continue;
            };
        };
        
        if (inCode)
            currentCodeObject.addLine(line);
        
        // Table processing
        if (line.isTable) {
            if (!inTable) {
                currentTableObject = new Table();
                HTMLContent.push(currentTableObject);
            };

            currentTableObject.addLine(line);

            inTable = true;
            
        } else if (inTable) {
            currentTableObject.finished();
            inTable = false;
        };


        // Normal paragraph
        const enterdParagraph = !(inBulletList || inNumberedList || inCode || line.isTable) && !inParagraph && !line.isEmpty;
        const leftParagraph = ((inBulletList || inNumberedList || inCode || line.isTable) && inParagraph) || (inParagraph && line.isEmpty);

        if (enterdParagraph) {
            currentParagraphObject = new Paragraph();
            HTMLContent.push(currentParagraphObject);
            inParagraph = true;
        }

        else if (leftParagraph) {
            inParagraph = false;
            currentParagraphObject.finished();
        };


        if (inParagraph)
            currentParagraphObject.addLine(line);




        previousLineWasEmpty = line.content === "";

    };


    [currentBulletListObject, currentNumberedListObject, currentParagraphObject, currentTableObject, currentCodeObject].forEach(object => {
        if (object === undefined)
            return;
        if (!object.isFinished)
            object.finished();
    });

    HTMLContent.forEach(object => {
        container.appendChild(object.getObject());
    });
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



document.addEventListener("DOMContentLoaded", () => {
    return;
    formatToHTML(testingData, testContainer);
});
