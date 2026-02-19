'use client'

import { Github, Twitter, Linkedin, Mail, Shield, Globe, Cpu, Terminal, Activity } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="relative bg-[var(--color-bg-secondary)] border-t border-[var(--color-border)] pt-20 pb-10 mt-20 overflow-hidden">
            {/* Background Grid Accent */}
            <div className="absolute inset-0 bg-grid-cyber opacity-10 pointer-events-none"></div>

            <div className="relative max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">

                    {/* Brand Identity */}
                    <div className="col-span-1 md:col-span-5">
                        <Link href="/" className="flex items-center gap-3 mb-6 group w-fit">
                            <div className="p-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded group-hover:border-[var(--color-accent)] transition-colors">
                                <Terminal size={24} className="text-[var(--color-accent)]" />
                            </div>
                            <div>
                                <h2 className="font-mono-tech font-bold text-xl tracking-tight text-[var(--color-text)]">ATHA<span className="text-[var(--color-accent)]">.SEC</span></h2>
                                <p className="text-[var(--color-text-muted)] text-xs font-mono-tech tracking-wider">CYBERSECURITY & NETWORK ENG</p>
                            </div>
                        </Link>
                        <p className="text-[var(--color-text-secondary)] mb-8 max-w-md leading-relaxed text-sm">
                            Documenting the journey through digital landscapes, vulnerability research, and network architecture.
                            Built for those who live in the terminal.
                        </p>

                        <div className="flex gap-3">
                            {[
                                { icon: Github, href: "https://github.com/nurathallah", label: "Github" },
                                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
                                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                                { icon: Mail, href: "mailto:contact@atha.dev", label: "Email" }
                            ].map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 bg-[var(--color-bg)] border border-[var(--color-border)] rounded hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:shadow-[0_0_10px_rgba(0,255,157,0.2)] transition-all group"
                                    aria-label={social.label}
                                >
                                    <social.icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="col-span-1 md:col-span-3">
                        <h3 className="font-mono-tech text-sm font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-sm"></span> DIRECTORY
                        </h3>
                        <ul className="space-y-3 font-mono-tech text-sm">
                            {['Home', 'Articles', 'Projects', 'Certificates', 'About', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                        className="text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:pl-2 transition-all flex items-center gap-2 group"
                                    >
                                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-accent)]">{'>'}</span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* System Status */}
                    <div className="col-span-1 md:col-span-4">
                        <h3 className="font-mono-tech text-sm font-bold text-[var(--color-text)] mb-6 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-[var(--color-cyan)] rounded-sm"></span> SYSTEM_METRICS
                        </h3>
                        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-5 font-mono-tech text-xs space-y-4">
                            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                                <span className="text-[var(--color-text-muted)]">STATUS</span>
                                <span className="text-[var(--color-success)] flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-success)] opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-success)]"></span>
                                    </span>
                                    OPERATIONAL
                                </span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                                <span className="text-[var(--color-text-muted)]">BUILD</span>
                                <span className="text-[var(--color-cyan)]">v2.4.0-STABLE</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-3">
                                <span className="text-[var(--color-text-muted)]">REGION</span>
                                <span className="text-[var(--color-text)]">ASIA-SE1 (JKT)</span>
                            </div>
                            <div className="space-y-2 pt-1">
                                <div className="flex justify-between text-[var(--color-text-muted)] mb-1">
                                    <span>LOADDATA</span>
                                    <span>24ms</span>
                                </div>
                                <div className="h-1 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
                                    <div className="h-full w-[15%] bg-[var(--color-accent)] animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono-tech text-[var(--color-text-muted)]">
                    <p>
                        COPYRIGHT © {currentYear} <span className="text-[var(--color-text-secondary)]">NURATHALLAH PUTRA PRATAMA</span>
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/rss" className="hover:text-[var(--color-accent)] transition-colors">RSS_FEED</Link>
                        <Link href="/sitemap.xml" className="hover:text-[var(--color-accent)] transition-colors">SITEMAP</Link>
                        <Link href="/pgp" className="hover:text-[var(--color-accent)] transition-colors">PGP_KEY</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
