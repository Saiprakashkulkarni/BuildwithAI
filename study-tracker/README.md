# ⚡ StudyPulse

**StudyPulse** is a lightweight, frontend-first study tracker designed to help university students manage chapters, track progress visually, and implement spaced repetition—all without needing a complex backend.

![StudyPulse Mockup]() *(Replace with actual screenshot)*

## 🎯 Core Features

- **📖 Subjects & Chapters Management**: Organize your reading lists by subject.
- **✅ Spaced Repetition Logic**: Automatically queues chapters for revision at 1, 3, and 7-day intervals after marking them "Completed".
- **🔁 Revision Dashboard**: A dedicated view to see exactly what you need to study *today*.
- **📊 Overall Progress View**: Visual progress bars and completion percentages for every subject.
- **⏱️ Integrated Pomodoro Timer**: A built-in 25/5 minute timer to maintain focus.
- **🔥 Study Streaks**: Gamify your learning by tracking daily check-ins.
- **🎯 Weekly Goal Setting**: Set targets for chapters to complete each week.
- **🏷️ Difficulty Tags**: Categorize chapters as Easy (Green), Medium (Yellow), or Hard (Red).
- **🌙 Dark Mode**: Beautiful, integrated dark mode toggle for late studying sessions.
- **🔍 Instant Search**: Instantly filter chapters out of your list.
- **💾 100% Local Storage**: Zero backend requirements, with full JSON Import/Export support.

---

## 🖥️ Tech Stack

Designed specifically to be lightweight, fast, and source-code-deployable with zero friction:

- **Frontend**: React (via CDN)
- **Styling**: Tailwind CSS (via CDN)
- **Server**: Node.js static built-in server
- **Transpilation**: Babel Standalone (JSX fully processed in-browser)
- **Deployment**: Docker (Node 23 Alpine `node --experimental-strip-types`)

---

## 🚀 Deployment & Installation

StudyPulse was engineered with a strict **"No Build Step"** requirement, making it highly compatible natively or via CloudRun.

### Run Locally (Without Docker)

You must have [Node.js](https://nodejs.org/) installed (v23+ recommended).

```bash
# Clone the repository
git clone https://github.com/your-username/study-pulse.git
cd study-pulse

# Run the native server using the new experimental TypeScript strip flag
npm start
```

Navigate to `http://localhost:8080` in your web browser.

### Run via Docker (Google Cloud Run Ready)

```bash
# Build the image
docker build -t studypulse .

# Run the container
docker run -p 8080:8080 studypulse
```

---

## ☁️ Live Demo

👉 [Link to Live Demo (Google Cloud Run)]() *(Replace with actual link)*

---

## 🧠 Future Improvements

- Add OAuth/Google Login to synchronize data across devices (Firebase integration).
- Implement interactive graphs mapping historical study patterns.
- Expand the Pomodoro timer settings to allow customizable work/rest intervals.

## 📄 License

This project is licensed under the MIT License.
