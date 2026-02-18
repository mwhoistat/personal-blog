'use client'

import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
    placeholder?: string
    onSearch: (query: string) => void
    defaultValue?: string
}

export default function SearchBar({ placeholder = 'Cari...', onSearch, defaultValue = '' }: SearchBarProps) {
    const [query, setQuery] = useState(defaultValue)

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(query)
        }, 300)
        return () => clearTimeout(timer)
    }, [query, onSearch])

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
        }}>
            <Search
                size={16}
                style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-text-muted)',
                }}
            />
            <input
                type="text"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    width: '100%',
                    padding: '0.625rem 0.875rem 0.625rem 2.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    color: 'var(--color-text)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px var(--color-accent-light)'
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-border)'
                    e.currentTarget.style.boxShadow = 'none'
                }}
            />
        </div>
    )
}
