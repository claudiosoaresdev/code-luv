import type { Aula } from '../types'

export const aula: Aula = {
  slug: 'titulos-e-destaques',
  ordem: 2,
  modulo: 'html',
  titulo: 'Títulos e destaques',
  objetivo:
    'Nesta aula você vai criar a parte "Sobre mim" do seu site, com um subtítulo e palavras em destaque.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva um subtítulo com <h2> dizendo "Sobre mim".',
      'Abaixo dele, escreva um parágrafo com <p> contando quem você é.',
      'Dentro do parágrafo, coloque uma palavra importante entre <strong> e </strong>.',
    ],
    inicial: '<!-- Escreva aqui a parte "Sobre mim" -->\n',
    conferencia: [
      { tipo: 'existe', seletor: 'h2', descricao: 'Existe um subtítulo <h2>' },
      { tipo: 'texto', seletor: 'h2', descricao: 'O subtítulo tem texto' },
      { tipo: 'existe', seletor: 'p', descricao: 'Existe um parágrafo <p>' },
      {
        tipo: 'existe',
        seletor: 'p strong',
        descricao: 'Existe um destaque <strong> dentro do parágrafo',
      },
    ],
    pistas: [
      'O subtítulo funciona como o título: começa com <h2> e termina com </h2>.',
      'O <strong> fica dentro do parágrafo, em volta de uma palavra. Assim: <p>Eu adoro <strong>música</strong>.</p>',
    ],
    solucao:
      '<h2>Sobre mim</h2>\n<p>Moro em Recife e adoro <strong>música</strong>. Nas horas livres, eu desenho.</p>\n',
  },
}
