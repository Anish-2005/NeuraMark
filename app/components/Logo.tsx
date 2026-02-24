'use client';

interface LogoIconProps {
    size?: number;
    className?: string;
}

/**
 * NeuraMark Logo Icon — Next-Generation Futuristic "N" lettermark.
 *
 * Design:
 * - Stunning glassmorphism and neuro-cybernetic aesthetic.
 * - Dynamic neon gradients: deep purple, cyan, electric blue, and emerald green.
 * - Neural pathway logic: flowing continuous line forming an 'N' that culminates in a checkmark ("Mark").
 * - Glowing nexus nodes representing AI synapses.
 * - Automatically adapts with CSS variables or stands out with hardcoded premium neon colors.
 */
export function LogoIcon({ size = 32, className = '' }: LogoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="NeuraMark Logo"
            style={{ filter: 'drop-shadow(0px 4px 6px rgba(0,0,0,0.15))' }}
        >
            <defs>
                {/* Advanced Gradients */}
                {/* Background Plate Gradient */}
                <linearGradient id="bgPlate" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--bg-secondary, #1a1a24)" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="var(--bg-primary, #09090e)" stopOpacity="0.95" />
                </linearGradient>

                {/* Cyber-mesh border */}
                <linearGradient id="cyberBorder" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#8A2BE2" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#00FFAA" stopOpacity="0.6" />
                </linearGradient>

                {/* The core 'N' pathway gradient */}
                <linearGradient id="nPathway" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00F0FF" />    {/* Cyan */}
                    <stop offset="45%" stopColor="#7000FF" />   {/* Deep Purple */}
                    <stop offset="100%" stopColor="#00FFAA" />  {/* Neon Emerald Checkmark */}
                </linearGradient>

                {/* Node Glow Filters */}
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComponentTransfer in="blur" result="glow">
                        <feFuncA type="linear" slope="1.5" />
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode in="glow" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Backdrop Squircle */}
            <rect
                x="4" y="4" width="92" height="92" rx="26"
                fill="url(#bgPlate)"
                stroke="url(#cyberBorder)" strokeWidth="1.5"
            />

            {/* Overlay reflection / depth */}
            <rect
                x="4" y="4" width="92" height="92" rx="26"
                fill="none"
                stroke="#ffffff" strokeOpacity="0.06" strokeWidth="4"
                style={{ mixBlendMode: 'overlay' }}
            />

            {/* Futuristic Tech Grids / Inner Details */}
            <circle cx="50" cy="50" r="34" stroke="url(#nPathway)" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 6" />
            <circle cx="50" cy="50" r="26" stroke="url(#cyberBorder)" strokeWidth="1" strokeOpacity="0.15" />

            {/* The "N" & Checkmark Pathway */}
            {/* Left Vertical */}
            <path
                d="M 28 72 L 28 28"
                stroke="url(#nPathway)" strokeWidth="8.5" strokeLinecap="round"
                filter="url(#neonGlow)"
            />
            {/* Diagonal linking & Right checkmark kick */}
            {/* Starts top left -> dips down middle -> kicks up top right */}
            <path
                d="M 28 28 L 56 68 L 76 28"
                stroke="url(#nPathway)" strokeWidth="8.5" strokeLinecap="round" strokeLinejoin="round"
                filter="url(#neonGlow)"
            />

            {/* Secondary thin energy line for extreme detail */}
            <path
                d="M 28 72 L 28 28 L 56 68 L 76 28 L 82 20"
                stroke="#FFFFFF" strokeWidth="2" strokeOpacity="0.75" strokeLinecap="round" strokeLinejoin="round"
                style={{ mixBlendMode: 'overlay' }}
            />

            {/* Nexus Nodes (Synapses) */}
            <circle cx="28" cy="72" r="5" fill="#00F0FF" filter="url(#intenseGlow)" />
            <circle cx="28" cy="28" r="6" fill="#00F0FF" filter="url(#intenseGlow)" />
            <circle cx="56" cy="68" r="5.5" fill="#7000FF" filter="url(#intenseGlow)" />
            <circle cx="76" cy="28" r="6" fill="#00FFAA" filter="url(#intenseGlow)" />

            {/* Energy spark at the tip of the checkmark */}
            <circle cx="82" cy="20" r="3.5" fill="#FFFFFF" filter="url(#intenseGlow)" />

        </svg>
    );
}

interface LogoFullProps {
    size?: number;
    className?: string;
    showText?: boolean;
}

export function LogoFull({ size = 32, className = '', showText = true }: LogoFullProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <LogoIcon size={size} />
            {showText && (
                <span
                    className="font-extrabold tracking-tighter"
                    style={{
                        fontSize: size * 0.75,
                        lineHeight: 1,
                        background: 'linear-gradient(to right, var(--text-primary, #ffffff) 30%, #00F0FF 75%, #00FFAA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: 'transparent', // Fallback
                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))'
                    }}
                >
                    Neura<span style={{
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #00F0FF, #00FFAA)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>Mark</span>
                </span>
            )}
        </div>
    );
}

export function LogoMono({ size = 32, className = '' }: LogoIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="NeuraMark Logo"
        >
            <rect
                x="4" y="4" width="92" height="92" rx="26"
                fill="var(--text-primary)" fillOpacity="0.03"
                stroke="var(--border-default)" strokeWidth="1.5" strokeOpacity="0.6"
            />

            <circle cx="50" cy="50" r="34" stroke="var(--text-muted)" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="4 6" />

            {/* Neural pathways */}
            <path d="M 28 72 L 28 28" stroke="var(--text-primary)" strokeWidth="6" strokeLinecap="round" />
            <path d="M 28 28 L 56 68 L 76 28" stroke="var(--text-primary)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

            {/* Checkmark accent pop */}
            <path d="M 56 68 L 76 28 L 82 20" stroke="var(--accent-primary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

            {/* Nodes */}
            <circle cx="28" cy="72" r="4.5" fill="var(--text-primary)" />
            <circle cx="28" cy="28" r="4.5" fill="var(--text-primary)" />
            <circle cx="56" cy="68" r="4.5" fill="var(--text-primary)" />
            <circle cx="76" cy="28" r="4.5" fill="var(--accent-primary)" />
            <circle cx="82" cy="20" r="3" fill="var(--accent-primary)" />
        </svg>
    );
}

export default LogoIcon;
