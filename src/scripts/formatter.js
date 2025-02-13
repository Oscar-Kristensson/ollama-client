function importFormatter() {
    class Paragraph {
        constructor (parent, string) {
            this.container = document.createElement("p");
            this.processString(string);
            parent.appendChild(this.container);
            
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
        rawParagraphs.forEach((rawParagraph) => {
            if (rawParagraph == "") return;
            new Paragraph(container, rawParagraph);
        });

    };



    const exports = {};
    exports.formatToHTML = formatToHTML;
    return exports;
    
};