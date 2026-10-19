import { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import Viewer from './components/Viewer'
import { buildTree } from './lib/content'

const tree = buildTree()

export default function App() {
  const [selecionado, setSelecionado] = useState(tree[0]?.materias[0]?.arquivos[0] ?? null)
  const [dark, setDark] = useState(() => localStorage.getItem('theme') !== 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <div className="flex h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Sidebar
        tree={tree}
        selecionado={selecionado}
        onSelect={setSelecionado}
        dark={dark}
        onToggleTheme={() => setDark(!dark)}
      />
      <Viewer arquivo={selecionado} />
    </div>
  )
}