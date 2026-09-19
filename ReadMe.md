# ⚡ GameLoad AI

### From 6–8 Seconds to Near-Instant Game Launch

> **Don't make the game load faster. Make the game ready before the user asks for it.**

GameLoad AI is an intelligent **game launch optimization platform** designed to reduce the waiting time between selecting a game and becoming playable.

Instead of modifying certified third-party game bundles, GameLoad AI optimizes everything around the game:

**Prediction → Prefetching → Cache Optimization → Optimal Network Routing → Progressive Loading → Instant Launch**

It also provides a **Scan & Play QR feature**, allowing users to scan a game's QR code with a mobile phone and directly open the game launch page.

---

# 🎯 Problem Statement

Modern gaming platforms can take **6–8 seconds or more** from the moment a user selects a game to the moment the game becomes playable.

This creates several problems:

* Users abandon games while waiting.
* Users explore fewer games.
* Users repeatedly choose familiar games instead of discovering new content.
* Switching between games becomes frustrating.
* Slow networks make the experience even worse.
* Resources may be downloaded only after the user clicks Play.
* Limited bandwidth and cache space make it inefficient to prefetch everything.

The challenge is especially difficult because the games are **certified third-party bundles and cannot be modified**.

Therefore, GameLoad AI focuses on the infrastructure and experience **around the game**.

---

# 💡 Our Solution

GameLoad AI predicts what the user is likely to play next and prepares the required resources **before the user clicks Play**.

### Core Pipeline

```text
                  USER BEHAVIOR
                       │
                       ▼
               Game Prediction
                       │
                       ▼
             Prefetch Optimization
                       │
                 ┌─────┴─────┐
                 │           │
                 ▼           ▼
             Knapsack     Cache System
                 │
                 └─────┬─────┘
                       ▼
               Resource Prefetch
                       │
                       ▼
                Network Routing
                       │
                    Dijkstra
                       │
                       ▼
                 Best Edge/CDN
                       │
                       ▼
                  Game Ready
                       │
                       ▼
                  🎮 PLAY
```

The goal is to transform:

```text
Traditional:

Click Game
    ↓
Download
    ↓
Wait 6–8 sec
    ↓
Game Ready
```

into:

```text
GameLoad AI:

Predict
   ↓
Prefetch
   ↓
Cache
   ↓
Optimize Route
   ↓
User Clicks
   ↓
🎮 Near-Instant Launch
```

---

# 🚀 Key Features

## 1. 🎮 Intelligent Game Lobby

The Game Lobby provides:

* Game cards
* Game categories
* Game loading status
* Cache status
* Prefetch status
* Estimated loading time
* Play button
* Game discovery

Each game can be in states such as:

```text
🟢 Cached
🔵 Prefetched
🟡 Loading
⚪ Not Cached
```

---

# 2. 🧠 Next Game Prediction

GameLoad AI analyzes session behavior to predict which game the user is likely to play next.

Signals can include:

* Recently played games
* Number of times a game was played
* Previous game transitions
* Game category
* Session behavior
* Time spent on games

Example:

```text
Predicted Next Game
────────────────────

🏎️ Racing X

Confidence: 87%
```

The prediction is then used by the prefetching system.

### Flow

```text
User opens lobby
       ↓
Analyze behavior
       ↓
Predict next game
       ↓
Calculate confidence
       ↓
Send prediction to prefetch engine
```

---

# 3. 🎒 Knapsack Algorithm — Smart Prefetching

Prefetching every game is inefficient because:

* Cache capacity is limited.
* Network bandwidth is limited.
* Game resources can be large.
* The user may never open the prefetched game.

GameLoad AI uses the **0/1 Knapsack algorithm** to decide which resources should be prefetched.

Each game/resource has:

| Parameter   | Meaning                         |
| ----------- | ------------------------------- |
| Size        | Required cache/bandwidth        |
| Probability | Probability user will launch it |
| Benefit     | Expected value of prefetching   |
| Cost        | Resource consumption            |

Example:

```text
Cache Capacity = 500 MB

Game A → 120 MB → 90% probability
Game B → 200 MB → 70% probability
Game C → 80 MB  → 40% probability
Game D → 250 MB → 30% probability
```

The algorithm selects the combination that maximizes expected benefit while staying within the available capacity.

### Knapsack Flow

```text
Candidate Games
      ↓
Calculate value
      ↓
Calculate resource cost
      ↓
Apply 0/1 Knapsack
      ↓
Select best combination
      ↓
Prefetch selected resources
```

Example output:

```text
Cache Capacity: 500 MB

✓ Racing X
✓ Football Pro
✓ Puzzle Quest

✗ Adventure World
✗ Strategy Arena
```

---

# 4. 🌐 Dijkstra Algorithm — Optimal Network Route

Game resources can be delivered through multiple edge nodes/CDNs.

GameLoad AI models the delivery infrastructure as a weighted graph.

Example:

```text
                   ┌── CDN A
                   │
User ── Edge A ────┤
                   │
                   ├── CDN B
                   │
User ── Edge B ────┤
                   │
                   └── CDN C
```

Each connection has a cost based on factors such as:

* Network latency
* Server load
* Bandwidth
* Estimated delivery cost

GameLoad AI applies **Dijkstra's shortest-path algorithm** to identify the lowest-cost route.

### Example

```text
User
 ↓
Edge Node B
 ↓
CDN B
 ↓
Game Resources
```

Example result:

```text
Optimal Route

Latency: 82 ms
Nodes: 3
Network Cost: Low
```

The selected path is also visualized in the Infrastructure Dashboard.

---

# 5. ⚡ Intelligent Prefetching

After predicting the next game and selecting resources using Knapsack, GameLoad AI starts prefetching them in the background.

### Prefetch Lifecycle

```text
Not Started
     ↓
Queued
     ↓
Downloading
     ↓
Cached
     ↓
Ready
```

The user can see the process in real time.

Example:

```text
Predicting next game...     ✓
Selecting resources...      ✓
Optimizing cache...         ✓
Prefetching...              72%
Game ready...               ✓
```

---

# 6. 🗄️ Smart Cache

GameLoad AI maintains a cache of prefetched resources.

The cache tracks:

* Cache hits
* Cache misses
* Cached games
* Cache size
* Prefetched resources
* Evicted resources

Example:

```text
Cache Usage

320 MB / 500 MB

Cache Hit Rate
94%
```

An **LRU-style eviction strategy** can be used to remove less useful resources when the cache becomes full.

---

# 7. 📱 QR Code — Scan & Play

GameLoad AI includes a **QR-based game launch system**.

Each game can have its own QR code.

Example:

```text
┌─────────────────────┐
│                     │
│      QR CODE        │
│                     │
└─────────────────────┘

🏎️ Racing X

Scan to Play
```

### QR Flow

```text
Game Lobby
     ↓
Generate Game QR
     ↓
📱 Scan using phone
     ↓
Open public game URL
     ↓
Identify Game ID
     ↓
Check Cache / Prefetch
     ↓
Launch Game
```

The QR code should contain the **production URL** when deployed.

Example:

```text
https://your-domain.com/play/racing
```

It should NOT contain:

```text
http://localhost:5173
```

for production.

### Why QR?

The QR feature provides a simple bridge between:

**Desktop → Mobile → Game**

A user can discover a game on one device and instantly launch it on another device.

---

# 8. 📲 Mobile Support

The application is designed to work on:

* Desktop
* Laptop
* Tablet
* Mobile browsers

Responsive layouts are provided for:

```text
360px
390px
412px
768px
1024px
1440px
```

The QR launch flow allows users to directly open the game on a mobile browser.

---

# 9. ⏳ Progressive Loading

Instead of showing a blank loading screen, GameLoad AI provides a progressive loading experience.

```text
Game Shell
    ↓
UI
    ↓
Main Assets
    ↓
Interactive Elements
    ↓
Playable
```

The interface can display:

* Game preview
* Skeleton UI
* Progress indicators
* Loading status
* Useful feedback

This improves **perceived load time** even when some resources still need to arrive.

---

# 10. 📊 Actual vs Perceived Load Time

GameLoad AI measures two different concepts.

### Actual Load Time

Time from resource loading initiation until the game becomes playable.

### Perceived Load Time

How quickly the user receives meaningful visual feedback.

Example:

```text
Actual Load Time:     620 ms
Perceived Load Time:  280 ms
```

This distinction is important because a technically fast system can still feel slow if the user receives no useful feedback during loading.

---

# 11. 📈 Analytics Dashboard

The platform provides a performance dashboard.

### Metrics

* Cold Load P50
* Cold Load P95
* Average Load Time
* Launch-to-Play Conversion
* Games Sampled per Session
* Cache Hit Rate
* Prefetch Accuracy
* Bandwidth Saved
* Actual Load Time
* Perceived Load Time

Example:

```text
┌─────────────────────────────────┐
│ Cold Load P50          480 ms   │
│ Cold Load P95          720 ms   │
│ Cache Hit Rate           94%    │
│ Prefetch Accuracy        87%    │
│ Games / Session          4.2    │
└─────────────────────────────────┘
```

> Performance numbers shown by the demo should be clearly identified as measured or simulated.

---

# 12. 🔬 Before vs After Simulation

The application provides a controlled simulation to demonstrate the optimization.

### Without GameLoad AI

```text
User Click
    ↓
Request Resources
    ↓
Download
    ↓
Wait
    ↓
Game Ready

Example:
6.8 seconds
```

### With GameLoad AI

```text
Prediction
    ↓
Knapsack
    ↓
Prefetch
    ↓
Cache
    ↓
Dijkstra
    ↓
User Click
    ↓
Game Ready

Example:
~500 ms under optimized demo conditions
```

The actual result depends on network conditions, resource sizes, cache state, and infrastructure.

---

# 🏗️ System Architecture

```text
                        ┌─────────────────────┐
                        │      User           │
                        └──────────┬──────────┘
                                   │
                                   ▼
                        ┌─────────────────────┐
                        │    React Lobby      │
                        │      + Vite         │
                        └──────────┬──────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              Prediction      Game API       QR Launch
                    │              │              │
                    ▼              │              ▼
             Prefetch Engine       │         Game Route
                    │              │
                    ▼              ▼
              Knapsack          FastAPI
                    │              │
                    ▼              │
                 Cache             │
                    │              │
                    └──────┬───────┘
                           │
                           ▼
                     Dijkstra
                           │
                           ▼
                   Edge / CDN Route
                           │
                           ▼
                     Game Assets
                           │
                           ▼
                      🎮 Game
```

---

# 🛠️ Technology Stack

## Frontend

| Technology              | Purpose                   |
| ----------------------- | ------------------------- |
| React                   | UI development            |
| Vite                    | Development/build tooling |
| JavaScript / TypeScript | Application logic         |
| Tailwind CSS            | Styling                   |
| Recharts                | Analytics visualization   |
| Lucide Icons            | UI icons                  |
| QR Code Library         | QR generation             |
| QR Scanner Library      | Mobile QR scanning        |

---

## Backend

| Technology | Purpose                        |
| ---------- | ------------------------------ |
| Python     | Backend logic                  |
| FastAPI    | REST APIs                      |
| Pydantic   | Request/response validation    |
| Pandas     | Data processing where required |

---

## Algorithms

| Algorithm                 | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| Dijkstra                  | Select optimal network/edge delivery route |
| 0/1 Knapsack              | Select resources for prefetching           |
| LRU-style Cache           | Manage limited cache capacity              |
| Behavior-Based Prediction | Predict the user's next game               |

---

## Deployment

| Platform | Purpose                         |
| -------- | ------------------------------- |
| Vercel   | Frontend deployment             |
| Render   | FastAPI backend deployment      |
| GitHub   | Source code and version control |

---

# 📁 Project Structure

```text
GameLoad-AI/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── algorithms/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── algorithms/
│   │   ├── dijkstra.py
│   │   └── knapsack.py
│   ├── services/
│   ├── models/
│   ├── data/
│   └── requirements.txt
│
├── README.md
└── .gitignore
```

Adapt the structure above to the actual repository structure.

---

# 🔌 API Endpoints

Typical API structure:

| Method | Endpoint            | Purpose                  |
| ------ | ------------------- | ------------------------ |
| GET    | `/games`            | Get available games      |
| GET    | `/games/{id}`       | Get game details         |
| POST   | `/predict`          | Predict next game        |
| POST   | `/prefetch`         | Start prefetch operation |
| POST   | `/optimize-cache`   | Run cache optimization   |
| POST   | `/optimal-route`    | Run Dijkstra             |
| POST   | `/simulate-load`    | Simulate loading         |
| GET    | `/analytics`        | Get performance metrics  |
| POST   | `/generate-qr`      | Generate QR              |
| GET    | `/launch/{game_id}` | Launch game              |

---

# 💻 Local Setup

## Prerequisites

Install:

* Node.js
* npm
* Python 3.10+
* Git

Check installations:

```bash
node --version
npm --version
python --version
git --version
```

---

# 1. Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

```bash
cd GameLoad-AI
```

---

# 2. Frontend Setup

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

# 3. Backend Setup

Open another terminal.

```bash
cd backend
```

Create virtual environment:

### Windows

```powershell
python -m venv venv
```

Activate:

```powershell
venv\Scripts\activate
```

### macOS/Linux

```bash
python3 -m venv venv
```

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start FastAPI:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

# 📱 Testing QR on a Phone

For local testing, `localhost` will not work from your phone.

Find your computer's local IP:

### Windows

```powershell
ipconfig
```

Find:

```text
IPv4 Address
```

Example:

```text
192.168.1.5
```

Start Vite with:

```powershell
npm run dev -- --host 0.0.0.0
```

Then use:

```text
http://192.168.1.5:5173
```

Your phone and computer must be connected to the same Wi-Fi network.

For the QR code, use:

```text
http://192.168.1.5:5173/play/game-id
```

---

# 🌍 Production Deployment

## Frontend — Vercel

Build the frontend:

```bash
npm run build
```

Deploy the frontend using Vercel.

Set:

```text
VITE_API_URL=https://your-backend-url
```

Example:

```text
VITE_API_URL=https://gameload-ai-backend.onrender.com
```

---

# Backend — Render

Deploy the FastAPI application.

Example start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

Configure CORS to allow the deployed frontend.

Example production architecture:

```text
                    Internet
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        Vercel Frontend      Render Backend
             │                   │
             └─────────┬─────────┘
                       │
                       ▼
                 GameLoad AI
```

---

# 📱 Production QR

After deployment, the QR should contain the public URL.

Example:

```text
https://gameload-ai.vercel.app/play/racing
```

The user can:

```text
Open Game
     ↓
Generate QR
     ↓
📱 Scan
     ↓
Public HTTPS URL
     ↓
Game Launch Page
     ↓
🎮 Play
```

The phone does not need to be connected to your development machine.

---

# 🧪 Testing Checklist

Before submitting the project, verify:

```text
✓ Game Lobby works
✓ Game cards work
✓ Play button works
✓ Prediction works
✓ Knapsack works
✓ Prefetch works
✓ Cache works
✓ Dijkstra works
✓ Infrastructure visualization works
✓ QR generation works
✓ QR scanning works
✓ Mobile route works
✓ Analytics work
✓ Loading states work
✓ Error handling works
✓ Backend APIs work
✓ CORS works
✓ Production URLs work
✓ No localhost URLs in production
✓ No API keys exposed
```

---

# 🎬 Recommended Demo Flow

For a hackathon presentation, demonstrate the project in this order:

### Step 1 — Show the Problem

```text
Traditional Game Launch

6–8 seconds
```

Explain that users wait before they can play.

---

### Step 2 — Open GameLoad AI

Show the Game Lobby.

```text
🏎️ Racing X
⚽ Football Pro
🧩 Puzzle Quest
🏹 Adventure World
```

---

### Step 3 — Run Prediction

Show:

```text
Predicted Next Game

Racing X
87% confidence
```

---

### Step 4 — Run Knapsack

Show:

```text
Cache Capacity: 500 MB

✓ Racing X
✓ Football Pro
✓ Puzzle Quest

Prefetch optimized
```

Explain that Knapsack prevents wasting bandwidth and cache capacity.

---

### Step 5 — Show Prefetch

```text
Prefetching Racing X...

██████████████████ 100%

READY
```

---

### Step 6 — Show Dijkstra

Open the Infrastructure page.

Show multiple network paths.

Then demonstrate:

```text
User
 ↓
Edge B
 ↓
CDN B
 ↓
Game
```

Explain that Dijkstra chooses the lowest-cost path based on network conditions.

---

### Step 7 — Launch Game

Click:

```text
PLAY NOW
```

Show the optimized launch experience.

---

### Step 8 — QR Demo

Generate:

```text
🏎️ Racing X QR
```

Scan it using a phone.

The phone opens:

```text
https://your-domain.com/play/racing
```

Then the game launch page appears.

---

### Step 9 — Analytics

Finish with:

```text
Cold Load P50
Cold Load P95
Cache Hit Rate
Prefetch Accuracy
Games Sampled
Launch-to-Play Conversion
```

Show the **before vs optimized** comparison.

---

# 🧠 Why These Algorithms?

## Why Knapsack?

Because prefetching everything is expensive.

Knapsack answers:

> **"Given limited cache/bandwidth, which resources should we prepare to maximize expected benefit?"**

---

## Why Dijkstra?

Because multiple delivery paths may exist.

Dijkstra answers:

> **"Which available route has the lowest delivery cost from the user to the game resources?"**

---

## Why Prediction?

Because the best time to load a game is **before the user asks for it**.

Prediction answers:

> **"What is the user most likely to play next?"**

Together:

```text
Prediction
    +
Knapsack
    +
Prefetch
    +
Cache
    +
Dijkstra
    =
Near-Instant Game Launch
```

---

# 📊 Challenge Metrics

GameLoad AI is designed around the challenge metrics:

| Metric                    | Goal                 |
| ------------------------- | -------------------- |
| Cold Load P50             | Toward < 500 ms      |
| Cold Load P95             | Reduce significantly |
| Launch-to-Play Conversion | Increase             |
| Games Sampled / Session   | Increase             |
| Cache Hit Rate            | Increase             |
| Prefetch Accuracy         | Increase             |
| Perceived Load Quality    | Improve              |

Actual values should be measured from the running system or clearly labeled as simulated.

---

# 🔐 Important Design Constraint

GameLoad AI does **not modify certified third-party game bundles**.

Instead, it optimizes the surrounding infrastructure:

```text
                 ┌──────────────────────┐
                 │ Third-Party Game     │
                 │ Bundle               │
                 │ UNMODIFIED           │
                 └──────────▲───────────┘
                            │
                     Optimized Delivery
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
   Prediction                               Dijkstra
        │                                       │
   Knapsack                                 Edge/CDN
        │                                       │
    Prefetch                                  Cache
        │                                       │
        └───────────────────┬───────────────────┘
                            │
                         User
```

---

# 🚀 Future Enhancements

Potential future improvements include:

* ML-based next-game prediction
* Real CDN integration
* Redis distributed caching
* Real-time edge-node monitoring
* Adaptive prefetching
* Network-aware prediction
* Reinforcement learning for prefetch decisions
* Service worker-based browser caching
* WebSocket-based real-time optimization updates
* Multi-region deployment
* Real-world load testing
* Personalized game recommendations
* Intelligent cache eviction based on predicted demand

---

# 🏆 Project Highlights

### ⚡ Near-Instant Launch

Prepare resources before the user clicks.

### 🧠 Predictive Prefetching

Predict what users are likely to play.

### 🎒 Knapsack Optimization

Use limited bandwidth and cache intelligently.

### 🌐 Dijkstra Routing

Select an optimized delivery path.

### 🗄️ Smart Caching

Reuse previously prepared resources.

### 📱 QR Scan & Play

Launch games directly from a mobile device.

### 📊 Measurable Performance

Track actual and perceived loading performance.

### 📲 Mobile Ready

Designed for responsive web and mobile launch.

---

# 🔑 Core Innovation

The central idea behind GameLoad AI is:

> **The fastest game load is the load that happens before the user clicks Play.**

Instead of waiting for a user request and then starting the loading process, GameLoad AI uses behavioral prediction, constrained prefetching, caching, and optimized delivery routing to prepare the experience in advance.

```text
              BEFORE

User → Click → Request → Download → Wait → Play


              GAMELOAD AI

User Behavior
      ↓
Prediction
      ↓
Knapsack
      ↓
Prefetch
      ↓
Cache
      ↓
Dijkstra
      ↓
Optimized Delivery
      ↓
User Click
      ↓
⚡ PLAY
```

---

# 👥 Team

**Project:** GameLoad AI

**Challenge:** Game Load Time — 6–8 Seconds to Near-Instant

**Domain:** Game Performance / AI / Web Infrastructure / Optimization

**Built with:** React • Vite • FastAPI • Python • Dijkstra • Knapsack • Caching • QR • Vercel • Render

---

# 📄 License

This project is developed for educational, experimental, and hackathon purposes.

---

## ⭐ Final Message

**GameLoad AI**

### Predict it. Prefetch it. Cache it. Route it. Play it. ⚡🎮
