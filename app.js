const apiKey = "43ec5faff1cc75c6c7db7c79d7e0a98b";

// Global orchestrators for application network lifecycle
let debounceTimer = null;
let activeAbortController = null;

// --- ADVANCED UPGRADE: Client-Side Cache Initialization ---
const weatherCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * CORE ENGINE: Async Fetch, Cache Verification, & Lifecycle Stream Management
 * Handles connection streams, local cache hits, and network cancellations.
 * @param {string} city - Target geographic location
 */
async function fetchWeather(city) {
    const normalizedCity = city.toLowerCase().trim();

    // 1. CACHE VERIFICATION LAYER (TTL Check)
    if (weatherCache.has(normalizedCity)) {
        const cachedData = weatherCache.get(normalizedCity);
        const currentTime = Date.now();

        // Check if the cached data is still fresh (within 5 minutes)
        if (currentTime - cachedData.timestamp < CACHE_TTL_MS) {
            console.log(`%c [Cache Hit] Serving fresh data for: "${city}" from local memory. Latency: 0ms`, 'color: #4caf50; font-weight: bold;');
            renderWeatherDashboard(cachedData.payload);
            return; // Halt execution early; no network call needed!
        } else {
            console.log(`%c [Cache Stale] In-memory data for: "${city}" expired. Evicting and refetching...`, 'color: #ff5722;');
            weatherCache.delete(normalizedCity); // Evict stale entry
        }
    }

    // 2. Lifecycle Clean-up: Abort any outstanding, stale network streams
    if (activeAbortController) {
        activeAbortController.abort();
        console.log(`%c Stream aborted for stale request context.`, 'color: #ffb300');
    }

    // 3. Establish a new AbortController instance for the current execution context
    activeAbortController = new AbortController();
    const { signal } = activeAbortController;

    try {
        const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedCity)}&units=metric&appid=${apiKey}`;
        
        // Pass the abort signal directly into the fetch configuration block
        const response = await fetch(endpoint, { signal });

        if (!response.ok) {
            throw new Error("City not found. Check your spelling!");
        }

        const data = await response.json();
        
        // 4. PERSIST TO CACHE: Save successful response with a high-resolution timestamp
        weatherCache.set(normalizedCity, {
            timestamp: Date.now(),
            payload: data
        });
        console.log(`%c [Cache Write] Saved server payload for: "${city}" to memory layer.`, 'color: #2196f3;');

        // 5. Successful execution path: Render server data onto screen elements
        renderWeatherDashboard(data);

    } catch (error) {
        // Catch block differentiation: Do not trigger alerts for manual stream aborts
        if (error.name === 'AbortError') {
            console.log(`%c Execution successfully halted for stale city query: "${city}"`, 'color: #4fc3f7');
        } else {
            console.error('Operational fetch failure:', error);
            alert(error.message);
        }
    } finally {
        // Nullify the controller reference if this specific stream finished running completely
        if (activeAbortController?.signal === signal) {
            activeAbortController = null;
        }
    }
}

/**
 * UI PRESENTATION LAYER
 * Encapsulates DOM rendering logic to cleanly decouple from network infrastructure.
 * @param {Object} data - Clean OpenWeatherMap API payload
 */
function renderWeatherDashboard(data) {
    const weatherInfo = document.getElementById("weather-info");
    const welcomeMsg = document.getElementById("welcome-msg");

    document.getElementById("city-display").innerText = data.name;
    document.getElementById("temp-display").innerText = Math.round(data.main.temp);
    document.getElementById("desc-display").innerText = data.weather[0].description;
    document.getElementById("humidity-display").innerText = `${data.main.humidity}%`;
    document.getElementById("wind-display").innerText = `${data.wind.speed} km/h`;
    document.getElementById("date-display").innerText = new Date().toLocaleDateString();

    // Toggle visibility states safely
    if (weatherInfo) weatherInfo.classList.remove("hidden");
    if (welcomeMsg) welcomeMsg.classList.add("hidden");
}

/**
 * CONTROLLER ENGINE: Debounce Handler
 * Postpones execution until user finishes typing to prevent API spam.
 */
function handleSearchInput(event) {
    const query = event.target.value.trim();
    
    clearTimeout(debounceTimer);

    if (!query) return;

    debounceTimer = setTimeout(() => {
        fetchWeather(query);
    }, 400);
}

// --- EVENT LISTENERS ---
const cityInputEl = document.getElementById("city-input");

if (cityInputEl) {
    cityInputEl.addEventListener("input", handleSearchInput);

    cityInputEl.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const query = event.target.value.trim();
            if (!query) {
                alert("Please enter a city name");
                return;
            }
            clearTimeout(debounceTimer); 
            fetchWeather(query); 
        }
    });
}
