// This is the OpenAI GPT Integration part

import { GptMessage } from "./models";


let apiKey = ""

function initConfigs(){
  fetch("http://localhost:4200/assets/secret_api.key").then(
    async(response)=> {
      apiKey= await response.text();
    })
}

initConfigs();

export async function* streamChatResponse(messages: GptMessage[]) {
  if (!apiKey) {
    throw new Error("No API Key has been set! Set your OpenAI key in the file 'assets/secret_api.key'");
  }

  const reader = await callOpenAI(messages);
  
  let isStreaming = true;
  while (isStreaming) {
    const { done, value } = await reader.read();
    if (value) {
      const chunk = getChunk(value);
      yield chunk;
    }
    if(done) {
      isStreaming = false;
    }
  }
}

async function callOpenAI(messages: GptMessage[]) {
  const params = {      
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 2000,
      temperature: 0.2,};
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      ...params,
      stream: true,
    }),
  });

  if(!response.body){
      throw Error("Empty response body from OpenAI.")
  }

  return response.body.getReader();
}

const decoder = new TextDecoder("utf-8");

function getChunk(value: Uint8Array): string {
  const decodedChunk = decoder.decode(value);
  const lines = parse(decodedChunk);

  let chunk = "";
  for (let line of lines) {
    const { content } = line.choices[0].delta;
    if (content) {
      chunk += content;
    }
  }
  return chunk;
}

function parse(decodedChunk: string): any[] {
  try {
    const lines = decodedChunk.split('\n');
    const trimmedData = lines.map(line => line.replace(/^data: /, "").trim());
    const filteredData = trimmedData.filter(line => !["", "[DONE]"].includes(line));
    const parsedData = filteredData.map(line => JSON.parse(line));
    return parsedData;
  }
  catch(error) {
    console.log(`Error parsing chunk ${decodedChunk}`);
    throw error;
  }
}