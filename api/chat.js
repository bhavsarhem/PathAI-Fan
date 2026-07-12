import { queryVectorDB } from './vectorStore.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 1. Retrieve context from our VectorDB
  const stadiumContext = queryVectorDB(message);

  // 2. Call Groq API
  try {
    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          {
            role: 'system',
            content: `You are the FIFA Arena 26 AI Assistant. Be concise, helpful, and polite. 
Use the following retrieved context from the stadium database to answer the user's question:

--- STADIUM CONTEXT ---
${stadiumContext}
-----------------------

If the context doesn't have the answer, just give a helpful general answer.
If the user asks to navigate somewhere (like washroom, food, SOS, exit), append a ROUTE command at the very end of your response, e.g., ROUTE:/fan/washroom, ROUTE:/fan/food, ROUTE:/fan/parking, ROUTE:/fan/exit, ROUTE:/fan/sos, ROUTE:/fan/find-person, ROUTE:/fan/women-safety, ROUTE:/fan/seat, ROUTE:/fan/emergency.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.3,
        max_tokens: 256
      })
    });

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      console.error("Groq API Error:", errText);
      return res.status(500).json({ error: 'Error communicating with AI service' });
    }

    const data = await groqResponse.json();
    let reply = data.choices[0].message.content;

    // 3. Parse routing if the AI provided one
    let route = null;
    const routeMatch = reply.match(/ROUTE:(\/[a-zA-Z0-9\-/]+)/);
    if (routeMatch) {
      route = routeMatch[1];
      reply = reply.replace(routeMatch[0], '').trim();
    }

    res.status(200).json({ reply, route });

  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
