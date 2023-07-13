## Overview
This is a simple project to demonstrate how React.js can be used in conjunction with Flask to create a simple chat application. The Flask application serves as a REST API for the React frontend to consume. The React frontend is a simple chat application that allows users to send messages to an OpenAI LLM.

## Installation
You can install the node modules for the React frontend by running `npm install` in the `chat-app` directory. You can install the Python dependencies for the Flask backend by running `pip install -r requirements.txt` in the `api` directory.

## Usage
To run the Flask backend, run `flask run` in the `api` directory. To run the React frontend, run `npm start` in the `chat-app` directory. The Flask backend will need to be running on port 5000 (the default port).