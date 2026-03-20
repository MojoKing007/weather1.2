async function getWeather() {
    const city = document.getElementById("cityInput").value;

    if (city === "") {
        alert("Enter a city name");
        return;
    }

    const url = `/.netlify/functions/weather?city=${city}`;
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

        const aiText = await getAIWeatherComment(
            data.name,
            data.main.temp,
            data.weather[0].description
        );

        document.getElementById("ai").innerText = aiText;
        document.getElementById("speakBtn").style.display = "block";

    } catch (error) {
        alert("Error fetching data");
        console.log(error);
    }
}

function speakAI() {
    const text = document.getElementById("ai").innerText;
    speak(text);
}

async function getAIWeatherComment(city, temp, desc) {
    try {
        const response = await fetch("/.netlify/functions/ai-comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ city, temp, desc })
        });

        const data = await response.json();

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
    const utterance = new SpeechSynthesisUtterance(text);

    const setVoiceAndSpeak = () => {
        const voices = speechSynthesis.getVoices();
        utterance.voice = voices.find(v => v.name.includes("Google"))
            || voices.find(v => v.name.includes("Female"))
            || voices[0];
        utterance.rate = 0.95;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length > 0) {
        setVoiceAndSpeak();
    } else {
        speechSynthesis.onvoiceschanged = setVoiceAndSpeak;
    }
}