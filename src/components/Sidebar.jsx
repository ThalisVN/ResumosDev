// src/components/Sidebar.jsx
// Logo + busca (Ctrl K) + árvore período > matéria > resumo.
import { useState } from 'react'
import { Book, ChevronDown, ChevronRight, Search } from './icons'
import { tree, ordemLinear, semAcento, urlDoc } from '../lib/content'

export default function Sidebar({ ativoId, onSelect, buscaRef }) {
  const [query, setQuery] = useState('')

  // Pastas abertas. Começa com a pasta do resumo atual já aberta.
  const [abertas, setAbertas] = useState(() => {
    const atual = ordemLinear.find((d) => d.id === ativoId)
    return new Set(atual ? [atual.periodo, `${atual.periodo}/${atual.materia}`] : [])
  })

  function alternar(chave) {
    setAbertas((anterior) => {
      const novo = new Set(anterior)
      if (novo.has(chave)) novo.delete(chave)
      else novo.add(chave)
      return novo
    })
  }

  // Busca no título, na matéria e no conteúdo do resumo (máx. 20 resultados)
  const q = semAcento(query.trim())
  const resultados = q ? ordemLinear.filter((d) => d.busca.includes(q)).slice(0, 20) : []

  // Link de verdade (abre em nova aba com clique do meio), mas sem recarregar a página
  const Link = ({ doc, className, children }) => (
    <a
      href={urlDoc(doc.id)}
      aria-current={doc.id === ativoId ? 'page' : undefined}
      onClick={(e) => {
        e.preventDefault()
        onSelect(doc.id)
      }}
      className={className}
    >
      {children}
    </a>
  )

  return (
    <div className="flex h-full flex-col gap-4 border-r border-line bg-surface p-4">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-1 text-[17px] font-bold">
        <Book className="text-accent" width={22} height={22} />
        resumosDev
      </div>

      {/* Busca */}
      <label className="flex h-10 items-center gap-2 rounded-[10px] border border-line bg-bg px-2.5 focus-within:border-accent">
        <Search className="shrink-0 text-muted" />
        <input
          ref={buscaRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar resumos"
          aria-label="Buscar resumos"
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">
          Ctrl K
        </kbd>
      </label>

      <nav aria-label="Resumos" className="-mx-1 flex-1 overflow-y-auto px-1">
        {q ? (
          /* ---- Modo busca: lista plana de resultados ---- */
          resultados.length === 0 ? (
            <p className="p-2 text-sm text-muted">Nenhum resultado para “{query}”.</p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {resultados.map((d) => (
                <li key={d.id}>
                  <Link
                    doc={d}
                    className={`block rounded-lg px-2.5 py-2 text-sm hover:bg-hover ${
                      d.id === ativoId ? 'bg-active text-accent' : ''
                    }`}
                  >
                    <span className="block font-medium">{d.title}</span>
                    <span className="block text-xs text-muted">
                      {d.periodo} · {d.materia}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )
        ) : (
          /* ---- Modo normal: árvore de pastas ---- */
          tree.map(({ periodo, materias }) => (
            <div key={periodo} className="mb-1">
              {/* Período */}
              <button
                type="button"
                aria-expanded={abertas.has(periodo)}
                onClick={() => alternar(periodo)}
                className="flex w-full cursor-pointer items-center gap-2 rounded-lg p-2 text-left text-xs font-semibold uppercase tracking-wider text-muted transition-colors hover:bg-hover"
              >
                {abertas.has(periodo) ? <ChevronDown /> : <ChevronRight />}
                {periodo}
              </button>

              {abertas.has(periodo) &&
                materias.map(({ materia, docs }) => {
                  const chave = `${periodo}/${materia}`
                  return (
                    <div key={chave}>
                      {/* Matéria */}
                      <button
                        type="button"
                        aria-expanded={abertas.has(chave)}
                        onClick={() => alternar(chave)}
                        className="flex w-full cursor-pointer items-center gap-2 rounded-lg py-2 pl-5 pr-2 text-left text-sm font-medium transition-colors hover:bg-hover"
                      >
                        {abertas.has(chave) ? <ChevronDown /> : <ChevronRight />}
                        {materia}
                      </button>

                      {/* Resumos (o ativo ganha fundo + cor de destaque) */}
                      {abertas.has(chave) &&
                        docs.map((d) => (
                          <Link
                            key={d.id}
                            doc={d}
                            className={`block rounded-lg py-2 pl-11 pr-2.5 text-sm transition-colors hover:bg-hover ${
                              d.id === ativoId ? 'bg-active font-medium text-accent' : 'text-fg/80'
                            }`}
                          >
                            {d.title}
                          </Link>
                        ))}
                    </div>
                  )
                })}
            </div>
          ))
        )}
      </nav>
    </div>
  )
}