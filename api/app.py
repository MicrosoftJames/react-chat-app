import flask
import os
import openai
from flask import request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)

SYSTEM_MESSAGE = "You are an AI assistant that helps people find information."

def get_openai_chat_completion(message_dict_list):
    """Returns a chat response from OpenAI's API.

    Args:
        message_dict_list (list): A list of dictionaries containing historical messages.
    
    Returns:
        str: A string containing the chat response.
    """
    openai.api_type = "azure"
    openai.api_base = os.environ["OPENAI_API_BASE"]
    openai.api_version = "2023-03-15-preview"
    openai.api_key = os.environ["OPENAI_API_KEY"]

    response = openai.ChatCompletion.create(
    engine="gpt-35-turbo",
    messages = [{"role": "system","content": SYSTEM_MESSAGE}] + message_dict_list,
    temperature=0.1,
    max_tokens=800,
    top_p=0.95,
    frequency_penalty=0,
    presence_penalty=0,
    stop=None)

    return response["choices"][0]["message"]["content"]

@app.route('/message', methods=['POST'])
def home():
    """Returns a chat response from OpenAI's API. """
    message_list = request.get_json()
    chat_response = get_openai_chat_completion(message_list)
    return jsonify({'message': chat_response,
                    'username': 'AI Bot'})
