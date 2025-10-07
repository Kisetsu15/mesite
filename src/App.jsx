import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const PROJECTS = [
    { title: 'Buried Alive', desc: 'Psychological horror FPS — underground facility, PBR visuals', link: '#' },
    { title: 'Override', desc: 'a third-person shooter where the player plays as a rogue AI', link: '#' },
    { title: 'ProtonDB', desc: 'A modular, embedded NoSQL database engine built with C and C#.', link: '#' }
];

const SKILLS = ['C#', 'Unity', 'Gameplay', 'UX', 'Game Feel', 'C', 'MongoDB', 'Neovim', 'Visual Studio', 'Blender', 'Git', 'Azure', 'Python'];
const GAMES = ['Cyberpunk 2077', 'Outer Worlds', 'Witcher', 'Apex Legends', 'Pokemon Legends Arceus'];
const ANIME = ['Cyberpunk 2077 Edgerunners', 'Weathering with You', 'Attack on Titan', 'Classroom of Elites', 'The Misfits of the Demon King Academy'];

export default function App() {
    const cardRefs = useRef([]);

    useEffect(() => {
        cardRefs.current.forEach((card) => {
            if (!card) return;

            const moveHandler = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const deltaX = (x - centerX) / centerX; // -1 to 1
                const deltaY = (y - centerY) / centerY; // -1 to 1

                // subtle rotation
                card.style.setProperty('--tilt-x', `${-deltaY * 5}deg`);
                card.style.setProperty('--tilt-y', `${deltaX * 5}deg`);

                // light reflection position
                card.style.setProperty('--rx', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--ry', `${(y / rect.height) * 100}%`);
            };

            const leaveHandler = () => {
                card.style.setProperty('--tilt-x', `0deg`);
                card.style.setProperty('--tilt-y', `0deg`);
                card.style.setProperty('--rx', `50%`);
                card.style.setProperty('--ry', `50%`);
                card.style.transition = 'transform 0.3s ease';
                setTimeout(() => (card.style.transition = ''), 300);
            };

            card.addEventListener('mousemove', moveHandler);
            card.addEventListener('mouseleave', leaveHandler);

            return () => {
                card.removeEventListener('mousemove', moveHandler);
                card.removeEventListener('mouseleave', leaveHandler);
            };
        });
    }, []);

    const setCardRef = (el, index) => {
        cardRefs.current[index] = el;
    };

    return (
        <main className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 18 }}>
                    <div>
                        <div className="namePlate">Dharshik</div>
                        <div className="h2">~ aka Kisetsu</div>
                        <div className="h2">Indie Game Developer - Systems Programmer</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div className="links">
                            <a href="https://github.com/Kisetsu15" target="_blank" rel="noreferrer">GitHub</a>
                            <a href="mailto:kisetsu15@gmail.com">Email</a>
                        </div>
                    </div>
                </div>

                <div className="bento" style={{ perspective: '1000px' }}>
                    {/* ABOUT */}
                    <section className="card area-about" ref={(el) => setCardRef(el, 0)}>
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                                <div>
                                    <h3 className="h1">About</h3>
                                    <div className="h2">
                                        Hi, I'm a self-taught indie dev who enjoys crafting immersive games and building tools that make dev life easier.
                                    </div>
                                </div>
                            </div>
                            <div className="meta-line" />
                            <p style={{ marginTop: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
                                I believe in making raw, fast, no-bullshit tools and games -  shipped over perfect.
                                No framework worship, no drag-drop magic. I build systems from the ground up.
                            </p>
                        </motion.div>
                    </section>

                    {/* PROJECTS */}
                    <section className="card area-projects" ref={(el) => setCardRef(el, 1)}>
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                            <h3 className="h1">Projects</h3>
                            <div className="h2">Select works & prototypes</div>
                            <div className="project-grid" style={{ marginTop: 12 }}>
                                {PROJECTS.map((p, i) => (
                                    <article className="project" key={i}>
                                        <h3>{p.title}</h3>
                                        <p>{p.desc}</p>
                                    </article>
                                ))}
                            </div>
                        </motion.div>
                    </section>

                    {/* SKILLS */}
                    <aside className="card area-skills" ref={(el) => setCardRef(el, 2)}>
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}>
                            <h3 className="h1">Skills</h3>
                            <div className="h2">Core tools & strengths</div>
                            <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                                {SKILLS.map((s, i) => <span className="badge" key={i}>{s}</span>)}
                            </div>
                        </motion.div>
                    </aside>

                    {/* GAMES */}
                    <aside className="card area-games" ref={(el) => setCardRef(el, 3)}>
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
                            <h3 className="h1">Games</h3>
                            <div className="small-list" style={{ marginTop: 12 }}>
                                {GAMES.map((g, i) => <div key={i}>- {g}</div>)}
                            </div>
                        </motion.div>
                    </aside>

                    {/* ANIME */}
                    <aside className="card area-anime" ref={(el) => setCardRef(el, 4)}>
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                            <h3 className="h1">Anime</h3>
                            <div className="small-list" style={{ marginTop: 12 }}>
                                {ANIME.map((a, i) => <div key={i}>- {a}</div>)}
                            </div>
                        </motion.div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
