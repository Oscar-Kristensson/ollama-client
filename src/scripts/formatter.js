function importFormatter() {
    class ListContainer {
        constructor (parent, type) {
            this.type = type;
            switch (this.type) {
                case "bullet":
                    this.container = document.createElement("ul");
                    break;

                case "number":
                    this.container = document.createElement("ol");
                    break;
                
            };

            parent.appendChild(this.container);
            
        };

        addBulletPoint(string) {
            const tempContainer = document.createElement("li");

            tempContainer.innerText = string;
            this.container.appendChild(tempContainer);

        };

    }



    class Paragraph {
        constructor (parent, string) {
            this.container = document.createElement("p");
            this.processString(string);
            parent.appendChild(this.container);
            
        };


        #stringEndsWith(string, substring) {
            let lastPartOfString = string.slice(string.length - substring.length, string.length);
            return lastPartOfString == substring;
        };

        processString(string) {
            let newString = "";
            if (string.includes("**")) {
                const splitString = string.split("**");
                let inBold = false;
                splitString.forEach((value, i) => {
                    if (inBold) 
                        newString += "<b>";
                    else
                        newString += "</b>";
                    newString += value;

                    
                    inBold = !inBold;
                });
            } else 
                newString = string;

            this.container.innerHTML = newString;
        };
    };


    function formatToHTML(container, string) {
        container.classList.add("formattedParagraph");
        
        const rawParagraphs = string.split("\n");
        let tempBulletList = undefined;
        let tempNumberedList = undefined;


        // This is a pretty jainky solution should be improved
        rawParagraphs.forEach((rawParagraph) => {
            if (rawParagraph == "") return;

            // Bullet list
            if (rawParagraph[0] === "*" || rawParagraph[0] === "•") {
                if (tempBulletList === undefined) {
                    tempBulletList = new ListContainer(container, "bullet");
                    
                };
                tempBulletList.addBulletPoint(rawParagraph.slice(1, rawParagraph.length));
                return;

            };
            tempBulletList = undefined;


            // Numbered list
            if (/^\d$/.test(rawParagraph[0])) {
                let i = 1;
                while (/^\d$/.test(rawParagraph[i]))
                    i++;
                console.log(rawParagraph[i], i)
                if (rawParagraph[i] === "."){
                    if (tempNumberedList === undefined)
                        tempNumberedList = new ListContainer(container, "number");

                    console.log(rawParagraph);

                    tempNumberedList.addBulletPoint(rawParagraph.slice(i + 1, rawParagraph.length));
                    return;
                };


            };
            
            tempNumberedList === undefined;

            new Paragraph(container, rawParagraph);
        });

    };



    const exports = {};
    exports.formatToHTML = formatToHTML;
    return exports;
    
};