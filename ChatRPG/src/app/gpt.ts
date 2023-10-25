// This is the OpenAI GPT Integration part

export interface GptMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }
  
let systemPrompt = ""
let apiKey = ""

function initConfigs(){
  fetch("http://localhost:4200/assets/secret_api.key").then(
    async(response)=> {
      apiKey= await response.text();
    })
  fetch("http://localhost:4200/assets/prompt.txt").then(
    async(response)=> {
      systemPrompt= await response.text();
    })
}

initConfigs();

export async function* streamChatResponse(messages: GptMessage[]) {
  if (!apiKey) {
    throw new Error("No API Key has been set! Set your OpenAI key in the file 'assets/secret_api.key'");
  }

  const system_message: GptMessage = {role:"system", content:systemPrompt}
  const all_messages = [system_message, ...messages]

  const reader = await callOpenAI(all_messages);
  
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
  const lines = decodedChunk.split('\n');
  const trimmedData = lines.map(line => line.replace(/^data: /, "").trim());
  const filteredData = trimmedData.filter(line => !["", "[DONE]"].includes(line));
  const parsedData = filteredData.map(line => JSON.parse(line));
  
  return parsedData;
}