import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Viewer({ arquivo }) {
  if (!arquivo) {
    return (
      <main className="flex flex-1 items-center justify-center text-zinc-500">
        Selecione um resumo na barra lateral
      </main>
    )
  }

  const [periodo, materia] = arquivo.path.replace('../content/', '').split('/')
  const trilha = [periodo, materia, arquivo.nome]

  return (
    <main className="flex-1 overflow-y-auto px-10 py-8">
      <div className="mx-auto max-w-3xl">
        <nav
          aria-label="Você está aqui"
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500"
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

        <article className="prose prose-zinc max-w-none dark:prose-invert">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{arquivo.raw}</ReactMarkdown>
        </article>
      </div>
    </main>
  )
}