'use client'

import { Terminal, Code, Cpu, Shield, Server, Globe } from 'lucide-react'

export default function AboutPage() {
    return (
        <div className="max-w-5xl mx-auto px-6 py-24">
            {/* Header */}
            <div className="mb-16">
                <div className="inline-flex items-center gap-2 mb-4 text-[var(--color-accent)] font-mono-tech text-sm">
                    <Terminal size={14} />
                    <span>student@smk-tkj:~$ whoami</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">About Me</h1>
                <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl leading-relaxed">
                    11th Grade Network Engineering (TKJ) student exploring the world of cybersecurity and web development. Passionate about bug bounty hunting and understanding how networks operate.
                </p>
            </div>

            {/* Terminal Bio */}
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-lg overflow-hidden mb-16 shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="ml-4 text-xs font-mono-tech text-[var(--color-text-muted)]">profile.json</div>
                </div>
                <div className="p-6 font-mono-tech text-sm md:text-base overflow-x-auto">
                    <pre className="text-[var(--color-text-secondary)]">
                        {`{
  "name": "Nurathallah Putra Pratama",
  "role": "Student & Bug Bounty Hunter",
  "status": "Learning Mode",
  "education": "SMK (11th Grade) - TKJ",
  "started_coding": "2024",
  "interests": [
    "Bug Bounty Hunting",
    "Network Engineering",
    "Web Technologies",
    "CTF Challenges"
  ],
  "contact": "contact@atha.dev" // Placeholder
}`}
                    </pre>
                </div>
            </div>

            {/* Tech Stack / Skills Grid */}
            <div className="mb-20">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <span className="text-[var(--color-cyan)]">01.</span> Current Focus
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Security */}
                    <div className="p-6 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-accent)] transition-colors group">
                        <Shield className="mb-4 text-[var(--color-accent)]" size={32} />
                        <h3 className="font-bold mb-4 font-mono-tech">Cyber Security</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-4">Focusing on Bug Bounty & Web Security</p>
                        <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-accent)]">Web Vulnerability Basics</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-accent)]">Bug Bounty Hunting</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-accent)]">Reconnaissance Tools</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-accent)]">Burp Suite Community</li>
                        </ul>
                    </div>

                    {/* Infrastructure */}
                    <div className="p-6 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-cyan)] transition-colors group">
                        <Server className="mb-4 text-[var(--color-cyan)]" size={32} />
                        <h3 className="font-bold mb-4 font-mono-tech">Networking (TKJ)</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-4">Vocational High School Curriculum</p>
                        <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-cyan)]">Network Fundamentals</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-cyan)]">MikroTik Basics</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-cyan)]">Cisco Packet Tracer</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-cyan)]">Linux Administration</li>
                        </ul>
                    </div>

                    {/* Development */}
                    <div className="p-6 border border-[var(--color-border)] rounded-lg hover:border-[var(--color-text)] transition-colors group">
                        <Code className="mb-4 text-[var(--color-text)]" size={32} />
                        <h3 className="font-bold mb-4 font-mono-tech">Web Dev</h3>
                        <p className="text-xs text-[var(--color-text-secondary)] mb-4">Building projects like this blog</p>
                        <ul className="space-y-2 text-[var(--color-text-secondary)] text-sm">
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-text)]">HTML, CSS, JavaScript</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-text)]">Next.js (App Router)</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-text)]">Tailwind CSS</li>
                            <li className="flex items-center gap-2 before:content-['>'] before:text-[var(--color-text)]">Supabase Integration</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Timeline / Experience */}
            <div>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <span className="text-[var(--color-warning)]">02.</span> System Log
                </h2>
                <div className="relative border-l border-[var(--color-border)] ml-3 space-y-12">
                    {[
                        { year: '2026', title: 'Running My Own Blog', company: 'Personal Project', desc: 'Developing and maintaining this cybersecurity portfolio using Next.js and Supabase.' },
                        { year: '2024 - 2025', title: 'Started Learning Journey', company: 'SMK Grade 10', desc: 'Officially started learning Cyber Security, Networking, and Web Development. Enrolled in TKJ major.' },
                    ].map((item, i) => (
                        <div key={i} className="relative pl-8">
                            <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-[var(--color-border)] ring-4 ring-[var(--color-bg)]"></div>
                            <span className="font-mono-tech text-xs text-[var(--color-accent)] mb-1 block">{item.year}</span>
                            <h3 className="text-lg font-bold">{item.title}</h3>
                            <p className="text-sm text-[var(--color-text-muted)] mb-2 font-mono-tech">@ {item.company}</p>
                            <p className="text-[var(--color-text-secondary)]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
