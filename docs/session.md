# What are LLMs?

From an application developer point of view we can think of LLMs as a black box where we send in text and get back text:

![LLM](image.png)
![LLM2](image-1.png)
Images from https://exemplary.ai/blog/llm-history-usecases

What can it be used for?

![Alt text](image-2.png)
Image from https://txt.cohere.com/llm-use-cases/

You could call an LLM via an API, e.g. HTTP API.
You could run the LLM locally, but hardware demand could be high.
There are open source and closed source LLMs.

The best performing current open source models:
- LLMs based on the llama family:
    - Llama 2, code llama, vicuna, alpaca, orca 
- Mistral, Zaphyr
- Falcon

Companies with closed source models, usable via APIs:
- OpenAI GPT models
- Anthropic
- Google
- Cohere
- AI21
- Aleph Alpha

And there are many more players in the field...

# AI4T Quality Copilot

- Introduction to the application
    - copilot helping getting from requirements to test scripts
    - imporove and generate requirements, test cases, test steps, test scripts
- prompt management
- manual prompt evaluation
- difficulties with prompt-tuning
    - figuring out user intent in the chat
        - integration actions for editing data
    - generating gherkin
- automatic prompt testing

# Prompt evaluation
