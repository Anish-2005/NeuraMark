'use client';

interface LogoIconProps {
    size?: number;
    className?: string;
}

/**
 * NeuraMark Logo Icon — Neural network node with integrated checkmark.
 * Automatically adapts to light/dark theme via CSS variables.
 * 
 * Design concept: Three interconnected nodes forming a neural path,
 * with the central node containing a checkmark (the "Mark" in NeuraMark).
 */
export function LogoIcon({ size = 32, className = '' }: LogoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="NeuraMark Logo"
        >
            {/* Background rounded square */}
            <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="12"
                fill="var(--accent-primary)"
            />

            {/* Neural connection lines */}
            <path
                d="M12 14L24 24M24 24L36 14M24 24L24 36"
                stroke="var(--text-on-accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeOpacity="0.4"
            />

            {/* Top-left node */}
            <circle cx="12" cy="14" r="3.5" fill="var(--text-on-accent)" fillOpacity="0.5" />

            {/* Top-right node */}
            <circle cx="36" cy="14" r="3.5" fill="var(--text-on-accent)" fillOpacity="0.5" />

            {/* Bottom node */}
            <circle cx="24" cy="36" r="3.5" fill="var(--text-on-accent)" fillOpacity="0.5" />

            {/* Central node (larger) */}
            <circle cx="24" cy="24" r="9" fill="var(--text-on-accent)" fillOpacity="0.15" />
            <circle cx="24" cy="24" r="9" stroke="var(--text-on-accent)" strokeWidth="1.5" strokeOpacity="0.5" />

            {/* Checkmark inside central node */}
            <path
                d="M19.5 24L22.5 27L28.5 21"
                stroke="var(--text-on-accent)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

interface LogoFullProps {
    size?: number;
    className?: string;
    showText?: boolean;
}

/**
 * Full NeuraMark logo with icon + wordmark.
 * Adapts to light/dark theme automatically.
 */
export function LogoFull({ size = 28, className = '', showText = true }: LogoFullProps) {
    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <LogoIcon size={size} />
            {showText && (
                <span
                    className="font-bold tracking-tight"
                    style={{
                        fontSize: size * 0.6,
                        color: 'var(--text-primary)',
                        lineHeight: 1,
                    }}
                >
                    Neura<span style={{ color: 'var(--accent-primary)' }}>Mark</span>
                </span>
            )}
        </div>
    );
}

/**
 * Monochrome logo variant for light backgrounds (e.g. loading screens).
 */
export function LogoMono({ size = 32, className = '' }: LogoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="NeuraMark Logo"
        >
            <rect
                x="2"
                y="2"
                width="44"
                height="44"
                rx="12"
                fill="var(--text-primary)"
                fillOpacity="0.08"
                stroke="var(--border-default)"
                strokeWidth="1"
            />

            {/* Neural connection lines */}
            <path
                d="M12 14L24 24M24 24L36 14M24 24L24 36"
                stroke="var(--text-muted)"
                strokeWidth="1.5"
                strokeLinecap="round"
            />

            {/* Nodes */}
            <circle cx="12" cy="14" r="3" fill="var(--text-muted)" fillOpacity="0.5" />
            <circle cx="36" cy="14" r="3" fill="var(--text-muted)" fillOpacity="0.5" />
            <circle cx="24" cy="36" r="3" fill="var(--text-muted)" fillOpacity="0.5" />

            {/* Central node */}
            <circle cx="24" cy="24" r="8" stroke="var(--accent-primary)" strokeWidth="1.5" />

            {/* Checkmark */}
            <path
                d="M19.5 24L22.5 27L28.5 21"
                stroke="var(--accent-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default LogoIcon;
