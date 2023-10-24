import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: 'My API Key', // defaults to process.env["OPENAI_API_KEY"]
  });

async function* streamResponse(messages: string[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: 'Say this is a test' }],
    stream: true,
  });
  for await (const part of stream) {
    const chunk = part.choices[0]?.delta?.content || '';
    yield chunk;
  }
}