const apiKey = "4ea153eb0012e0dd0b60999cf4d21e78";

async function getWeather() {
    const city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Enter a city name");
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.cod !== 200) {
            alert(data.message);
            return;
        }

        document.getElementById("city").innerText = `City: ${data.name}`;
        document.getElementById("temp").innerText = `Temperature: ${data.main.temp}°C`;
        document.getElementById("desc").innerText = `Weather: ${data.weather[0].description}`;
        document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
        document.getElementById("wind").innerText = `Wind Speed: ${data.wind.speed} m/s`;



        const weatherMain = data.weather[0].main.toLowerCase();

        if (weatherMain.includes("cloud")) {
            document.body.style.background = "#d3d3d3";
        } else if (weatherMain.includes("rain")) {
            document.body.style.background = "#5f9ea0";
        } else if (weatherMain.includes("clear")) {
            document.body.style.background = "#f7b733";
        } else {
            document.body.style.background = "#4facfe";
        }

        // 🤖 AI COMMENT (NEW)
        const aiText = await getAIWeatherComment(
            data.name,
            data.main.temp,
            data.weather[0].description
        );

        document.getElementById("ai").innerText = aiText;
        speak(aiText);

    } catch (error) {
        alert("Error fetching data");
        console.log(error);
    }
}

const groqApiKey = "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";

async function getAIWeatherComment(city, temp, desc) {
    const prompt = `The weather in ${city} is ${temp}°C with ${desc}. Give a short friendly suggestion.`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqApiKey}`
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
        console.log("Groq:", data);

        if (data.error) {
            return "AI error: " + data.error.message;
        }

        return data.choices[0].message.content;

    } catch (error) {
        console.log(error);
        return "AI error";
    }
}

function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);

    const voices = speechSynthesis.getVoices();

    // Try finding a natural voice
    speech.voice = voices.find(v => v.name.includes("Google"))
        || voices.find(v => v.name.includes("Female"))
        || voices[0];

    speech.rate = 0.95;
    speech.pitch = 1;

    speechSynthesis.speak(speech);
}