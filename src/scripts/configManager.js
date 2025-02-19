const defaultConfig = {
    "ipAddress": "http://127.0.0.1:11434/"
}

// Load config file
let config = undefined;

function loadConfigFile() {
    return window.electronAPI.loadFile("save/config.json")
        .then(text => {
            console.log("TEST");
            config = JSON.parse(text);    
    })
    .catch(error => {
        config = Object.assign({}, defaultConfig);
    })
};

loadConfigFile()
    .then(() => {
        Ollama.initalize(config.ipAddress);
    })

function saveConfigFile() {
    return window.electronAPI.writeFile("save/config.json", JSON.stringify(config, null, 4));
};

window.electronAPI.writeFile("save/output.txt", "data")
    .then(rv => {
        console.log(rv);
    });