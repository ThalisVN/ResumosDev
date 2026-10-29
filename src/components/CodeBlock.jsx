// src/components/CodeBlock.jsx
import { useRef, useState } from 'react'

export default function CodeBlock({ children }) {
  const preRef = useRef(null)
  const [copiado, setCopiado] = useState(false)

  // children é o <code className="language-js ...">; pegamos "js" do className
  const linguagem = /language-([\w-]+)/.exec(children?.props?.className ?? '')?.[1] ?? 'texto'

  async function copiar() {
    try {
      await navigator.clipboard.writeText(preRef.current.textContent)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 1500)
    } catch {
      // sem permissão de clipboard: não faz nada
    }
  }

  return (
    // "not-prose" = o plugin typography não mexe aqui; estilizamos na mão
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-line bg-codebg">
      <div className="flex items-center justify-between border-b border-line py-2 pl-4 pr-2 font-mono text-xs text-muted">
        <span>{linguagem}</span>
        <button
          type="button"
          onClick={copiar}
          className="min-h-8 cursor-pointer rounded-lg border border-line px-3 font-sans text-xs font-medium text-fg/80 transition-colors hover:bg-hover"
        >
          {copiado ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
      {/* overflow-x-auto: código largo rola dentro do bloco, sem quebrar a página */}
      <pre ref={preRef} className="overflow-x-auto p-4 font-mono text-[14px] leading-[1.7]">
        {children}
      </pre>
    </div>
  )
}