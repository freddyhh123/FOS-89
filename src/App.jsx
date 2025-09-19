import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import './App.css'


const ROUTES = {
  '#home': 'home',
  '#resume': 'resume',
  '#projects': 'projects',
  '#test': 'test',
  '#chud': 'chud',
  '#help': 'help',
};

const COMMANDS = {
  cv: '#resume',
  resume: '#resume',
  projects: '#projects',
  home: '#home',
  test: '#test',
  chud: '#chud',
  help: '#help',
};


const CRT_LINK_STYLE = {
  color: '#00ff41',
  textDecoration: 'underline',
  fontWeight: 'bold',
  fontFamily: 'monospace',
};

const CRT_CONTAINER_DEFAULT = {
  overflowY: 'auto',
  overflowX: 'hidden',
  maxHeight: 'calc(100vh - 200px)',
  whiteSpace: 'pre-line',
};

const CRT_CONTAINER_PROJECTS = {
  ...CRT_CONTAINER_DEFAULT,
  padding: '0rem',
  maxWidth: '100%',
};


const resumeLines = [
  '[Download PDF: Frederick Horvath-Howard CV](download)',
  '========================================',
  'FREDERICK HORVATH-HOWARD',
  '========================================',
  '',
  'Email: fredhorvathoward@gmail.com',
  'LinkedIn: www.linkedin.com/in/fred-horvath-howard',
  '',
  '========== PROFILE ==========',
  'An enthusiastic computer scientist with a year of industry experience and a keen interest in self-hosting and data science. Seeking continued professional and personal growth opportunities in a challenging environment.',
  '========== EDUCATION ==========',
  'University of Bristol, MSc Data Science, 2024 - Current',
  '  - Large-scale data engineering: Distinction',
  '  - Technology, Innovation, Business and Society: Merit',
  'Oxford Brookes University Comp Sci, 2020 - 2024 - 1st (Hons) - 3.46 GPA',
  '  Key Modules:',
  '    - Machine Learning: A+',
  '    - Web Application Development: A+',
  '    - Final project featured in university tech showcase: A+',
  '    - Network and Multimedia: A',
  '    - Problem Solving and Programming: A',
  '    - Artificial intelligence: A',
  '    - Software Development with C and C++: B+',
  'A levels, Hereford Sixth Form College 2017-2020',
  '  - BTEC IT: Distinction',
  '',
  '========== IT SKILLS ==========',
  'Experience in:',
  '  - Linux, Docker, Adobe Suite, Git, Drupal, AWS (EC2, Lambda, Sagemaker)',
  '  - Python (PyTorch, Matplotlib, Flask, Pandas)',
  '  - R (R markdown)',
  '  - PHP (TWIG)',
  '  - Java, CSS',
  '',
  '========== RELEVANT WORK EXPERIENCE ==========',
  'Junior Developer at Webcurl Ltd, Kidlington Oxfordshire, Aug 2022-Aug 2023',
  '  - Developed tailored websites and systems for local councils, including the company website (https://www.webcurl.co.uk/).',
  '  - Special consideration for accessibility standards.',
  '  - First-line support for clients via ticketing system, phone, and email.',
  '  - Regularly handled high-importance issues and escalated when necessary.',
  '',
  '========== PRIOR WORK EXPERIENCE ==========',
  'Assistant at Haygarth Surgery, Hay-On-Wye, Summer 2019',
  '  - Helped admin team with daily tasks and record keeping.',
  '  - Improved teamwork and communication skills.',
  'Cashier at Maplin Hereford, Mar 2018-Jun 2018',
  '  - Experience working with the public and increased technical knowledge.',
  '',
  '========== SOFT SKILLS ==========',
  '  - Problem-solving, Teamwork, Communication, Clean driving license and transport,',
  '  - Understanding complex issues, Data storytelling, Confident Presenter, Understanding of data ethics',
  '',
  '========== INTERESTS ==========',
  '  - Guitar, music, games, custom computers, mechanical keyboards, marine biology, aquariums, reptiles, conservation, natural beauty.',
  '',
  '========================================',
  'REFERENCES AVAILABLE UPON REQUEST',
  '========================================'
];

const projectsLines = [
  'Projects WIP',
  '',
  'Below is a range of project I have completed over academia and in my personal time. I believe they reflect the range of skills I have aquired over the years.',
  'Pro tip: You can browse using the mouse, or the left and right keys on your keyboard!',
];

const homeLines = [
  'Welcome to Freds things',
  '========================================',
  "This site acts as a hub for my resume, projects, and other interests.",
  'Navigate with arrow keys, click, or use commands below.',
  '',
];

const testLines = [
  '========================================',
  'TEST PAGE',
  '========================================',
  '',
  'This is a test page with an image below:',
  '',
];

const chudLines = [
  '========================================',
  'Test PAGE',
  '========================================',
  '',
  'This is the test page 2 with an image below:',
  '',
];

const helpLines = [
  '========================================',
  'HELP',
  '========================================',
  '',
  'Available commands:',
  '- home',
  '- resume',
  '- projects',
  '- help',
  '',
  'Tips:',
  '- [S] Toggle Scanlines',
  '- [F] Toggle Flicker',
  '',
];

const splashLines = [
  '========================================',
  '         FredOS - 89 Booting...',
  '========================================',
  '',
'███████╗██████╗░███████╗██████╗░  ░█████╗░░██████╗  ░░░░░░  ░█████╗░░█████╗░',
'██╔════╝██╔══██╗██╔════╝██╔══██╗  ██╔══██╗██╔════╝  ░░░░░░  ██╔══██╗██╔══██╗',
'█████╗░░██████╔╝█████╗░░██║░░██║  ██║░░██║╚█████╗░  █████╗  ╚█████╔╝╚██████║',
'██╔══╝░░██╔══██╗██╔══╝░░██║░░██║  ██║░░██║░╚═══██╗  ╚════╝  ██╔══██╗░╚═══██║',
'██║░░░░░██║░░██║███████╗██████╔╝  ╚█████╔╝██████╔╝  ░░░░░░  ╚█████╔╝░█████╔╝',
'╚═╝░░░░░╚═╝░░╚═╝╚══════╝╚═════╝░  ░╚════╝░╚═════╝░  ░░░░░░  ░╚════╝░░╚════╝░',
  '',
  '         Initializing system...  Hi Spruce :)',
  '',
  '========================================'
];


function CRTText({ lines, speed = 10, onComplete, pageType }) {
  const [display, setDisplay] = useState(() => Array(lines.length).fill(''));
  const timeoutRef = useRef(null);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    const chars = Array(lines.length).fill('');
    const typeSpeed = prefersReducedMotion ? 0 : speed;

    if (typeSpeed === 0) {
      setDisplay([...lines]);
      onComplete && onComplete();
      return;
    }

    setDisplay(Array(lines.length).fill(''));

    const nextChar = () => {
      if (!lines || lineIdx >= lines.length) {
        onComplete && onComplete();
        return;
      }
      chars[lineIdx] += lines[lineIdx][charIdx] || '';
      setDisplay([...chars]);
      charIdx++;
      if (charIdx >= lines[lineIdx].length) {
        lineIdx++;
        charIdx = 0;
      }
      if (lineIdx < lines.length) {
        timeoutRef.current = setTimeout(nextChar, typeSpeed);
      } else {
        onComplete && onComplete();
      }
    };

    nextChar();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [lines, speed, prefersReducedMotion, onComplete]);

  return (
    <div aria-live="polite">
      {display.map((line, idx) => {

        if (pageType === 'home' && idx === 4) {
          return (
            <div key={idx}>
              <a href="#resume" style={CRT_LINK_STYLE}>Resume</a>
              <span style={{ margin: '0 2em' }} />
              <a href="#projects" style={CRT_LINK_STYLE}>Projects</a>
            </div>
          );
        }

        if (line.startsWith('Email: ')) {
          const addr = 'fredhorvathoward@gmail.com';
          return (
            <div key={idx}>
              Email:{' '}
              <a
                href={`mailto:${addr}`}
                style={CRT_LINK_STYLE}
              >
                {addr}
              </a>
            </div>
          );
        }

        if (idx === 0 && line.includes('[Download PDF')) {
          return (
            <div key={idx}>
              <a
                href="/FHH_CV.pdf"
                download="Frederick Horvath-Howard CV.pdf"
                style={CRT_LINK_STYLE}
              >
                Download PDF: Frederick Horvath-Howard CV
              </a>
            </div>
          );
        }

        const isExternal = line.startsWith('LinkedIn: ');
        if (isExternal) {
          const url = 'https://www.linkedin.com/in/fred-horvath-howard';
          return (
            <div key={idx}>
              LinkedIn:{' '}
              <a href={url} target="_blank" rel="noopener noreferrer" style={CRT_LINK_STYLE}>
                {url}
              </a>
            </div>
          );
        }
        return <div key={idx}>{line}</div>;
      })}
    </div>
  );
}

const projectTabs = [
  {
    label: 'Project 1',
    content: [
      'Project 1: Fallout CRT Website',
      'A personal website styled after a Fallout terminal, with CRT effects, command line navigation, and AWS hosting.',
      'Tech: React, Vite, CSS, AWS',
    ],
  },
  {
    label: 'Project 2',
    content: [
      'Project 2: Data Science Portfolio',
      'A collection of data science projects including ML models, visualizations, and reports.',
      'Tech: Python, R, Jupyter, Pandas',
    ],
  },
  {
    label: 'Project 3',
    content: [
      'Project 3: Custom Mechanical Keyboard',
      'Designed and built a custom mechanical keyboard with QMK firmware.',
      'Tech: QMK, PCB design, soldering',
    ],
  },
];

function ProjectsTabs() {
  const [selected, setSelected] = useState(0);
  const tablistRef = useRef(null);

  useEffect(() => {
    function handleTabKey(e) {
      if (window.location.hash !== '#projects') return;
      if (e.key === 'ArrowLeft') setSelected(s => (s > 0 ? s - 1 : projectTabs.length - 1));
      if (e.key === 'ArrowRight') setSelected(s => (s < projectTabs.length - 1 ? s + 1 : 0));
    }
    window.addEventListener('keydown', handleTabKey);
    return () => window.removeEventListener('keydown', handleTabKey);
  }, []);

  return (
    <div style={{ margin: '2em 0', width: '100%', position: 'relative' }}>
      <div
        ref={tablistRef}
        role="tablist"
        aria-label="Projects"
        style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0', position: 'relative', zIndex: 2, width: '100%' }}
      >
        {projectTabs.map((tab, idx) => {
          const isSel = selected === idx;
          return (
            <button
              key={tab.label}
              role="tab"
              aria-selected={isSel}
              aria-controls={`panel-${idx}`}
              id={`tab-${idx}`}
              onClick={() => setSelected(idx)}
              style={{
                cursor: 'pointer',
                background: '#181818',
                color: '#00ff41',
                border: '2px solid #00ff41',
                borderBottom: 'none',
                borderRadius: '8px 8px 0 0',
                padding: '0.5em 2em',
                marginRight: '0.5em',
                fontFamily: 'monospace',
                fontWeight: 'bold',
                position: 'relative',
                top: isSel ? '0' : '6px',
                zIndex: isSel ? 2 : 1,
                transition: 'all 0.2s',
                minWidth: '120px',
                textAlign: 'center',
                outline: isSel ? '2px solid #00ff41' : 'none',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div style={{ width: '100%', borderBottom: '2px solid #00ff41', marginTop: '-2px', marginBottom: '0' }} />

      <div
        role="tabpanel"
        id={`panel-${selected}`}
        aria-labelledby={`tab-${selected}`}
        tabIndex={0}
        style={{
          background: '#181818',
          border: '2px solid #00ff41',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          padding: '2em',
          fontFamily: 'monospace',
          color: '#00ff41',
          minHeight: '120px',
          position: 'relative',
          zIndex: 1,
          maxWidth: '100%',
          margin: '0 auto',
        }}
      >
        {projectTabs[selected].content.map((line, idx) => (
          <div key={idx} style={{ marginBottom: '0.5em' }}>{line}</div>
        ))}
      </div>
    </div>
  );
}


function App() {
  const [scanlines, setScanlines] = useState(true);
  const [flicker, setFlicker] = useState(true);
  const [command, setCommand] = useState('');
  const [error, setError] = useState('');
  const [page, setPage] = useState('home');
  const [splashPhase, setSplashPhase] = useState('animating'); // 'animating', 'hold', 'done'
  const [splashShown, setSplashShown] = useState(false);
  const contentRef = useRef(null);

  const handleSplashComplete = useCallback(() => {
    setSplashPhase('hold');
  }, []);

  useEffect(() => {
    function handleKey(e) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 's' || e.key === 'S') setScanlines(s => !s);
      if (e.key === 'f' || e.key === 'F') setFlicker(f => !f);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    function onHashChange() {
      const h = window.location.hash || '#resume';
      const nextPage = ROUTES[h] ?? 'resume';
      setPage(nextPage);

      if (nextPage === 'resume') {
        setSplashPhase(splashShown ? 'done' : 'animating');
      } else {
        setSplashPhase('done');
      }
    }
    window.addEventListener('hashchange', onHashChange);
    onHashChange();
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [splashShown]);

  // Splash timing
  useEffect(() => {
    if (splashPhase === 'hold') {
      const timeout = setTimeout(() => {
        setSplashPhase('done');
        setSplashShown(true);
      if (!window.location.hash) {
        window.location.hash = '#resume';
      }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [splashPhase]);

  // Navigate home
  const goHome = useCallback(() => {
    window.location.hash = '#home';
  }, []);

  // Command handler (with partial command support)
  function handleCommand(e) {
    e.preventDefault();
    const raw = command.trim().toLowerCase();
    const match =
      COMMANDS[raw] ??
      // partials: pick first command starting with input
      Object.keys(COMMANDS).find(k => k.startsWith(raw) && raw.length >= 2);

    if (match) {
      const hash = COMMANDS[match] ?? COMMANDS[raw];
      if (hash) window.location.hash = hash;
      setError('');
    } else if (raw === '' || raw === '?' || raw === 'help') {
      window.location.hash = '#help';
      setError('');
    } else {
      setError('Unknown command. Type "help" or "?".');
    }
    setCommand('');
  }

  // Resolve page lines
  const lines = useMemo(() => {
    if (splashPhase === 'animating' || splashPhase === 'hold') return splashLines;
    switch (page) {
      case 'resume': return resumeLines;
      case 'projects': return projectsLines;
      case 'test': return testLines;
      case 'chud': return chudLines;
      case 'help': return helpLines;
      default: return homeLines;
    }
  }, [page, splashPhase]);

  const contentStyle = page === 'projects' ? CRT_CONTAINER_PROJECTS : CRT_CONTAINER_DEFAULT;

  return (
    <>
      <div className="crt-frame">
        <div className="crt-frame-inner">
          <div className="crt">
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
              <div className="legend" style={{ fontSize: '0.9em', color: '#00ff41', opacity: 0.7, display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  onClick={goHome}
                  aria-label="Home"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontFamily: 'monospace',
                    textShadow: '0 0 6px #00ff41, 0 0 12px #003b1f',
                    filter: flicker ? 'url(#crt-flicker)' : 'none',
                    opacity: 0.95,
                    letterSpacing: '0.05em',
                    marginRight: '1em',
                    cursor: 'pointer',
                    color: '#00ff41',
                    fontWeight: 'bold',
                  }}
                >
                  [HOME]
                </button>
                <span style={{
                  height: '1.2em',
                  width: '2px',
                  background: 'linear-gradient(to bottom, #00ff41 60%, transparent 100%)',
                  margin: '0 1em',
                  display: 'inline-block',
                  borderRadius: '2px',
                  opacity: 0.7,
                  boxShadow: '0 0 6px #00ff41',
                }} />
                <strong>Keybinds:</strong>&nbsp;[S] Toggle Scanlines | [F] Toggle Flicker
              </div>
            </div>

            <div
              className="crt-content"
              style={contentStyle}
              ref={contentRef}
              tabIndex={-1}
            >
              {splashPhase === 'animating' ? (
                <CRTText lines={splashLines} speed={2} onComplete={handleSplashComplete} pageType="splash" />
              ) : splashPhase === 'hold' ? (
                <CRTText lines={splashLines} speed={0} pageType="splash" />
              ) : (
                <>
                  <CRTText lines={lines} speed={10} pageType={page} />

                  {page === 'test' && (
                    <div style={{ textAlign: 'center', marginTop: '2em' }}>
                      <img
                        src="/test-image.jpg"
                        alt="Test"
                        style={{
                          border: '2px solid #00ff41',
                          borderRadius: '8px',
                          boxShadow: '0 0 12px #00ff41',
                          background: '#181818',
                          maxWidth: '80%',
                          margin: '0 auto',
                          display: 'block',
                        }}
                      />
                    </div>
                  )}

                  {page === 'chud' && (
                    <div style={{ textAlign: 'center', marginTop: '2em' }}>
                      <img
                        src="/test-image.jpg"
                        alt="CHUD Test"
                        style={{
                          border: '2px solid #00ff41',
                          borderRadius: '8px',
                          boxShadow: '0 0 12px #00ff41',
                          background: '#181818',
                          maxWidth: '80%',
                          margin: '0 auto',
                          display: 'block',
                        }}
                      />
                    </div>
                  )}

                  {error && (
                    <div style={{ color: '#00ff41', marginBottom: '1em', textAlign: 'center' }}>
                      [⚠] {error}
                    </div>
                  )}

                  {page === 'projects' && <ProjectsTabs />}
                </>
              )}
            </div>

            {/* Scanlines overlay */}
            {scanlines && <div className="crt-scanlines" />}

            {/* Terminal */}
            <form className="terminal" onSubmit={handleCommand} autoComplete="off">
              <span className="terminal-label">{'>'}</span>
              <input
                className="terminal-input"
                type="text"
                value={command}
                onChange={e => setCommand(e.target.value)}
                placeholder="Type a command (projects, resume, home, help)"
                aria-label="Command input"
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
