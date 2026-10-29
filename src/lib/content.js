// src/lib/content.js

const modulos = import.meta.glob('../content/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

export const semAcento = (texto) =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

// ordem alfabética que entende números ("2º Período" antes de "10º Período")
const ordenar = (a, b) => a.localeCompare(b, 'pt-BR', { numeric: true })

export const docs = Object.entries(modulos)
  .map(([caminho, raw]) => {
    // "../content/3º Período/ALGA/limites.md" -> ["3º Período","ALGA","limites.md"]
    const partes = caminho.replace('../content/', '').split('/')
    if (partes.length !== 3) return null // ignora arquivo fora do padrão
    const [periodo, materia, arquivo] = partes
    const nomeArquivo = arquivo.replace(/\.md$/, '')

    // Se o .md começa com "# Título", usamos como título da página e
    // removemos do corpo (a página já mostra o título em destaque).
    const h1 = raw.match(/^\s*#\s+(.+?)\r?\n/)

    return {
      id: partes.join('/'), // identificador único (vai na URL)
      periodo,
      materia,
      title: h1 ? h1[1].trim() : nomeArquivo,
      body: h1 ? raw.slice(h1[0].length) : raw,
      minutos: Math.max(1, Math.round(raw.split(/\s+/).length / 200)), // ~200 palavras/min
      busca: semAcento(`${nomeArquivo} ${materia} ${raw}`), // texto usado pela busca
    }
  })
  .filter(Boolean)

// Agrupa em árvore. Para mostrar o período mais novo primeiro,
// troque ".sort(ordenar)" por ".sort((a, b) => ordenar(b, a))" na linha dos períodos.
const unicos = (lista) => [...new Set(lista)]

export const tree = unicos(docs.map((d) => d.periodo))
  .sort(ordenar)
  .map((periodo) => ({
    periodo,
    materias: unicos(docs.filter((d) => d.periodo === periodo).map((d) => d.materia))
      .sort(ordenar)
      .map((materia) => ({
        materia,
        docs: docs
          .filter((d) => d.periodo === periodo && d.materia === materia)
          .sort((a, b) => ordenar(a.id, b.id)),
      })),
  }))

export const ordemLinear = tree.flatMap((p) => p.materias.flatMap((m) => m.docs))

// Link de cada resumo: "?doc=3º Período/ALGA/limites.md" (funciona na Vercel sem config)
export const urlDoc = (id) => `?doc=${encodeURIComponent(id)}`