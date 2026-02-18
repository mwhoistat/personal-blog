import { User, Code, Shield, Globe, Github, Linkedin, Mail, MapPin, Terminal, Server } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Tentang Saya - Nurathallah Putra Pratama',
    description: 'Profil Nurathallah Putra Pratama, Siswa SMK TKJ dengan minat di Cybersecurity, Pentesting, dan Web Development.',
}

const skills = [
    { category: 'Cybersecurity', items: ['Pentesting', 'Network Security', 'Linux Administration', 'CTF', 'Ethical Hacking'] },
    { category: 'Networking', items: ['Mikrotik', 'Cisco Packet Tracer', 'TCP/IP', 'Subnetting', 'Hardware Troubleshooting'] },
    { category: 'Web Dev', items: ['HTML/CSS', 'JavaScript', 'React', 'Next.js (Learning)', 'Tailwind CSS'] },
    { category: 'Tools', items: ['Wireshark', 'Nmap', 'Metasploit', 'Burp Suite', 'VS Code', 'Git'] },
]

export default function AboutPage() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            {/* Profile Section */}
            <section style={{ textAlign: 'center', marginBottom: '3rem' }} className="animate-fade-in">
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-accent), #a855f7, #ec4899)',
                    margin: '0 auto 1.5rem',
                    padding: '4px',
                }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-bg)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {/* Placeholder for user photo, using icon for now */}
                        <User size={48} style={{ color: 'var(--color-accent)' }} />
                    </div>
                </div>

                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    marginBottom: '0.5rem',
                }}>
                    Nurathallah Putra Pratama
                </h1>

                <p style={{
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '0.75rem',
                }}>
                    Siswa SMK TKJ | Cybersecurity Enthusiast
                </p>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.25rem',
                    color: 'var(--color-text-muted)',
                    fontSize: '0.875rem',
                    marginBottom: '1rem',
                }}>
                    <MapPin size={14} />
                    <span>Indonesia</span>
                </div>

                <p style={{
                    color: 'var(--color-text-secondary)',
                    fontSize: '1rem',
                    lineHeight: 1.7,
                    maxWidth: '600px',
                    margin: '0 auto 1.5rem',
                }}>
                    Saya adalah seorang siswa SMK jurusan Teknik Komputer dan Jaringan (TKJ) yang memiliki ketertarikan mendalam pada dunia Cybersecurity dan Penetration Testing.
                    Selain mendalami keamanan jaringan seperti Mikrotik dan Cisco, saya juga mulai mengeksplorasi Web Development untuk memahami cara membangun aplikasi yang aman.
                </p>

                {/* Social Links */}
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                    {[
                        { href: 'https://github.com', icon: Github, label: 'GitHub' },
                        { href: 'https://linkedin.com', icon: Linkedin, label: 'LinkedIn' },
                        { href: 'mailto:email@example.com', icon: Mail, label: 'Email' },
                    ].map(({ href, icon: Icon, label }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.375rem',
                                padding: '0.5rem 1rem',
                                borderRadius: '0.5rem',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                border: '1px solid var(--color-border)',
                                color: 'var(--color-text-secondary)',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                backgroundColor: 'var(--color-bg-secondary)',
                            }}
                        >
                            <Icon size={16} />
                            {label}
                        </a>
                    ))}
                </div>
            </section>

            {/* Skills */}
            <section style={{ marginBottom: '3rem' }} className="animate-fade-in animate-fade-in-delay-1">
                <h2 style={{
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <Shield size={20} style={{ color: 'var(--color-accent)' }} />
                    Skills & Minat
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '1rem',
                }}>
                    {skills.map((group) => (
                        <div
                            key={group.category}
                            style={{
                                padding: '1.25rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-secondary)',
                            }}
                        >
                            <h3 style={{
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                color: 'var(--color-accent)',
                                marginBottom: '0.75rem',
                            }}>
                                {group.category}
                            </h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                                {group.items.map((skill) => (
                                    <span
                                        key={skill}
                                        style={{
                                            padding: '0.25rem 0.625rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 500,
                                            backgroundColor: 'var(--color-bg-tertiary)',
                                            color: 'var(--color-text-secondary)',
                                        }}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience / Education */}
            <section className="animate-fade-in animate-fade-in-delay-2">
                <h2 style={{
                    fontSize: '1.375rem',
                    fontWeight: 700,
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                }}>
                    <Code size={20} style={{ color: 'var(--color-accent)' }} />
                    Pendidikan & Pengalaman
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                        { role: 'Siswa Jurusan TKJ', company: 'SMK (Sekolah Menengah Kejuruan)', period: '2024 - Sekarang', desc: 'Mempelajari administrasi infrastruktur jaringan, teknologi layanan jaringan, dan keamanan komputer.' },
                        { role: 'Cybersecurity Learner', company: 'Self-Taught', period: '2024 - Sekarang', desc: 'Aktif mempelajari teknik penetration testing, network defense, dan mengikuti Capture The Flag (CTF) challenges.' },
                        { role: 'Web Development Explorer', company: 'Project Based', period: '2024 - Sekarang', desc: 'Mulai membangun website sederhana dan mempelajari framework modern seperti Next.js untuk memperluas wawasan teknologi.' },
                    ].map((exp) => (
                        <div
                            key={exp.role}
                            style={{
                                padding: '1.25rem',
                                borderRadius: '0.75rem',
                                border: '1px solid var(--color-border)',
                                backgroundColor: 'var(--color-bg-secondary)',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{exp.role}</h3>
                                    <p style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: 600 }}>{exp.company}</p>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.625rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                    backgroundColor: 'var(--color-bg-tertiary)',
                                    color: 'var(--color-text-muted)',
                                }}>
                                    {exp.period}
                                </span>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
                                {exp.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact CTA */}
            <section style={{
                marginTop: '3rem',
                padding: '2rem',
                borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, var(--color-accent-light), transparent)',
                border: '1px solid var(--color-border)',
                textAlign: 'center',
            }} className="animate-fade-in animate-fade-in-delay-3">
                <Globe size={32} style={{ color: 'var(--color-accent)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Mari Terhubung!</h3>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    Tertarik berdiskusi tentang keamanan siber atau teknologi jaringan? Hubungi saya!
                </p>
                <a
                    href="mailto:email@example.com"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.625rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        color: 'white',
                        background: 'linear-gradient(135deg, var(--color-accent), #a855f7)',
                        textDecoration: 'none',
                    }}
                >
                    <Mail size={16} />
                    Kirim Email
                </a>
            </section>
        </div>
    )
}
