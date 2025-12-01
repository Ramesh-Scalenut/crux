

# 🚀 Chrome UX Report (CrUX) Performance Dashboard

A full-stack web application built as part of the **BrightEdge Software Engineering Assignment**.
The app allows users to fetch real-world performance data (LCP, FCP, CLS, etc.) from the **Chrome UX Report API**, visualize it, filter/sort it, and compute aggregate metrics across multiple URLs.

---

## 📌 Features

### **🔹 Part 1 — Fetch CrUX Data**

* Enter one or more URLs
* Backend proxies official **CrUX REST API**
* View performance metrics:

  * Largest Contentful Paint (LCP)
  * First Contentful Paint (FCP)
  * Cumulative Layout Shift (CLS)
* Displays results in a Material-UI data table

---

### **🔹 Part 2 — Filtering and Sorting**

* Filter results by:

  * Metric (LCP, FCP, CLS)
  * Comparator (>, >=, <, <=, =)
  * Threshold value
* Sort ascending/descending by selected metric
* Fully dynamic UI powered by React hooks

---

### **🔹 Part 3 — Multi-URL Summary**

After fetching multiple URLs, the dashboard computes:

* Average LCP / FCP / CLS
* Sum of metrics
* Highlighted performance differences
* Clean summary card for quick insights

This allows users to compare pages and detect slow-performing URLs at a glance.

---

## 🧩 Tech Stack

### **Frontend**

* **React** (hooks + functional components)
* **Material UI (MUI)** for clean UI
* Custom components:

  * `UrlListInput`
  * `MetricFilter`
  * `SortFilter`
  * `ThresholdInput`
  * `CruxTable`
  * `SummaryCard`

### **Backend**

* **Node.js + Express**
* CrUX API integration via Google Chrome UX Report API
* `.env` support using `dotenv`
* REST endpoint:
  **POST `/api/get-crux-data`** — retrieves metrics for multiple URLs

### **Other**

* Axios for HTTP requests
* Error handling & edge-case validation
* Separation of concerns: routes, controllers, services

---

## 🛠 Folder Structure

```
/frontend
  /src
    App.jsx

/backend
  /src
    /controllers
    /services
    server.js
    router.js
    .env
```

---

## ▶️ Demo

A demo video is included in the submission (as requested).
Shows:

* Entering URLs
* Fetching CrUX data
* Sorting, filtering
* Viewing summary metrics
* Error handling

---

## 🧪 Known Issues / Future Improvements

* Add BigQuery version of CrUX as alternative data source
* Improve error display when CrUX API has missing data
* Add caching for repeated URLs
* Add charts (bar/line) for visual understanding of performance


---

## 📖 Insight & Recommendations (Bonus)

The application analyzes CrUX results and can produce recommendations such as:

* “High LCP — consider optimizing server response time or largest content element.”
* “High CLS — ensure images have width/height set.”

These insights help users understand and improve their real-world page performance.

---

## 🚀 How to Run Locally

### **Frontend**

```
cd crux-react
npm install
npm run dev
```

### **Backend**

```
cd crux-node
npm install
npm start
```

Add your CrUX API key in `/crux-node/.env`:

```
CRUX_API_KEY=your_key_here
```


