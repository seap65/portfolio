
Portfolio Dashboard

A dynamic stock portfolio dashboard that fetches real-time financial data and displays it in a beautiful, responsive UI. Built using React, TypeScript,and Tailwind CSS.

Features

- Real-time data updates (CMP, Gain/Loss)
- Responsive, clean UI using Tailwind CSS
- Portfolio breakdown by stock

---

Tech Stack

 Layer      | Technology       

Frontend    | React + Vite + TypeScript 
Styling     | Tailwind CSS         
Data Fetch  | Axios or fetch

---

Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)

```bash

npm install -D tailwindcss postcss autoprefixer(installs three development dependencies)
npx tailwindcss init -p (Runs the tailwindcss CLI tool using npx)


Run the frontend Server:

```bash
npm run dev


Run the backend server

installs two packages as dev dependencies

npm install -D ts-node typescript

ts-node to execute a TypeScript file directly

npx ts-node src/server.ts
```

Visit: [http://localhost:5173](http://localhost:5173) to access the site.



The final dashboard should include:

- CMP from Yahoo Finance
- P/E Ratio & Earnings from Google Finance
- Use unofficial APIs or scraping with caution
- Refresh every 15 seconds using `setInterval`



