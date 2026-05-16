const apiKey = "43ec5faff1cc75c6c7db7c79d7e0a98b";

async function fetchWeather() {
    const cityInputEl = document.getElementById("city-input");
    const weatherInfo = document.getElementById("weather-info");
    const welcomeMsg = document.getElementById("welcome-msg");

    if (!cityInputEl) return;
    const city = cityInputEl.value;

    if (!city) {
        alert("Please enter a city name");
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) throw new Error("City not found. Check your spelling!");

        const data = await response.json();
        
        // Render data to screen
        document.getElementById("city-display").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp);
        document.getElementById("desc-display").innerText = data.weather[0].description;
        document.getElementById("humidity-display").innerText = `${data.main.humidity}%`;
        document.getElementById("wind-display").innerText = `${data.wind.speed} km/h`;
        document.getElementById("date-display").innerText = new Date().toLocaleDateString();

        // Reveal the stats dashboard card
        weatherInfo.classList.remove("hidden");
        welcomeMsg.classList.add("hidden");

    } catch (error) {
        alert(error.message);
    }
}
