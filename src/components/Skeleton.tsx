export function ArticleCardSkeleton() {
    return (
        <div style={{
            borderRadius: '0.75rem',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)',
            overflow: 'hidden',
        }}>
            <div className="skeleton" style={{ width: '100%', height: '200px' }} />
            <div style={{ padding: '1.25rem' }}>
                <div className="skeleton" style={{ width: '80px', height: '20px', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ width: '100%', height: '24px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ width: '80%', height: '24px', marginBottom: '0.75rem' }} />
                <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: '0.375rem' }} />
                <div className="skeleton" style={{ width: '60%', height: '16px', marginBottom: '1rem' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div className="skeleton" style={{ width: '120px', height: '14px' }} />
                    <div className="skeleton" style={{ width: '40px', height: '14px' }} />
                </div>
            </div>
        </div>
    )
}

export function ProjectCardSkeleton() {
    return (
        <div style={{
            borderRadius: '0.75rem',
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-secondary)',
            overflow: 'hidden',
        }}>
            <div className="skeleton" style={{ width: '100%', height: '200px' }} />
            <div style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem' }}>
                    <div className="skeleton" style={{ width: '60px', height: '18px', borderRadius: '9999px' }} />
                    <div className="skeleton" style={{ width: '50px', height: '18px', borderRadius: '9999px' }} />
                </div>
                <div className="skeleton" style={{ width: '100%', height: '24px', marginBottom: '0.5rem' }} />
                <div className="skeleton" style={{ width: '100%', height: '16px', marginBottom: '0.375rem' }} />
                <div className="skeleton" style={{ width: '70%', height: '16px', marginBottom: '1rem' }} />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div className="skeleton" style={{ width: '80px', height: '30px', borderRadius: '0.375rem' }} />
                    <div className="skeleton" style={{ width: '80px', height: '30px', borderRadius: '0.375rem' }} />
                </div>
            </div>
        </div>
    )
}

export function ArticleDetailSkeleton() {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
            <div className="skeleton" style={{ width: '120px', height: '24px', marginBottom: '1rem' }} />
            <div className="skeleton" style={{ width: '100%', height: '40px', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '70%', height: '40px', marginBottom: '1.5rem' }} />
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div className="skeleton" style={{ width: '100px', height: '16px' }} />
                <div className="skeleton" style={{ width: '80px', height: '16px' }} />
            </div>
            <div className="skeleton" style={{ width: '100%', height: '400px', marginBottom: '2rem' }} />
            {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton" style={{ width: `${100 - i * 5}%`, height: '16px', marginBottom: '0.75rem' }} />
            ))}
        </div>
    )
}
