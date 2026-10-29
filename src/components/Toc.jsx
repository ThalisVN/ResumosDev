// src/components/Toc.jsx
// Índice "Nesta página" (coluna da direita, só em telas grandes).
// Destaca o título que está visível enquanto você rola.
import { useEffect, useState } from 'react'

export default function Toc({ headings }) {
  const [ativo, setAtivo] = useState(null)

  useEffect(() => {
    // Observa cada título; quando entra na parte de cima da tela, vira o ativo
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtivo(e.target.id)
      },
      { rootMargin: '0px 0px -70% 0px' },
    )
    headings.forEach((h) => {
      const el = document.getElementById(h.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    // w-[170px] = coluna mais estreita, o índice fica rente à borda direita
    <aside className="hidden w-[170px] shrink-0 xl:block">
      <nav aria-label="Nesta página" className="sticky top-20 pt-16 text-[13px]">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Nesta página</p>
        <ul className="flex flex-col gap-2.5">
          {headings.map((h) => (
            <li key={h.id} className={h.nivel === 3 ? 'pl-3' : ''}>
              <a
                href={`#${h.id}`}
                className={
                  ativo === h.id
                    ? 'font-medium text-accent'
                    : 'text-muted transition-colors hover:text-fg'
                }
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}