const files = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

const ordenar = (a, b) => a.localeCompare(b, 'pt', { numeric: true })

export function buildTree() {
  const tree = {}
  for (const [path, raw] of Object.entries(files)) {
    const [periodo, materia, arquivo] = path.replace('../content/', '').split('/')
    const nome = arquivo.replace('.md', '')
    tree[periodo] ??= {}
    tree[periodo][materia] ??= []
    tree[periodo][materia].push({ nome, path, raw })
  }
  return Object.keys(tree)
    .sort(ordenar)
    .map((p) => ({
      periodo: p,
      materias: Object.keys(tree[p])
        .sort(ordenar)
        .map((m) => ({ materia: m, arquivos: tree[p][m] })),
    }))
}