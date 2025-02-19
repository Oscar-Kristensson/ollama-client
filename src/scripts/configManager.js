// Load config file
let config = undefined;


function checkAndFillOptions(element, key, defaultValue) {
    if (!element.hasOwnProperty(key)) {
        element[key] = defaultValue;
        return true;
    };
    return false;
};

function validateConfig(config) {
    const defaultValues = [
        ["ipAddress", "http://127.0.0.1:11434/"], 
        ["favoriteModel", "?"]
    ]

    let hasChanged = false;

    for (let i = 0; i < defaultValues.length; i++) {
        const rv = checkAndFillOptions(config, defaultValues[i][0], defaultValues[i][1]);
        if (rv) hasChanged = true;
    };

    if (hasChanged) saveConfigFile();
};

function loadConfigFile() {
    return window.electronAPI.loadFile("save/config.json")
        .then(text => {
            config = JSON.parse(text);
            validateConfig(config);

    })
    .catch(error => {
        config = {};
        validateConfig(config);
    })
};

loadConfigFile()
    .then(() => {
        Ollama.initalize(config.ipAddress);
    })

function saveConfigFile() {
    return window.electronAPI.writeFile("save/config.json", JSON.stringify(config, null, 4));
};