const apiKey = "43ec5faff1cc75c6c7db7c79d7e0a98b";

async function fetchWeather() {
    // CHECKPOINT 1: Does the button even work?
    alert("Checkpoint 1: The search button click was detected successfully!");

    const cityInputEl = document.getElementById("city-input");
    const weatherInfo = document.getElementById("weather-info");
    const welcomeMsg = document.getElementById("welcome-msg");

    // CHECKPOINT 2: Can JavaScript see the input box?
    if (!cityInputEl) {
        alert("CRITICAL ERROR: JavaScript cannot find an element with id='city-input' in your HTML!");
        return;
    }

    const city = cityInputEl.value;
    alert(`Checkpoint 2: Found the text box! You searched for: "${city}"`);

    if (!city) return alert("Please enter a city name");

    try {
        alert("Checkpoint 3: Sending request to OpenWeather servers now...");

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
        );

        alert(`Checkpoint 4: Server responded with status code: ${response.status}`);

        if (!response.ok) throw new Error("City not found. Check your spelling!");

        const data = await response.json();
        
        document.getElementById("city-display").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp);
        document.getElementById("desc-display").innerText = data.weather[0].description;
        document.getElementById("humidity-display").innerText = `${data.main.humidity}%`;
        document.getElementById("wind-display").innerText = `${data.wind.speed} km/h`;
        document.getElementById("date-display").innerText = new Date().toLocaleDateString();

        weatherInfo.classList.remove("hidden");
        welcomeMsg.classList.add("hidden");

        alert("Success! Everything rendered onto the screen.");

    } catch (error) {
        alert(`CATCH BLOCK TRIGGERED: ${error.message}`);
    }
}
