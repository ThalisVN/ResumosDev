// src/lib/useTheme.js
// Guarda o tema ("dark" | "light") no <html data-theme="..."> e no localStorage.
// O valor inicial já foi aplicado pelo script do index.html (evita piscar).
import { useEffect, useState } from 'react'

export function useTheme() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.theme || 'dark')

  useEffect(() => {
    document.documentElement.dataset.theme = tema
    try {
      localStorage.setItem('theme', tema)
    } catch {
      // localStorage pode estar bloqueado (aba anônima); sem problema
    }
  }, [tema])

  const alternar = () => setTema((t) => (t === 'dark' ? 'light' : 'dark'))
  return [tema, alternar]
}