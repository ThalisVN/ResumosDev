import { useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function Sidebar({ tree, selecionado, onSelect, dark, onToggleTheme }) {
  const [busca, setBusca] = useState('')
  const termo = busca.trim().toLowerCase()

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between p-3">
        <span className="font-medium">ResumosDev</span>
        <button
          onClick={onToggleTheme}
          aria-label="Alternar tema"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Pesquisar resumos"
        className="mx-3 mb-3 rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-950"
      />

      <nav className="flex-1 overflow-y-auto px-2 pb-4 text-sm">
        {tree.map(({ periodo, materias }) => {
          const mats = materias
            .map((m) => ({
              ...m,
              arquivos: m.arquivos.filter(
                (a) =>
                  !termo ||
                  a.nome.toLowerCase().includes(termo) ||
                  m.materia.toLowerCase().includes(termo)
              ),
            }))
            .filter((m) => m.arquivos.length)
          if (!mats.length) return null

          return (
            <details key={periodo} open={!!termo || undefined} className="mb-1">
              <summary className="cursor-pointer rounded px-2 py-1 font-medium hover:bg-zinc-200 dark:hover:bg-zinc-800">
                {periodo}
              </summary>
              {mats.map((m) => (
                <details key={m.materia} open={!!termo || undefined} className="ml-3">
                  <summary className="cursor-pointer rounded px-2 py-1 text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                    {m.materia}
                  </summary>
                  {m.arquivos.map((a) => (
                    <button
                      key={a.path}
                      onClick={() => onSelect(a)}
                      className={`ml-3 block w-[calc(100%-0.75rem)] rounded px-2 py-1 text-left hover:bg-zinc-200 dark:hover:bg-zinc-800 ${
                        selecionado?.path === a.path ? 'text-blue-600 dark:text-blue-400' : ''
                      }`}
                    >
                      {a.nome}
                    </button>
                  ))}
                </details>
              ))}
            </details>
          )
        })}
      </nav>
    </aside>
  )
}