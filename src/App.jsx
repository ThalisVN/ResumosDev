// src/App.jsx
// Layout geral: sidebar (fixa no desktop, "gaveta" no celular) + conteúdo.
import { useCallback, useEffect, useRef, useState } from 'react'
import Sidebar from './components/Sidebar'
import Article from './components/Article'
import { Menu, Moon, Sun } from './components/icons'
import { ordemLinear, urlDoc } from './lib/content'
import { useTheme } from './lib/useTheme'

// Descobre qual resumo abrir a partir da URL (?doc=...). Se não achar, abre o primeiro.
function docDaUrl() {
  const id = new URLSearchParams(window.location.search).get('doc')
  return ordemLinear.some((d) => d.id === id) ? id : (ordemLinear[0]?.id ?? null)
}

export default function App() {
  const [ativoId, setAtivoId] = useState(docDaUrl)
  const [menuAberto, setMenuAberto] = useState(false) // só importa no celular
  const [tema, alternarTema] = useTheme()
  const buscaRef = useRef(null)
  const mainRef = useRef(null)

  // Abrir um resumo: atualiza a URL (dá para compartilhar o link) e fecha o menu
  const selecionar = useCallback((id) => {
    window.history.pushState(null, '', urlDoc(id))
    setAtivoId(id)
    setMenuAberto(false)
  }, [])

  // Botão "voltar" do navegador
  useEffect(() => {
    const aoVoltar = () => setAtivoId(docDaUrl())
    window.addEventListener('popstate', aoVoltar)
    return () => window.removeEventListener('popstate', aoVoltar)
  }, [])

  // Atalho Ctrl+K (ou Cmd+K): abre o menu e foca na busca
  useEffect(() => {
    function aoTeclar(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMenuAberto(true)
        buscaRef.current?.focus()
      }
    }
    window.addEventListener('keydown', aoTeclar)
    return () => window.removeEventListener('keydown', aoTeclar)
  }, [])

  const indice = ordemLinear.findIndex((d) => d.id === ativoId)
  const doc = ordemLinear[indice]

  // Ao trocar de resumo: volta ao topo e atualiza o título da aba
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 })
    document.title = doc ? `${doc.title} · resumosDev` : 'resumosDev'
  }, [doc])

  return (
    // h-dvh (e não h-screen): respeita a barra do navegador no celular
    <div className="flex h-dvh overflow-hidden bg-bg text-fg">
      {/* Fundo escurecido atrás do menu (só celular); clicar fecha */}
      {menuAberto && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMenuAberto(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar: gaveta que desliza no celular, coluna fixa a partir de md (768px) */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 transition-transform md:static md:z-auto md:w-[280px] md:shrink-0 md:translate-x-0 ${
          menuAberto ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar ativoId={ativoId} onSelect={selecionar} buscaRef={buscaRef} />
      </div>

      {/* Coluna de conteúdo: é ela que rola (a sidebar fica parada) */}
      <div ref={mainRef} className="min-w-0 flex-1 overflow-y-auto">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-line bg-bg/90 px-2 backdrop-blur md:border-b-0 md:px-12">
          <div className="flex min-w-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setMenuAberto(true)}
              aria-label="Abrir menu"
              className="flex size-11 cursor-pointer items-center justify-center rounded-lg hover:bg-hover md:hidden"
            >
              <Menu />
            </button>
            {/* Breadcrumb */}
            <p className="truncate text-[13px] text-muted">
              {doc ? `${doc.periodo} / ${doc.materia}` : ''}
            </p>
          </div>

          <button
            type="button"
            onClick={alternarTema}
            aria-label={tema === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-[10px] border border-line transition-colors hover:bg-hover"
          >
            {tema === 'dark' ? <Sun /> : <Moon />}
          </button>
        </header>

        {doc ? (
          // key={doc.id}: ao trocar de resumo o componente é recriado do zero
          <Article
            key={doc.id}
            doc={doc}
            anterior={ordemLinear[indice - 1]}
            proximo={ordemLinear[indice + 1]}
            onSelect={selecionar}
          />
        ) : (
          <p className="p-12 text-muted">
            Nenhum resumo encontrado. Coloque arquivos .md em src/content/&lt;período&gt;/&lt;matéria&gt;/.
          </p>
        )}
      </div>
    </div>
  )
}