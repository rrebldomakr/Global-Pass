const apiKey = "43ec5faff1cc75c6c7db7c79d7e0a98b";

// Global orchestrators for application network lifecycle
let debounceTimer = null;
let activeAbortController = null;

/**
 * CORE ENGINE: Async Fetch & Lifecycle Stream Management
 * Handles connection streams, payload transfers, and network cancellations.
 * @param {string} city - Target geographic location
 */
async function fetchWeather(city) {
    // 1. Lifecycle Clean-up: Abort any outstanding, stale network streams
    if (activeAbortController) {
        activeAbortController.abort();
        console.log(`%c Stream aborted for stale request context.`, 'color: #ffb300');
    }

    // 2. Establish a new AbortController instance for the current execution context
    activeAbortController = new AbortController();
    const { signal } = activeAbortController;

    const weatherInfo = document.getElementById("weather-info");
    const welcomeMsg = document.getElementById("welcome-msg");

    try {
        // Optional: You could add a loading state class here to make things feel snappy
        
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
        
        // 3. Pass the abort signal directly into the fetch configuration block
        const response = await fetch(endpoint, { signal });

        if (!response.ok) {
            throw new Error("City not found. Check your spelling!");
        }

        const data = await response.json();
        
        // 4. Successful execution path: Render server data onto screen elements
        document.getElementById("city-display").innerText = data.name;
        document.getElementById("temp-display").innerText = Math.round(data.main.temp);
        document.getElementById("desc-display").innerText = data.weather[0].description;
        document.getElementById("humidity-display").innerText = `${data.main.humidity}%`;
        document.getElementById("wind-display").innerText = `${data.wind.speed} km/h`;
        document.getElementById("date-display").innerText = new Date().toLocaleDateString();

        // Toggle visibility states
        if (weatherInfo) weatherInfo.classList.remove("hidden");
        if (welcomeMsg) welcomeMsg.classList.add("hidden");

    } catch (error) {
        // 5. Catch block differentiation: Do not trigger alerts for manual stream aborts
        if (error.name === 'AbortError') {
            console.log(`%c Execution successfully halted for stale city query: "${city}"`, 'color: #4fc3f7');
        } else {
            console.error('Operational fetch failure:', error);
            alert(error.message);
        }
    } finally {
        // 6. Nullify the controller reference if this specific stream finished running completely
        if (activeAbortController?.signal === signal) {
            activeAbortController = null;
        }
    }
}

/**
 * CONTROLLER ENGINE: Debounce Handler
 * Postpones execution until user finishes typing to prevent API spam.
 */
function handleSearchInput(event) {
    const query = event.target.value.trim();
    
    // Clear the execution timer on every single keystroke
    clearTimeout(debounceTimer);

    // If the input is emptied, we don't fire an empty network request
    if (!query) return;

    // Schedule execution only after 400ms of input silence
    debounceTimer = setTimeout(() => {
        fetchWeather(query);
    }, 400);
}

// --- EVENT LISTENERS ---

const cityInputEl = document.getElementById("city-input");

if (cityInputEl) {
    // Upgraded Interaction: Listens to live typing and triggers smart fetch
    cityInputEl.addEventListener("input", handleSearchInput);

    // Legacy/Accessibility Support: Instantly fires request if they press 'Enter' without waiting
    cityInputEl.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const query = event.target.value.trim();
            if (!query) {
                alert("Please enter a city name");
                return;
            }
            clearTimeout(debounceTimer); // Cancel any pending timed debounce execution
            fetchWeather(query); // Force instant fetch
        }
    });
}
