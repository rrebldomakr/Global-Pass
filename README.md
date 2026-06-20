# 🌍 WeatherAtmos

An asynchronous web application that interfaces with third-party server environments to deliver real-time meteorological metrics globally. Built to demonstrate proficiency in API integration, client-side rendering optimization, and dynamic UI state rendering.

🚀 **[Live Demo Link](https://rrebldomakr.github.io/WeatherAtmos/)**

---

## 🛠️ Tech Stack & Engineering Concepts
- **JavaScript (ES6 Async/Await):** Utilizes asynchronous programming architecture to handle live network requests without halting main-thread execution.
- **WebGL & Three.js:** Hardware-accelerated 3D rendering for the interactive data-visualization canvas.
- **Fetch API & Memory Caching:** Handles connection streams, payload transfers, and implements a custom TTL cache to optimize latency.
- **CSS3 Layout Engine:** Implements a frosted glassmorphism visual layout decoupled from the 3D canvas flow.

---

## 🧠 Real Engineering Challenges Faced & Solutions

During development, the application encountered two critical structural roadblocks that required deep-dive debugging to resolve:

### 1. Decoupling the UI from the WebGL Render Loop
* **The Problem:** Integrating a heavy 3D canvas (`Globe.gl`) into the DOM natively disrupted the CSS Flexbox alignment, which caused the rendering engine to occasionally shove the primary UI components entirely off-screen.
* **The Resolution:** Conducted a structural refactor to strip the standard document flow rules, engineering a strictly absolute-positioned layout. The interactive UI card was hard-pinned to the viewport center, allowing the WebGL canvas to execute its rotation loops in the background without triggering expensive DOM reflows for the interface.

### 2. Overlapping API Streams & Network Spam
* **The Problem:** The initial search functionality triggered dozens of overlapping API calls upon rapid keystrokes. This risked immediate rate-limiting from the OpenWeatherMap servers and caused race conditions where older data payloads could resolve after newer ones.
* **The Resolution:** Engineered a three-tier optimization pipeline. First, implemented a 450ms debounce delay on inputs. Second, built an in-memory `Map` cache that stores valid JSON payloads for 5 minutes, allowing subsequent identical queries to bypass the network entirely. Finally, utilized `AbortController` to instantly terminate "in-flight" fetch requests if the user alters their search parameters before the original promise resolves.

---

## ⚙️ Local Deployment Directions
1. Clone the repository framework locally:
   ```bash
   git clone [https://github.com/rrebldomakr/WeatherAtmos.git](https://github.com/rrebldomakr/WeatherAtmos.git)
