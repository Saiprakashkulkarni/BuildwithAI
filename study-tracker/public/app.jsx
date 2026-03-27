const { useState, useEffect, useMemo, useRef } = React;

// --- Helper Functions ---
const generateId = () => crypto.randomUUID();

const getWeekIdentifier = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNumber = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}-W${weekNumber}`;
};

const getIsoDate = () => new Date().toISOString().split('T')[0];

const getNextRevisionDate = (revisionCount) => {
  const dates = [1, 3, 7, 14, 30]; // Days ahead based on count
  const daysToAdd = dates[Math.min(revisionCount, dates.length - 1)];
  const d = new Date();
  d.setDate(d.getDate() + daysToAdd);
  return d.toISOString().split('T')[0];
};


// --- Icons (SVG) ---
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Folder: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Timer: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Moon: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  Sun: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
};


// --- Components ---

function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('study'); // 'study' | 'break'

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      // Auto switch mode
      const newMode = mode === 'study' ? 'break' : 'study';
      setMode(newMode);
      setTimeLeft(newMode === 'study' ? 25 * 60 : 5 * 60);
      setIsActive(false);

      // Play sound
      try {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
      } catch (e) { }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'study' ? 25 * 60 : 5 * 60);
  };
  const switchMode = (m) => {
    setMode(m);
    setIsActive(false);
    setTimeLeft(m === 'study' ? 25 * 60 : 5 * 60);
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center">
      <div className="flex gap-2 mb-4 bg-gray-100 dark:bg-gray-900 p-1 rounded-lg">
        <button onClick={() => switchMode('study')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'study' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>Study</button>
        <button onClick={() => switchMode('break')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${mode === 'break' ? 'bg-indigo-600 text-white shadow' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>Break</button>
      </div>

      <div className="text-6xl font-black text-gray-800 dark:text-white font-mono tracking-tighter mb-6">
        {mins}:{secs}
      </div>

      <div className="flex gap-3">
        <button onClick={toggleTimer} className={`px-6 py-2 rounded-full font-bold uppercase tracking-wide text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${isActive ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md hover:shadow-lg focus:ring-indigo-500'}`}>
          {isActive ? 'Pause' : 'Start'}
        </button>
        <button onClick={resetTimer} className="px-5 py-2 rounded-full font-bold uppercase tracking-wide text-sm bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}


function Dashboard({ data, updateStreak, markStudiedToday, activeSubjectSetter }) {
  const today = getIsoDate();

  const stats = useMemo(() => {
    let chapters = 0, completed = 0, revision = 0;
    data.subjects.forEach(s => {
      chapters += s.chapters.length;
      s.chapters.forEach(c => {
        if (c.status === 'Completed') completed++;
        if (c.status === 'Needs Revision') revision++;
      });
    });
    const p = chapters === 0 ? 0 : Math.round((completed / chapters) * 100);
    return { subjects: data.subjects.length, chapters, completed, revision, percent: p };
  }, [data.subjects]);

  const todaysTasks = useMemo(() => {
    return data.subjects.flatMap(subject =>
      subject.chapters
        .filter(c => c.status === 'Needs Revision' || c.status === 'Not Started' || (c.status === 'Completed' && c.nextRevisionDate && c.nextRevisionDate <= today))
        .map(c => ({ ...c, subjectName: subject.name, subjectId: subject.id }))
    );
  }, [data.subjects, today]);


  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Welcome back! Here's your study overview.</p>
        </div>

        {/* Study Streak */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-100 to-red-50 dark:from-orange-900/40 dark:to-red-900/20 px-5 py-3 rounded-2xl border border-orange-200 dark:border-orange-800/50 shadow-sm">
          <span className="text-3xl filter drop-shadow-sm">🔥</span>
          <div>
            <div className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Study Streak</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white leading-none">{data.streak.current} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">Days</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Stats Cards */}
        {[
          { label: 'Total Subjects', value: stats.subjects, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: 'Total Chapters', value: stats.chapters, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'Completed', value: stats.completed, color: 'text-green-600 dark:text-green-400' },
          { label: 'Needs Revision', value: stats.revision, color: 'text-red-600 dark:text-red-400' }
        ].map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
            <div className={`text-3xl font-black mb-1 ${s.color}`}>{s.value}</div>
            <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Today's Study & Goal */}
        <div className="lg:col-span-2 space-y-8">

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                📅 Today's Study
              </h2>
              {data.streak.lastStudyDate !== today && (
                <button onClick={markStudiedToday} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg text-sm font-bold transition-colors border border-indigo-200 dark:border-indigo-800/50">
                  Check-in Today ✔️
                </button>
              )}
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-10 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 pt-8">
                <div className="text-4xl mb-3">🎉</div>
                <p className="font-medium text-lg">All done for today!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {todaysTasks.slice(0, 10).map((task, i) => (
                  <div key={i} onClick={() => activeSubjectSetter(task.subjectId)} className="group cursor-pointer bg-gray-50 dark:bg-gray-900/50 hover:bg-white dark:hover:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all flex justify-between items-center shadow-sm hover:shadow-md">
                    <div>
                      <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">{task.subjectName}</div>
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{task.title}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-bold
                           ${task.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          task.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
                        `}>{task.difficulty}</span>
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        →
                      </div>
                    </div>
                  </div>
                ))}
                {todaysTasks.length > 10 && (
                  <div className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 pt-2">
                    + {todaysTasks.length - 10} more tasks...
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">🎯 Weekly Goal</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Finish {data.goal.target} chapters this week.</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{data.goal.completed} <span className="text-xl text-gray-400 dark:text-gray-500">/ {data.goal.target}</span></div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <PomodoroTimer />

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Overall Completion</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                    {stats.percent}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-200 dark:bg-gray-700">
                <div style={{ width: `${stats.percent}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500 transition-all duration-1000 ease-in-out"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}




// --- Main App ---

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('studyPulseDataV2');
    if (saved) return JSON.parse(saved);

    // Fallback/Initial Data Structure
    return {
      streak: { current: 0, lastStudyDate: null },
      goal: { target: 5, completed: 0, weekStart: getWeekIdentifier() },
      preferences: { darkMode: false },
      subjects: [
        {
          id: generateId(),
          name: "DSA",
          chapters: [
            { id: generateId(), title: "Arrays & Strings", status: "Completed", difficulty: "Medium", nextRevisionDate: getIsoDate(), revisionCount: 1 },
            { id: generateId(), title: "Binary Trees", status: "Needs Revision", difficulty: "Hard", nextRevisionDate: null, revisionCount: 0 }
          ]
        }
      ]
    };
  });

  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'subject' | 'settings'
  const [newSubjectName, setNewSubjectName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sync to localStorage and apply side-effects
  useEffect(() => {
    localStorage.setItem('studyPulseDataV2', JSON.stringify(data));

    // Check Weekly Goal Reset
    const currentWeek = getWeekIdentifier();
    if (data.goal.weekStart !== currentWeek) {
      setData(prev => ({ ...prev, goal: { ...prev.goal, completed: 0, weekStart: currentWeek } }));
    }

    // Apply Dark Mode
    if (data.preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [data]);

  const toggleDarkMode = () => {
    setData(prev => ({ ...prev, preferences: { ...prev.preferences, darkMode: !prev.preferences.darkMode } }));
  };

  const markStudiedToday = () => {
    const today = getIsoDate();
    if (data.streak.lastStudyDate !== today) {
      setData(prev => ({
        ...prev,
        streak: {
          current: prev.streak.current + 1,
          lastStudyDate: today
        }
      }));
    }
  };


  // --- Subject Actions ---
  const addSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    const newSub = { id: generateId(), name: newSubjectName.trim(), chapters: [] };
    setData(prev => ({ ...prev, subjects: [...prev.subjects, newSub] }));
    setNewSubjectName("");
    setActiveSubjectId(newSub.id);
    setView('subject');
  };

  const deleteSubject = (id) => {
    setData(prev => ({ ...prev, subjects: prev.subjects.filter(s => s.id !== id) }));
    if (activeSubjectId === id) setView('dashboard');
  };


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Sidebar */}
      <aside className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full fixed z-20 h-full'}`}>
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-xl font-bold font-sans text-gray-900 dark:text-white flex items-center gap-2">
            <span className="text-indigo-600 dark:text-indigo-400">⚡</span> StudyPulse
          </h1>
          <button onClick={toggleDarkMode} className="p-2 text-gray-400 hover:text-gray-700 dark:hover:text-yellow-400 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {data.preferences.darkMode ? <Icons.Sun /> : <Icons.Moon />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between">
          <div>
            <nav className="space-y-1 mb-8">
              <button
                onClick={() => setView('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
              >
                <Icons.Home /> Dashboard
              </button>
              <button
                onClick={() => setView('settings')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${view === 'settings' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'}`}
              >
                <Icons.Settings /> Settings
              </button>
            </nav>

            <div>
              <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mx-3 mb-3">Your Subjects</h2>
              <ul className="space-y-1">
                {data.subjects.map(sub => (
                  <li key={sub.id} className="relative group">
                    <button
                      onClick={() => { setActiveSubjectId(sub.id); setView('subject'); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${view === 'subject' && activeSubjectId === sub.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                      <Icons.Folder /> <span className="truncate">{sub.name}</span>
                    </button>
                    <button
                      onClick={() => deleteSubject(sub.id)}
                      className="absolute right-2 top-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hidden md:flex"
                      title="Delete Subject"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <form onSubmit={addSubject} className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 font-bold">+</span>
              <input
                type="text"
                placeholder="New Subject..."
                className="w-full text-sm pl-8 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 dark:text-white dark:placeholder-gray-500 transition-all font-medium"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 relative">

        {/* Mobile Sidebar Toggle Overlay button */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden absolute top-4 left-4 z-30 p-2 bg-indigo-600 text-white rounded-lg shadow-lg">
          ☰
        </button>

        {view === 'dashboard' && <Dashboard data={data} updateStreak={() => { }} markStudiedToday={markStudiedToday} activeSubjectSetter={(id) => { setActiveSubjectId(id); setView('subject'); }} />}

        {view === 'settings' && (
          <div className="p-8 max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Settings</h1>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/80 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Weekly Goal</h3>
                <div className="flex gap-4 items-center">
                  <input type="number"
                    value={data.goal.target}
                    onChange={(e) => setData(prev => ({ ...prev, goal: { ...prev.goal, target: parseInt(e.target.value) || 1 } }))}
                    className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" max="100" />
                  <span className="text-gray-600 dark:text-gray-400">Chapters per week</span>
                </div>
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Data Management</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Export your data to a JSON file, or import an existing backup.</p>
                <div className="flex gap-4">
                  <button onClick={() => {
                    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `StudyPulse_Backup_${getIsoDate()}.json`;
                    a.click();
                  }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors">
                    Export Data
                  </button>

                  <label className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors cursor-pointer">
                    Import Data
                    <input type="file" className="hidden" accept=".json" onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        try { const parsed = JSON.parse(evt.target.result); setData(parsed); alert("Import successful!"); } catch (err) { alert("Invalid JSON file."); }
                      };
                      reader.readAsText(file);
                    }} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'subject' && (
          <SubjectView data={data} setData={setData} subjectId={activeSubjectId} markStudiedToday={markStudiedToday} />
        )}
      </main>
    </div>
  );
}

// --- Subject View Component ---
function SubjectView({ data, setData, subjectId, markStudiedToday }) {
  const [search, setSearch] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterDiff, setNewChapterDiff] = useState("Medium");

  const subject = data.subjects.find(s => s.id === subjectId);
  if (!subject) return null;

  const filteredChapters = subject.chapters.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

  const addChapter = (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) return;

    setData(prev => ({
      ...prev,
      subjects: prev.subjects.map(s => {
        if (s.id === subjectId) {
          return {
            ...s, chapters: [...s.chapters, {
              id: generateId(), title: newChapterTitle.trim(), status: "Not Started", difficulty: newChapterDiff, nextRevisionDate: null, revisionCount: 0
            }]
          };
        }
        return s;
      })
    }));
    setNewChapterTitle("");
  };

  const updateChapter = (chapterId, updates) => {
    setData(prev => {
      let goalIncrement = 0;

      const newSubjects = prev.subjects.map(s => {
        if (s.id === subjectId) {
          return {
            ...s,
            chapters: s.chapters.map(ch => {
              if (ch.id === chapterId) {
                // Handle the Spaced Repetition logic when marked as "Completed"
                if (updates.status === 'Completed' && ch.status !== 'Completed') {
                  goalIncrement = 1;
                  markStudiedToday(); // Also check in today
                  return {
                    ...ch,
                    ...updates,
                    revisionCount: ch.revisionCount + 1,
                    nextRevisionDate: getNextRevisionDate(ch.revisionCount)
                  };
                }
                return { ...ch, ...updates };
              }
              return ch;
            })
          };
        }
        return s;
      });

      return {
        ...prev,
        subjects: newSubjects,
        goal: { ...prev.goal, completed: prev.goal.completed + goalIncrement }
      };
    });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{subject.name}</h1>

        <div className="relative w-full md:w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
          <input type="text" placeholder="Search chapters..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-gray-900 dark:text-white" />
        </div>
      </div>

      {/* Add Chapter Box */}
      <form onSubmit={addChapter} className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 mb-8 items-center">
        <input type="text" placeholder="Add a new chapter..." value={newChapterTitle} onChange={e => setNewChapterTitle(e.target.value)}
          className="flex-1 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium" />
        <div className="flex gap-2 w-full sm:w-auto">
          <select value={newChapterDiff} onChange={e => setNewChapterDiff(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium dark:bg-gray-700 dark:text-white outline-none">
            <option value="Easy">🟩 Easy</option>
            <option value="Medium">🟨 Medium</option>
            <option value="Hard">🟥 Hard</option>
          </select>
          <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm shadow-sm transition-colors w-full sm:w-auto">
            Add
          </button>
        </div>
      </form>

      {/* List Chapters */}
      <div className="space-y-3">
        {filteredChapters.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <p>No chapters found.</p>
          </div>
        )}
        {filteredChapters.map(ch => (
          <div key={ch.id} className={`group bg-white dark:bg-gray-800 rounded-xl border p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:shadow-md
             ${ch.status === 'Completed' ? 'border-l-4 border-l-green-500 border-gray-200 dark:border-gray-700 opacity-75' :
              ch.status === 'Needs Revision' ? 'border-l-4 border-l-red-500 border-gray-200 dark:border-gray-700' :
                'border-l-4 border-l-gray-300 dark:border-l-gray-600 border-gray-200 dark:border-gray-700'}
           `}>
            <div className="flex flex-col gap-1">
              <h3 className={`text-lg font-bold ${ch.status === 'Completed' ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                {ch.title}
              </h3>
              <div className="flex gap-3 text-xs font-semibold uppercase tracking-wider items-center">
                <span className={`px-2 py-0.5 rounded-full
                       ${ch.difficulty === 'Hard' ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' :
                    ch.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'}
                    `}>{ch.difficulty}</span>

                {ch.nextRevisionDate && ch.status !== 'Needs Revision' && (
                  <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    🔁 Next rev: {ch.nextRevisionDate}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Quick Action Buttons */}
              {ch.status !== 'Completed' && (
                <button onClick={() => updateChapter(ch.id, { status: "Completed" })} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors border border-green-200 dark:border-green-800">
                  Mark Done ✔️
                </button>
              )}
              {ch.status !== 'Needs Revision' && ch.status !== 'Not Started' && (
                <button onClick={() => updateChapter(ch.id, { status: "Needs Revision" })} className="px-3 py-1.5 text-xs font-bold rounded-lg bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors border border-red-200 dark:border-red-800">
                  Mark for Rev 🔁
                </button>
              )}

              <select value={ch.status} onChange={e => updateChapter(ch.id, { status: e.target.value })}
                className="px-2 py-1.5 text-xs font-semibold rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="Not Started">Not Started</option>
                <option value="Completed">Completed</option>
                <option value="Needs Revision">Needs Revision</option>
              </select>

              <button onClick={() => setData(prev => ({ ...prev, subjects: prev.subjects.map(s => s.id === subjectId ? { ...s, chapters: s.chapters.filter(x => x.id !== ch.id) } : s) }))}
                className="ml-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors" title="Delete">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
