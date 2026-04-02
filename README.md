# 📚 Study Tracker (Simple, Cloud-Ready)


## 🧠 Goal
Build a **simple Study Tracker web app** (inspired by TakeUForward-style progress tracking) for **university students**.

The app should allow users to:
- Track subjects and chapters
- Mark progress (completed / revise)
- Quickly see what needs revision


⚠️ Keep it **lightweight** — no complex backend required.


---


## 🧩 Core Idea


A **single-page web app** where:
- Students create subjects (e.g., DSA, OS, DBMS)
- Add chapters/topics under each subject
- Track their progress visually
- Data is saved locally (no login required)


---


## 🎯 Features


### 1. 📖 Subjects
- Add / delete subjects
- Each subject has a list of chapters


---

### 2. ✅ Chapter Tracking
Each chapter should have:
- Title
- Status:
  - Not Started
  - Completed
  - Needs Revision


Actions:
- Mark as completed
- Mark for revision
- Delete chapter

---


### 3. 🔁 Revision View
- A dedicated section showing:
  - All chapters marked **Needs Revision**
- Helps answer: *“What should I revise today?”*


---


### 4. 📊 Progress View
For each subject:
- Total chapters
- Completed count
- Simple progress bar (or %)


---


## 💾 Data Storage (IMPORTANT)


- Use **localStorage** (or IndexedDB)
- No backend required
- Data should persist after refresh


---


## 🖥️ Tech Stack




- React or similar
- Tailwind CSS (for clean UI)


---


## ☁️ Deployment Requirement


- Must be **source code deployable**
- Should work on:
  - Google Cloud run


👉 No server-side code
👉 No database setup
👉 Fully frontend


---


## 🎨 UI Guidelines


- Minimal, clean UI
- Sidebar → Subjects
- Main area → Chapters
- Color coding:
  - Green → Completed
  - Red → Needs Revision
  - Grey → Not Started


---


# Add dockerfile for google cloud run:
- Use node 23 base docker image
- DO NOT include a build step (tsc)
- run the application directly using `--experimental-strip-types` flag


## 🧩 Sample Data Structure


```json
{
  "subjects": [
    {
      "name": "DSA",
      "chapters": [
        { "title": "Arrays", "status": "Completed" },
        { "title": "Trees", "status": "Needs Revision" }
      ]
    }
  ]
}
