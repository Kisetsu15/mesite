import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line
import { motion } from 'framer-motion';

const DEFAULT_COMMANDS = {
  help: { desc: 'Show available commands' },
  about: { desc: 'Show about text' },
  clear: { desc: 'Clear the terminal' },
  date: { desc: 'Show current date/time' },
  echo: { desc: 'Echo arguments' },
  resume: { desc: 'Open resume link' },
  github: { desc: 'Open GitHub link' },
  download: { desc: 'Download example file' },
};

const STORAGE_KEY = 'terminal:webapp:log:v1';

export default function App() {
  const [log, setLog] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [{ t: welcomeMessage() }];
    } catch {
      return [{ t: welcomeMessage() }];
    }
  });

  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(null);

  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function appendOutput(text, meta = {}) {
    setLog(l => [...l, { t: text, ...meta }]);
  }

  function runCommand(raw) {
    const trimmed = raw.trim();
    if (!trimmed) return;
    setHistory(h => [...h, trimmed]);
    setHistIndex(null);
    appendOutput(`# ${ trimmed } `, { cmd: true });

    const [cmd, ...args] = trimmed.split(/\s+/);

    switch (cmd.toLowerCase()) {
      case 'help': appendOutput(listCommands()); break;
      case 'about': appendOutput('Hi — I\'m a developer. This terminal is a web component for my personal site.'); break;
      case 'clear': setLog([]); break;
      case 'date': appendOutput(new Date().toString()); break;
      case 'echo': appendOutput(args.join(' ')); break;
      case 'resume': appendOutput('Opening resume...'); window.open('https://example.com/resume.pdf', '_blank'); break;
      case 'github': appendOutput('Opening GitHub...'); window.open('https://github.com/', '_blank'); break;
      case 'download': doDownloadExample(); break;
      default: appendOutput(`Command not found: ${ cmd }. Type "help".`);
    }
  }

function doDownloadExample() {
    const blob = new Blob(['Example file content'], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
    appendOutput('Downloaded example file.');
}

function listCommands() {
    return Object.entries(DEFAULT_COMMANDS)
        .map(([k, v]) => `${k.padEnd(10)} - ${v.desc}`)
        .join('\n');
}

function onSubmit(e) {
    e.preventDefault();
    if (input === '') {
        appendOutput('\u200B#');
    } else {
        runCommand(input);
    }
    setInput('');
}

function onKeyDown(e) {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (history.length === 0) return;
        let nextIndex = histIndex;
        if (nextIndex === null) {
            nextIndex = history.length - 1;
        } else if (nextIndex > 0) {
            nextIndex = nextIndex - 1;
        }
        setHistIndex(nextIndex);
        setInput(history[nextIndex]);
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (history.length === 0) return;
        if (histIndex === null) return;
        let nextIndex = histIndex + 1;
        if (nextIndex >= history.length) {
            setHistIndex(null);
            setInput('');
        } else {
            setHistIndex(nextIndex);
            setInput(history[nextIndex]);
        }
    } else {
        if (histIndex !== null) setHistIndex(null);
    }
}

return (
    <div className="min-h-screen h-screen w-screen flex items-center justify-center p-0" style={{ background: 'var(--terminal-bg)' }}>
        <div className="w-full h-full classic-terminal">
            <div className="flex flex-col h-full">

                <div className="flex-1 overflow-auto p-6">
                    <div className="whitespace-pre-wrap text-sm leading-6 font-mono">
                        {log.map((entry, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.18 }}
                                className="mb-2"
                            >
                                <span>{entry.t}</span>
                            </motion.div>
                        ))}

                        <form onSubmit={onSubmit} className="flex items-center gap-2 mt-2" style={{ marginBottom: '0' }}>
                            <span className="classic-prompt font-mono">#</span>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={onKeyDown}
                                className="flex-1 classic-input outline-none text-sm placeholder:opacity-50"
                                autoComplete="off"
                                style={{ background: 'transparent', border: 'none', color: 'var(--terminal-fg)' }}
                            />
                        </form>

                        <div ref={endRef} />
                    </div>
                </div>
            </div>
        </div>
    </div>
);
}

function welcomeMessage() {
    return `Welcome to my terminal — web edition.\n\nType 'help' to see available commands.\n`;
}