# Ollama-client
Ollama-client is a client for running local LLM:s, like llama3.2 and Deepseek-R1, through [Ollama](https://ollama.com/) without having to use the CLI. In the future, more advanced features are (hopefully) going to be added. 

## Installation
> **Note:** Inorder to run ollama-client, you need to have [Ollama](https://ollama.com/) installed and running the HTTP server. The later will hopefully be resolved in a future update. 


### Running the development environment
Ollama-client is run with node.js and electron. Inorder to run ollama-client you need to have installed:
- Node.js
- npm


#### Cloning the project
Clone the repository by running the following command in the directory where the project should be added:

``` bash
git clone https://github.com/Oscar-Kristensson/ollama-client.git
```

#### Installing dependencies
To run ollama-client, you need to install dependencies. Install electron by running the following command:
``` bash
npm i electron -D
```

To run the application, use the following command:
``` bash
npm start
```


### Building the project from source
Inorder to build the project from source, you will first need to be able to [run the app in the development environment](#running-the-development-environment). If the app runs, you are ready to build the app by running the following command:

``` bash
npm run make
```

### Windows/Mac/Linux standalone
Unzip the program and click the ollama-client executable app (depending on your operating system).


### Running with an HTTP server/directly in a browser
TBD