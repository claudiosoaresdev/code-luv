import type { Aula } from '../types'

export const aula: Aula = {
  slug: 'secoes-e-rodape',
  ordem: 7,
  modulo: 'html',
  titulo: 'Seções e rodapé',
  objetivo:
    'Nesta aula você vai organizar uma parte do site numa seção e fechar a página com um rodapé.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Abra uma seção com <section>.',
      'Dentro dela, escreva um subtítulo <h2> com "Meus planos" e um parágrafo <p> sobre o que você quer criar.',
      'Depois de fechar a seção, escreva um rodapé com <footer> e um parágrafo dizendo quem fez o site.',
    ],
    inicial:
      '<h2>Meus planos</h2>\n<p>Quero criar um site para mostrar os meus desenhos.</p>\n',
    conferencia: [
      {
        tipo: 'existe',
        seletor: 'section',
        descricao: 'Existe uma seção <section>',
      },
      {
        tipo: 'existe',
        seletor: 'section h2',
        descricao: 'A seção tem um subtítulo <h2>',
      },
      {
        tipo: 'existe',
        seletor: 'section p',
        descricao: 'A seção tem um parágrafo <p>',
      },
      {
        tipo: 'existe',
        seletor: 'footer',
        descricao: 'Existe um rodapé <footer>',
      },
      { tipo: 'texto', seletor: 'footer', descricao: 'O rodapé tem texto' },
    ],
    pistas: [
      'O <section> fica em volta do subtítulo e do parágrafo. Escreva <section> antes do <h2> e </section> depois do </p>.',
      'O rodapé vem depois do </section>. Fica assim: <footer><p>Feito por Ana com o CodeLuv</p></footer>.',
    ],
    solucao:
      '<section>\n  <h2>Meus planos</h2>\n  <p>Quero criar um site para mostrar os meus desenhos.</p>\n</section>\n<footer>\n  <p>Feito por Ana com o CodeLuv</p>\n</footer>\n',
  },
}
