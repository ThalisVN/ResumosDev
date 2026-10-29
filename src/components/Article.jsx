// src/components/Article.jsx
// Título + markdown renderizado + índice lateral + "anterior / próximo".
import { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm' // tabelas, listas de tarefa, ~~riscado~~
import remarkMath from 'remark-math' // reconhece $fórmula$ e $$fórmula$$
import rehypeSlug from 'rehype-slug' // põe id em cada título (usado pelo índice)
import rehypeKatex from 'rehype-katex' // desenha as fórmulas
import rehypeHighlight from 'rehype-highlight' // cores no código
import 'katex/dist/katex.min.css' // fontes e estilos das fórmulas (obrigatório)
import CodeBlock from './CodeBlock'
import Toc from './Toc'
import { urlDoc } from '../lib/content'

// Troca elementos do markdown por versões estilizadas
const componentes = {
  pre: CodeBlock,
  // "> texto" no markdown vira uma caixa de destaque (dica, atenção...)
  blockquote: ({ children }) => (
    <div className="not-prose my-6 rounded-xl border border-line bg-callout px-4 py-3 text-[15px] leading-relaxed [&>p]:m-0 [&>p+p]:mt-2">
      {children}
    </div>
  ),
  // Tabela larga rola na horizontal dentro da própria caixa
  table: ({ children }) => (
    <div className="overflow-x-auto">
      <table>{children}</table>
    </div>
  ),
}

// Cartão de "Anterior" / "Próximo"
function NavCard({ doc, rotulo, onSelect, alinharDireita }) {
  if (!doc) return <div /> // mantém a coluna vazia
  return (
    <a
      href={urlDoc(doc.id)}
      onClick={(e) => {
        e.preventDefault()
        onSelect(doc.id)
      }}
      className={`rounded-xl border border-line px-4 py-3 text-xs text-muted transition-colors hover:bg-hover ${
        alinharDireita ? 'text-right' : ''
      }`}
    >
      {rotulo}
      <span className="mt-0.5 block text-[15px] font-medium text-fg">{doc.title}</span>
    </a>
  )
}

export default function Article({ doc, anterior, proximo, onSelect }) {
  const ref = useRef(null)
  const [headings, setHeadings] = useState([])

  // Depois de renderizar o markdown, lê os títulos (h2/h3) direto do HTML
  // para montar o índice "Nesta página".
  useEffect(() => {
    const els = ref.current.querySelectorAll('h2[id], h3[id]')
    setHeadings(
      [...els].map((el) => ({
        id: el.id,
        text: el.textContent,
        nivel: el.tagName === 'H3' ? 3 : 2,
      })),
    )
  }, [doc.id])

  return (
    // xl:pr-6 = margem direita menor em telas grandes (índice mais no canto)
    <div className="flex gap-8 px-5 pb-16 pt-6 md:px-12 xl:pr-6">
      {/* mx-auto = centraliza a coluna do resumo no espaço disponível */}
      <article ref={ref} className="mx-auto min-w-0 max-w-[720px] flex-1">
        <h1 className="text-[30px] font-bold leading-[1.15] tracking-tight md:text-[40px]">
          {doc.title}
        </h1>
        <p className="mt-2 text-[13px] text-muted">Resumo · {doc.minutos} min de leitura</p>

        {/* prose = estilo de leitura do plugin typography; reader = nossas cores */}
        <div className="reader prose mt-6 max-w-none md:prose-lg">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeSlug, rehypeKatex, rehypeHighlight]}
            components={componentes}
          >
            {doc.body}
          </ReactMarkdown>
        </div>

        {/* Anterior / Próximo */}
        <nav aria-label="Navegação entre resumos" className="mt-10 grid gap-3 sm:grid-cols-2">
          <NavCard doc={anterior} rotulo="Anterior" onSelect={onSelect} />
          <NavCard doc={proximo} rotulo="Próximo" onSelect={onSelect} alinharDireita />
        </nav>
      </article>

      <Toc headings={headings} />
    </div>
  )
}