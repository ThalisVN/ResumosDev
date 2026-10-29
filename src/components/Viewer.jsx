import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Menu } from 'lucide-react'

function BotaoMenu({ onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="Abrir barra lateral"
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-300 text-zinc-600 hover:bg-zinc-200 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      <Menu size={16} />
    </button>
  )
}

export default function Viewer({ arquivo, sidebarAberta, onToggleSidebar }) {
  if (!arquivo) {
    return (
      <main className="flex min-w-0 flex-1 flex-col p-4">
        {!sidebarAberta && <BotaoMenu onClick={onToggleSidebar} />}
        <div className="flex flex-1 items-center justify-center text-zinc-500">
          Selecione um resumo na barra lateral
        </div>
      </main>
    )
  }

  const [periodo, materia] = arquivo.path.replace('../content/', '').split('/')
  const trilha = [periodo, materia, arquivo.nome]

  return (
    <main className="min-w-0 flex-1 overflow-y-auto px-4 py-4 md:px-10 md:py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center gap-3">
          {!sidebarAberta && <BotaoMenu onClick={onToggleSidebar} />}
          <nav
            aria-label="Você está aqui"
            className="flex flex-wrap items-center gap-2 text-sm text-zinc-500"
          >
            {trilha.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span className="text-zinc-400 dark:text-zinc-600">&gt;</span>}
                <span
                  className={
                    i === trilha.length - 1
                      ? 'font-medium text-zinc-900 dark:text-zinc-100'
                      : ''
                  }
                >
                  {item}
                </span>
              </span>
            ))}
          </nav>
        </div>

        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{arquivo.raw}</ReactMarkdown>
        </article>
      </div>
    </main>
  )
}