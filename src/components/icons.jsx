// src/components/icons.jsx
const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const Book = (p) => (
  <svg {...base} {...p}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /></svg>
)
export const ChevronDown = (p) => (
  <svg {...base} width={14} height={14} strokeWidth={2.4} {...p}><path d="m6 9 6 6 6-6" /></svg>
)
export const ChevronRight = (p) => (
  <svg {...base} width={14} height={14} strokeWidth={2.4} {...p}><path d="m9 6 6 6-6 6" /></svg>
)
export const Search = (p) => (
  <svg {...base} width={16} height={16} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
)
export const Menu = (p) => (
  <svg {...base} width={22} height={22} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
)
export const Moon = (p) => (
  <svg {...base} {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>
)
export const Sun = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)