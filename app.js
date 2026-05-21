/**
 * ==========================================================================
 * REAL-TIME WEATHER DASHBOARD CORE PIPELINE ENGINE
 * Architectural Framework: Vanillajs Asynchronous Operations Layer
 * ==========================================================================
 */

const apiKey = "43ec5faff1cc75c6c7db7c79d7e0a98b";

// Global lifecycle controllers
let debounceTimer = null;
let activeAbortController = null;

// Memory caching system parameters
const weatherCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5-Minute Lifespan Threshold

/**
 * CORE ASYNC ORCHESTRATOR
 * Interlaces network streams, in-memory validation rules, and cancellation handles.
 * @param {string} city - Raw search string parameter
 */
async function fetchWeather(city) {
    const normalizedCity = city.toLowerCase().trim();

    // 1. IN-MEMORY CACHE LIFECYCLE EVALUATION
    if (weatherCache.has(normalizedCity)) {
        const cachedEntry = weatherCache.get(normalizedCity);
        const systemTimeNow = Date.now();

        if (systemTimeNow - cachedEntry.timestamp < CACHE_TTL_MS) {
            console.log(`%c [Cache Hit] serving data for: "${city}" instantly from memory.`, 'color: #4caf50; font-weight: bold;');
            renderWeatherDashboard(cachedEntry.payload);
            return;
        } else {
            console.log(`%c [Cache Expired] Purging record for: "${city}".`, 'color: #ff5722;');
            weatherCache.delete(normalizedCity);
        }
    }

    // 2. NETWORK CONTEXT STREAM CLEANUP (Abort Flight Layer)
    if (activeAbortController) {
        activeAbortController.abort();
        console.log(`%c Active request cancelled to favor newer stream pipeline context.`, 'color: #ffb300;');
    }

    activeAbortController = new AbortController();
    const { signal } = activeAbortController;

    try {
        const targetEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(normalizedCity)}&units=metric&appid=${apiKey}`;
        
        const response = await fetch(targetEndpoint, { signal });

        if (!response.ok) {
            throw new Error("Location not recognized by server. Check syntax.");
        }

        const data = await response.json();
        
        // 3. PERSIST VALID RECORD TO DATA LAYER
        weatherCache.set(normalizedCity, {
            timestamp: Date.now(),
            payload: data
        });
        console.log(`%c [Cache Write] Saved server payload for: "${city}".`, 'color: #2196f3;');

        renderWeatherDashboard(data);

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log(`%c Stream pipeline successfully torn down for city: "${city}".`, 'color: #4fc3f7;');
        } else {
            console.error('System exception event handled:', error);
            alert(error.message);
        }
    } finally {
        if (activeAbortController?.signal === signal) {
            activeAbortController = null;
        }
    }
}

/**
 * TELEMETRY VISUALIZATION LAYER
 * Parses calculations, structures theme scales, maps properties, and handles DOM toggles.
 * @param {Object} data - API Payload Object
 */
function renderWeatherDashboard(data) {
    const weatherInfo = document.getElementById("weather-info");
    const welcomeMsg = document.getElementById("welcome-msg");

    // 1. Map Core Text Metrics
    document.getElementById("city-display").innerText = data.name;
    document.getElementById("temp-display").innerText = Math.round(data.main.temp);
    document.getElementById("desc-display").innerText = data.weather[0].description;
    document.getElementById("humidity-display").innerText = `${data.main.humidity}%`;
    document.getElementById("wind-display").innerText = `${data.wind.speed} m/s`;
    document.getElementById("date-display").innerText = new Date().toLocaleDateString(undefined, {
        weekday: 'long', month: 'short', day: 'numeric'
    });

    // 2. Hardware-Accelerated Vector Compass Evaluation
    document.documentElement.style.setProperty('--wind-direction', `${data.wind.deg}deg`);

    // 3. Astronomical Daylight Tracking Calculations
    calculateAstroCycleTrack(data.dt, data.sys.sunrise, data.sys.sunset);

    // 4. Critical Meteorological Hazard Evaluations
    evaluateSystemSafetyAlerts(data.weather[0].id);

    // 5. Background Ambiance State Injection Layer
    const coreWeatherCondition = data.weather[0].main.toLowerCase();
    document.body.className = ""; // Drop all legacy theme states
    document.body.classList.add(`weather-${coreWeatherCondition}`);

    // 6. Viewport Visibility Frame Adjuster
    if (weatherInfo) weatherInfo.classList.remove("hidden");
    if (welcomeMsg) welcomeMsg.classList.add("hidden");
}

/**
 * EVALUATE DAYLIGHT TIMELINE POSITIONS
 */
function calculateAstroCycleTrack(currentTime, sunriseTimestamp, sunsetTimestamp) {
    const astroDisplayElement = document.getElementById("astro-display");
    if (!astroDisplayElement) return;

    if (currentTime > sunsetTimestamp) {
        astroDisplayElement.innerText = "Night cycle active (Sun set)";
    } else if (currentTime < sunriseTimestamp) {
        astroDisplayElement.innerText = "Pre-dawn tracking active";
    } else {
        const spanTotal = sunsetTimestamp - sunriseTimestamp;
        const currentProgress = currentTime - sunriseTimestamp;
        const progressPercentage = Math.round((currentProgress / spanTotal) * 100);
        astroDisplayElement.innerText = `Daylight window tracking: ${progressPercentage}% complete`;
    }
}

/**
 * HIGH-ALERT SAFETY ADVISORY EVALUATIONS
 */
function evaluateSystemSafetyAlerts(conditionId) {
    const alertSystemBanner = document.getElementById("severe-alert-system");
    if (!alertSystemBanner) return;

    // Check OpenWeather ID ranges for severe conditions (Thunderstorms, Heavy Rains, Atmospheric Hazards)
    const matchesSevereThunderstormRange = (conditionId >= 200 && conditionId <= 232);
    const matchesExtremeTorrentialRain = (conditionId === 502 || conditionId === 503 || conditionId === 504);
    const matchesAtmosphericAnomalies = (conditionId >= 711 && conditionId <= 781); // Smoke, Volcanic Ash, Tornadoes

    if (matchesSevereThunderstormRange || matchesExtremeTorrentialRain || matchesAtmosphericAnomalies) {
        alertSystemBanner.innerText = "⚠️ SYSTEM ADVISORY: High-alert weather anomalies tracking across current sector.";
        alertSystemBanner.classList.remove("hidden");
    } else {
        alertSystemBanner.classList.add("hidden");
    }
}

/**
 * SYSTEM TRAFFIC CONTROLLER: Input Debounce Layer
 */
function handleSearchInput(event) {
    const rawValue = event.target.value.trim();
    
    clearTimeout(debounceTimer);
    if (!rawValue) return;

    debounceTimer = setTimeout(() => {
        fetchWeather(rawValue);
    }, 450);
}

// ==========================================================================
// SYSTEM EVENT WIRE HOOKS
// ==========================================================================
const cityInputEl = document.getElementById("city-input");

if (cityInputEl) {
    cityInputEl.addEventListener("input", handleSearchInput);

    cityInputEl.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            const staticQuery = event.target.value.trim();
            if (!staticQuery) return;
            
            clearTimeout(debounceTimer); // Terminate outstanding typing queues
            fetchWeather(staticQuery); // Execute hard data push override
        }
    });
}
