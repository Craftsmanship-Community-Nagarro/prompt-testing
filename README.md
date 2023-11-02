# About
This is a very basic Demo application showcasing how to evaluate and automatically test prompts in LLM-based applications.

You can follow the excercises to get a feeling about test assisted prompt tuning.
For an introduction to this topic I can recommend this video presentation of Josh Tobin: [Evaluationg LLM-based Applications](https://www.youtube.com/watch?v=2CIIQ5KZWUM).

# Getting started

## Setup the application

Requirements:
- install node.js
- install npm
- npm install -g @angular/cli

git clone https://github.com/Craftsmanship-Community-Nagarro/prompt-testing.git

Setup your OpenAI API Key: 
- go to the file /ChatRPG/src/assets
- create a file named secret_api.key
- copy your OpenAI API Key
- paste the API Key into the file secret_api.key
Make soure you don't accidentally commit the secret to git.

Start the application:
- open command line
- go to the folder /ChatRPG
- execute *ng serve*

## Setup Prompt Testing
We are going to use the promptfoo library to write prompt tests.

- create an environment variable name -> OPENAI_API_KEY, value -> your API key ([alternative configuration](https://www.promptfoo.dev/docs/providers/openai/#configuring-parameters))
- open command line and install promptfoo globally, make sure you use this version:
    - npm install -g promptfoo@0.26.0
- try test execution run: *promptfoo eval*
    - initially you should have one successful and one failing test
- view the results in the GUI: *promptfoo view*
    - you can open this in a separate terminal

A note about promptfoo:
You could write the tests on your own, without an extra library, but using promptfoo features can make things simpler.
There are also other tools to do testing. Promptfoo has the benefit of being opensource and lightweight. It supports both javascript and python for programming it.

# Code excersises

Open backlog.txt, which contains work items as excersises.
Implement the work items, Start with work item 1.

# Disclaimer

You can copy parts of the code, but don't use this code, as it is, for production applications.
In particular be careful with handling your OpenAI API Key, cause unintended usage can result in a lot of cost.
