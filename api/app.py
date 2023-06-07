# create a flask api
import random
import flask
from flask import request, jsonify
from flask_cors import CORS
import time
import os
from dotenv import load_dotenv
load_dotenv()

app = flask.Flask(__name__)
app.config["DEBUG"] = True
CORS(app)


def get_random_message():
    """Returns a random message from the list of messages"""
    message_list = [
        "Brilliant!",
        "You are a genius!",
        "You are a star!",
        "You are a rock star!",
        "You are a super star!",
        "That's the way to do it!",
        "You are a legend!",
        "You are a super hero!",
        "Awesome!",
        "You are a super star!",
        "You are a rock star!",
        "That's amazing!",
        "When you are good, you are very good!"]
    
    return message_list[random.randint(0, len(message_list) - 1)]


SYSTEM_MESSAGE = "You are an AI assistant that helps people find information."

def get_openai_chat_completion(message_dict_list):
    #Note: The openai-python library support for Azure OpenAI is in preview.
    import os
    import openai
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

# A route to return all of the available entries in our catalog.
# This is a route decorator, it tells flask what url should trigger our function
@app.route('/message', methods=['POST'])
def home():

    # get the body of the request and convert it to a python dictionary
    message_list = request.get_json()
    
    chat_response = get_openai_chat_completion(message_list)
    return jsonify({'message': chat_response,
                    'username': 'AI Bot'})
