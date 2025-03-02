/**
 * Converts inline markdown to HTML
 *
 * @param {string} markdown - The string to check.
 * @returns {string} True if the line is a numbered list item, false otherwise.
 */
function formatInlineMarkdownToHTML(markdown) {
    const iterator = new AdvancedIterator(markdown);

    let inBold = false;
    let inItalic = false;
    let string = "";

    iterator.forEach(() => {
        const iteration =  iterator.getIteration();

        if (checkIfStartOfSequence(iterator, "**")) {
            iterator.moveIterator(1);
            inBold = !inBold;
            if (inBold)
                string += "<b>";
            else
                string += "</b>";

            return;
        };


        if (checkIfStartOfSequence(iterator, "*")) {
            inItalic = !inItalic;
            if (inItalic)
                string += "<i>";
            else 
                string += "</i>";

            return;
        };

        if (checkIfStartOfSequence(iterator, "http")) {
            let linkString = iteration.element;
            while (true) {
                if (!iterator.continue()) {
                    break;
                }
                const iteration = iterator.getIteration();

                
                if (iteration.element === " ")
                    break;

                linkString += iteration.element;
            };

            string += "<a>"+linkString+"</a>";
            return;
        };

        string += iterator.getIteration().element;
    });
    return string;
};


/**
 * TBD
 *
 * @param {AdvancedIterator} iterator - An iterator for the string to check.
 * @returns {bool} True if the line is a numbered list item, false otherwise.
 */
function checkIfStartOfSequence(iterator, sequence) {
    if (iterator.getElementsLeft() < sequence.length - 1) {
        return false;
    };
    
    for (let i = 0; i < sequence.length; i++) {
        if (iterator.getIteration(i).element !== sequence[i])
            return false;
    };

    return true;
};

setTimeout(() => {
    formatInlineMarkdownToHTML("This *is* a **test** https://en.wikipedia.org/wiki/24_Hours_of_Le_Mans#");
}, 1000);