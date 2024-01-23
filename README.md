# feynman-agent

## What is it?

The Feynman method of learning has been shown to be the most successful method for learning, here we are trying to digitalize this process for the sake of a more personal and efficient education

## Why Feynman agent?

It is honestly hard to find someone else to teach, and even if you found someone, it will be useful to have an AI partner to help you practice explaining concepts, or to even help you plan your flow

Feynman’s Agent aims to help you

- project based learning
- prepare and research content
- test content and explanations
- teach you how to teach others
- available on youtube videos and any pages
- variation of character types through prompts

ChatGpt can already sort of do it for you but we can definitely make it better

## Dev stack

Frontend

- React Typescript

Backend is fully Azure

- Serverless functions
- Cosmos DB

## Local environment setup

- For frontend, rename the .env.local file to .env
- For backend, rename the local.settings.json.local file to local.settings.json

### Connecting to Azure DB
If you work on a feature involving the db, you might need to set this up, alternatively **just mock the data in the frontend**
- Replace your own Azure Cosmos DB connection string (endpoint and key) to the local.settings.json file, we each need our own accounts if we want to see the database on the cloud
- Run the `api/init_db.py` script to initialize your own database so you can see it
   
## Start the backend locally

- Use vscode
- Install Azure Functions extension
- Install Azurite Service extension
- Go to Azure extensions and double click on function, it will launch

## Starting the frontend

To start the frontend

```bash
cd feynman-agent-frontend
bun dev
```
