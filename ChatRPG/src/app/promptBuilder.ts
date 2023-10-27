import { Character, ChatMessage, GptMessage } from "./models";

let systemPrompt = ""

function initConfigs(){
    fetch("http://localhost:4200/assets/prompt.txt").then(
      async(response)=> {
        systemPrompt= await response.text();
        systemPrompt = systemPrompt.replace("User: {{message}}", "")
      })
  }
  
initConfigs();

export function buildPromptMessages(messages: ChatMessage[], character: Character): GptMessage[] {
    let systemPromptFormatted = systemPrompt;
    const promptVariables = objectToDictionary(character);
    for(const varKey in promptVariables){
      systemPromptFormatted = 
        systemPromptFormatted.replace(`{{${varKey}}}`, promptVariables[varKey]);
    }
  
    const system_message: GptMessage = {role:"system", content:systemPromptFormatted}
    const all_messages = [system_message, ...messages]

    return all_messages
}

function objectToDictionary(myObject: any): { [key: string]: string } {
    const variables: { [key: string]: string } = {};
    for (const property in myObject) {
      if (typeof myObject[property] === 'string') {
        variables[property] = myObject[property] as string;
      }
    }
    return variables;
  }
