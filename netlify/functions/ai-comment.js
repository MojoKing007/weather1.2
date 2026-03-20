exports.handler = async (event) => {
    const { city, temp, desc } = JSON.parse(event.body);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                { role: "system", content: "You are a sarcastic and witty weather assistant. Keep responses short, funny, and slightly savage. Keep your response a little Desi." },
                { role: "user", content: `The weather in ${city} is ${temp}°C with ${desc}.` }
            ],
            temperature: 0.7,
            max_tokens: 50
        })
    });

    const data = await response.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};