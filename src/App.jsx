import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_COMMANDS = {
    help: { desc: 'Show available commands' },
    whoareyou: { desc: 'Show about text' },
    clear: { desc: 'Clear the terminal' },
    date: { desc: 'Show current date/time' },
    echo: { desc: 'Echo arguments' },
    github: { desc: 'Open GitHub link' },
};

export default function App() {
    const [log, setLog] = useState([{ t: welcomeMessage() }]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState([]);
    const [histIndex, setHistIndex] = useState(null);

    const inputRef = useRef(null);
    const endRef = useRef(null);

    // Animated placeholder
    const [placeholderText, setPlaceholderText] = useState('');
    const [commandIndex, setCommandIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [userTyped, setUserTyped] = useState(false);
    const [initialDelayDone, setInitialDelayDone] = useState(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    // Placeholder animation with initial 2s wait
    useEffect(() => {
        if (userTyped) return;
        if (!initialDelayDone) {
            const delay = setTimeout(() => setInitialDelayDone(true), 2000);
            return () => clearTimeout(delay);
        }

        const commandNames = Object.keys(DEFAULT_COMMANDS);
        const commandDescs = Object.values(DEFAULT_COMMANDS).map(c => c.desc);
        const fullText = `${commandNames[commandIndex]} -> ${commandDescs[commandIndex]}`;

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                setPlaceholderText(fullText.slice(0, charIndex + 1));
                if (charIndex + 1 === fullText.length) {
                    setTimeout(() => setIsDeleting(true), 1500);
                } else {
                    setCharIndex(charIndex + 1);
                }
            } else {
                setPlaceholderText(fullText.slice(0, charIndex - 1));
                if (charIndex - 1 <= 0) {
                    setIsDeleting(false);
                    setCommandIndex((commandIndex + 1) % commandNames.length);
                    setCharIndex(0);
                } else {
                    setCharIndex(charIndex - 1);
                }
            }
        }, charIndex === 0 && !isDeleting ? 50 : 50);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, commandIndex, userTyped, initialDelayDone]);

    function appendOutput(text, meta = {}) {
        setLog(l => [...l, { t: text, ...meta }]);
    }

    function runCommand(raw) {
        const trimmed = raw.trim();
        if (!trimmed) return;
        setHistory(h => [...h, trimmed]);
        setHistIndex(null);
        appendOutput(`# ${trimmed} `, { cmd: true });

        const [cmd, ...args] = trimmed.split(/\s+/);

        switch (cmd.toLowerCase()) {
            case 'help': appendOutput(listCommands()); break;
            case 'whoareyou': appendOutput("Hi! I'm a developer. This terminal is a web component for my personal site."); break;
            case 'clear': setLog([{ t: welcomeMessage() }]); break;
            case 'date': appendOutput(new Date().toString()); break;
            case 'echo': appendOutput(args.join(' ')); break;
            case 'github': appendOutput('Opening GitHub...'); window.open('https://github.com/Kisetsu15', '_blank'); break;
            default: appendOutput(`Command not found: ${cmd}. Type "help".`);
        }
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
            if (!history.length) return;
            let nextIndex = histIndex ?? history.length - 1;
            if (nextIndex > 0) nextIndex--;
            setHistIndex(nextIndex);
            setInput(history[nextIndex]);
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!history.length || histIndex === null) return;
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
        <div className="min-h-screen w-screen flex items-center justify-center" style={{ background: 'var(--terminal-bg)' }}>
            <div className="w-full h-full classic-terminal flex flex-col">
                <div className="flex-1 overflow-auto p-6">
                    <div className="whitespace-pre-wrap font-mono text-sm leading-6" style={{ fontSize: '1.2rem' }}>
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

                        <form onSubmit={onSubmit} className="flex items-center mt-2">
                            <span className="classic-prompt"># </span>
                            <input
                                ref={inputRef}
                                value={input}
                                onChange={e => {
                                    setInput(e.target.value);
                                    setUserTyped(true);
                                }}
                                onKeyDown={onKeyDown}
                                placeholder={placeholderText}
                                autoComplete="off"
                                className="flex-1 classic-input block-cursor outline-none"
                                style={{ background: 'transparent', border: 'none', color: 'var(--accent)', fontSize: '1.2rem' }}
                            />
                        </form>

                        <div ref={endRef} />
                    </div>
                </div>
            </div>
        </div>
    );
}

function welcomeMessage() {
    return `Welcome to my site.\n\nType 'help' to see available commands.\n`;
}
