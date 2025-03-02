let languageIndexData = undefined;

const languageDataFolderPath = "scripts/formatter/languageData/";

fetch(languageDataFolderPath + "index.json")
.then(result => {
    return result.json();
})
.then(data => {
    console.log(data);
    languageIndexData = data;
})
.catch(error => {
    console.error("An error occured during fetching of 'scripts/formatter/languageData/index.json': " + error.message);
});


let languageData = {};


function loadLanguageData(language) {
    let pathLocation = `${languageDataFolderPath}${language}.json`;

    return new Promise((resolve, reason) => {
        fetch(pathLocation)
        .then(result => {
            console.log(result);
            return result.json();
        })
        .then(data => {
            languageData[language] = data;
            resolve();
        })
        .catch(error => {
            reason(error);
        })
    });
};



async function formatCode(language, code) {
    if (!languageData.hasOwnProperty(language)){
        await loadLanguageData(language)
        .catch(error => {
            console.error("An error occured when loading language data." + error.message);
            throw new Error(error.message);
        });
    };

    console.log("!!!", language);

    let keywordClasses = languageData[language];
    console.log(keywordClasses);
    
    let procssedCode = code;

    keywordClasses.forEach(keywordClass => {
        let color = keywordClass.color;
        console.log(keywordClass.name);
        keywordClass.content.forEach(keyword => {
            console.log(keyword);
            procssedCode = Utils.encapsulate(procssedCode, ` ${keyword} `, `<span style="color: ${color};">`, "</span>")
            procssedCode = Utils.encapsulate(procssedCode, `\n${keyword} `, `<span style="color: ${color};">`, "</span>")
        });   
    });


    return procssedCode;


    


};


window.addEventListener("DOMContentLoaded", () => {
    formatCode("python", "testing this key will it work")
    .then(result => {
        console.log("Test rv:", result);
    });
});