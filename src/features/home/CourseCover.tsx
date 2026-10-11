/** A generated cover for a course card: a winding path between stops, drawn from a seed (the course id),
 *  so every course has its own picture without image files. Colours come from the design tokens. */
export function CourseCover({ seed }: { seed: string }) {
  const rand = seeded(seed)
  const tones = ['var(--brand)', 'var(--accent)', 'var(--lav)', 'var(--green)']
  const tone = tones[Math.floor(rand() * tones.length)]
  // 5 stops across the width, at random heights; the path curves through them.
  const stops = Array.from({ length: 5 }, (_, i) => ({ x: 24 + i * 68, y: 22 + rand() * 52 }))
  const d = stops.reduce(
    (path, p, i) => (i === 0 ? `M${p.x} ${p.y}` : `${path} C${stops[i - 1].x + 34} ${stops[i - 1].y} ${p.x - 34} ${p.y} ${p.x} ${p.y}`),
    '',
  )
  const rings = Array.from({ length: 3 }, () => ({ x: rand() * 320, y: rand() * 96, r: 18 + rand() * 40 }))
  return (
    <svg viewBox="0 0 320 96" preserveAspectRatio="xMidYMid slice" aria-hidden focusable="false" style={{ display: 'block', width: '100%', height: 96 }}>
      <rect width="320" height="96" fill="var(--brand-bg)" />
      {rings.map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r={c.r} fill="none" stroke={tone} strokeOpacity="0.12" strokeWidth="10" />
      ))}
      <path d={d} fill="none" stroke={tone} strokeWidth="4" strokeLinecap="round" strokeDasharray="1 9" />
      {stops.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={i === stops.length - 1 ? 7 : 4.5}
          fill={i === stops.length - 1 ? 'var(--accent)' : 'var(--surface)'}
          stroke={i === stops.length - 1 ? 'none' : tone}
          strokeWidth="2.5"
        />
      ))}
    </svg>
  )
}

/** Deterministic 0..1 generator from a string (FNV-1a hash → LCG). */
function seeded(text: string) {
  let s = 2166136261
  for (let i = 0; i < text.length; i++) s = Math.imul(s ^ text.charCodeAt(i), 16777619)
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    return s / 2 ** 32
  }
}
