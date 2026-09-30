// Central SVG icon library — stroke-based, inherits currentColor
const PATHS = {
  lungs: (
    <>
      <path d="M12 4v5" />
      <path d="M12 9c0 0-4 1-5.2 4.4C6 15.6 6 19 6 19c0 .6.4 1 1 1 2.4 0 5-2.5 5-6V9z" />
      <path d="M12 9c0 0 4 1 5.2 4.4C18 15.6 18 19 18 19c0 .6-.4 1-1 1-2.4 0-5-2.5-5-6V9z" />
    </>
  ),
  wind: <path d="M9.6 4.6A2 2 0 1 1 11 8H3m10.6 11.4A2 2 0 1 0 14 16H3m15.7-8.6A2.5 2.5 0 1 1 19.5 12H3" />,
  check: <path d="M20 6L9 17l-5-5" />,
  alertCircle: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.01" />
    </>
  ),
  alertTri: <path d="M12 9v4M12 17v.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />,
  cough: (
    <>
      <path d="M6 18c-2 0-3-1.4-3-3 0-4 4-4 4-8 0-3 2.5-4 5-4s5 1 5 4c0 2-3 3-4 5s-1 6-7 6z" />
      <path d="M17 16h4M18 20h3" />
    </>
  ),
  chest: (
    <>
      <rect x="5" y="7" width="14" height="13" rx="3" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2M9 13h6" />
    </>
  ),
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  zap: <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />,
  pollution: (
    <>
      <path d="M3 15h9a2.5 2.5 0 1 0-2.4-3.2M3 19h13a2.5 2.5 0 1 1-2.4 3.2M3 11h6" />
    </>
  ),
  pollen: <path d="M12 2c1 3-2 4-1 6 .7 1.4 3 2 3 4a4 4 0 1 1-8 0c0-2 2.3-2.6 3-4 1-2-2-3-1-6" />,
  paw: (
    <>
      <circle cx="6.5" cy="10" r="1.6" />
      <circle cx="17.5" cy="10" r="1.6" />
      <circle cx="9.5" cy="5.5" r="1.6" />
      <circle cx="14.5" cy="5.5" r="1.6" />
      <path d="M12 11c-2.8 0-5 2.2-5 4.6 0 1.7 1.3 3 3 3 .8 0 1.4-.3 2-.3s1.2.3 2 .3c1.7 0 3-1.3 3-3C17 13.2 14.8 11 12 11z" />
    </>
  ),
  cigarette: (
    <>
      <path d="M18 12h3v3h-3zM3 13.5h15" />
      <path d="M18 12c.5-2 2-2.5 2-5M20.5 12c.5-2 2-2.5 2-5" />
    </>
  ),
  cold: <path d="M12 2v20M4 6l16 12M20 6L4 18M8 3.5L12 6l4-2.5M8 20.5L12 18l4 2.5M3 10l3 2-3 2M21 10l-3 2 3 2" />,
  virus: (
    <>
      <circle cx="12" cy="12" r="7" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5.5 5.5l2 2M16.5 16.5l2 2M18.5 5.5l-2 2M7.5 16.5l-2 2M10 12h4M12 10v4" />
    </>
  ),
  heart: <path d="M12 21c-4.4 0-8-3.1-8-7 0-2.6 1.7-4.6 3.4-5.6C8.9 7.4 10 6 12 4c0 2.6 1.4 4.4 2.8 5.6C17.1 11 20 12.7 20 14c0 4-3.6 7-8 7z" />,
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="15" rx="3" />
      <path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4.5" />
    </>
  ),
  runner: <path d="M13 4a1.5 1.5 0 1 0 0 .01zM5 21l4-4 2 2M12 19l2-5-3-3-4 1M11 11l-4-2M14 6l3 1 2 3" />,
  vaccine: <path d="M4 19V9l8-5 8 5v10M4 19h16M4 19l3-4h10l3 4M12 11v4" />,
  sleepHeart: <path d="M12 21s-7-4.6-9.3-9A5.4 5.4 0 0 1 12 6.7 5.4 5.4 0 0 1 21.3 12c-2.3 4.4-9.3 9-9.3 9z" />,
  notes: (
    <>
      <path d="M4 12h16M4 6h16M4 18h10" />
      <circle cx="19" cy="18" r="2" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  activity: <path d="M22 12h-4l-3 8-6-16-3 8H2" />,
  factory: <path d="M2 20h20M5 20V9l5 3V9l5 3V4h4v16M9 16h.01M13 16h.01M17 8h.01" />,
  shield: (
    <>
      <path d="M12 3l7 4v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V7l7-4z" />
      <path d="M9 12l2 2 4-4.5" />
    </>
  ),
  stetho: (
    <>
      <path d="M12 2c1 3-2 4-1 6 .7 1.4 3 2 3 4a4 4 0 1 1-8 0c0-2 2.3-2.6 3-4 1-2-2-3-1-6M12 22c-2-1-3-2.5-3-4" />
    </>
  ),
  moonStar: (
    <>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      <path d="M17 4l.6 1.8 1.8.6-1.8.6L17 8.8l-.6-1.8-1.8-.6 1.8-.6L17 4z" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="7" r="3.4" />
      <path d="M6 21c.5-3.4 2.8-5.5 6-5.5s5.5 2.1 6 5.5" />
    </>
  ),
  arrowRight: <path d="M5 12h14M13 6l6 6-6 6" />,
  arrowUp: <path d="M12 19V5M5 12l7-7 7 7" />,
  chevronDown: <path d="M6 9l6 6 6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h10" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  mic: (
    <>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 10a7 7 0 0 0 14 0M12 17v4M8 21h8" />
    </>
  ),
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  sparkles: (
    <>
      <path d="M12 3l1.8 4.6 4.7 1.4-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4L12 3z" />
      <path d="M19 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="7" width="16" height="13" rx="4" />
      <path d="M12 7V4M8 4h8" />
      <circle cx="9" cy="13" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
      <path d="M9.5 16.5h5" />
    </>
  ),
  volume: <path d="M11 5L6 9H3v6h3l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M18.4 5.6a9 9 0 0 1 0 12.8" />,
  volumeX: <path d="M11 5L6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6" />,
  printer: (
    <>
      <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </>
  ),
  phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.2a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.6 2z" />,
  mail: (
    <>
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M22 6l-10 7L2 6" />
    </>
  ),
  mapPin: (
    <>
      <path d="M21 10c0 7-9 12-9 12S3 17 3 10a9 9 0 1 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 2A2.5 2.5 0 0 0 7 4.5v.3a3 3 0 0 0-2 2.9 3 3 0 0 0-1.5 2.6 3 3 0 0 0 1.5 2.6A3 3 0 0 0 7 16v.3A2.5 2.5 0 0 0 9.5 19c.6 0 1.2-.2 1.5-.5V3.6c-.4-.4-1-.6-1.5-.6z" transform="translate(0 .5)" />
      <path d="M14.5 2A2.5 2.5 0 0 1 17 4.5v.3a3 3 0 0 1 2 2.9 3 3 0 0 1 1.5 2.6 3 3 0 0 1-1.5 2.6A3 3 0 0 1 17 16v.3a2.5 2.5 0 0 1-2.5 2.5c-.6 0-1.2-.2-1.5-.5V3.6c.4-.4 1-.6 1.5-.6z" transform="translate(0 .5)" />
    </>
  ),
  message: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5c-1.5 0-3-.4-4.2-1.1L3 20l1.2-5.3A8.5 8.5 0 1 1 21 11.5z" />,
  clipboard: (
    <>
      <rect x="5" y="4" width="14" height="18" rx="2" />
      <path d="M9 4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 12h6M9 16h4" />
    </>
  ),
  bed: <path d="M2 4v16M2 8h18a2 2 0 0 1 2 2v10M2 17h20M6 8v9" />,
  stethoscope: (
    <>
      <path d="M4.8 3H4a2 2 0 0 0-2 2v5a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-.8" />
      <path d="M8 16v2a5 5 0 0 0 10 0v-3" />
      <circle cx="18" cy="12" r="2.5" />
    </>
  ),
}

export default function Icon({ name, size = 24, strokeWidth = 1.9, className = '', style }) {
  const d = PATHS[name]
  if (!d) return null
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {d}
    </svg>
  )
}
