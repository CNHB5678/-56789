import { GridSettings } from '@/types';

interface GridOverlayProps {
  settings: GridSettings;
}

export default function GridOverlay({ settings }: GridOverlayProps) {
  if (!settings.enabled) return null;

  const { type, color, opacity, spacing, dotSize } = settings;

  const renderGrid = () => {
    if (type === 'lines') {
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern
              id="grid-lines"
              width={spacing}
              height={spacing}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${spacing} 0 L 0 0 0 ${spacing}`}
                fill="none"
                stroke={color}
                strokeWidth={0.5}
                opacity={opacity}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-lines)" />
        </svg>
      );
    }

    if (type === 'dots') {
      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <pattern
              id="grid-dots"
              width={spacing}
              height={spacing}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={spacing / 2}
                cy={spacing / 2}
                r={dotSize || 2}
                fill={color}
                opacity={opacity}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-dots)" />
        </svg>
      );
    }

    if (type === 'random-dots') {
      const dots = Array.from({ length: 100 }).map((_, i) => {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * ((dotSize || 6) - 2) + 2;
        return { x, y, size, id: i };
      });

      return (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {dots.map((dot) => (
            <circle
              key={dot.id}
              cx={`${dot.x}%`}
              cy={`${dot.y}%`}
              r={dot.size / 2}
              fill={color}
              opacity={opacity}
            />
          ))}
        </svg>
      );
    }

    return null;
  };

  return renderGrid();
}
