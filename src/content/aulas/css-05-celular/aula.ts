import type { AulaCss } from '../types'

export const aula: AulaCss = {
  slug: 'celular',
  ordem: 5,
  modulo: 'css',
  titulo: 'Site no celular',
  objetivo:
    'Nesta aula você vai fazer o seu site se ajustar à tela pequena do celular.',
  duracaoMin: 20,
  pratica: {
    enunciado: [
      'Escreva @media (max-width: 400px) e abra as chaves.',
      'Dentro dela, escreva uma regra para h1 com um font-size menor.',
      'Ainda dentro dela, escreva uma regra para body com um padding menor.',
      'Use o botão Ver como celular, acima do resultado, para ver a diferença.',
    ],
    inicial: '/* Regras para telas pequenas */\n',
    conferencia: [
      {
        tipo: 'regra',
        seletor: 'h1',
        propriedades: ['font-size', 'font'],
        emMidia: true,
        descricao: 'Dentro da media query, o h1 muda de tamanho',
      },
      {
        tipo: 'regra',
        seletor: 'body',
        propriedades: [
          'padding',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'padding-inline',
          'padding-block',
        ],
        emMidia: true,
        descricao: 'Dentro da media query, o body muda o padding',
      },
    ],
    pistas: [
      'As regras de dentro são regras normais. A diferença é que elas ficam entre as chaves do @media.',
      'Fica assim: @media (max-width: 400px) { h1 { font-size: 1.75rem; } body { padding: 8px; } }. Confira se fechou todas as chaves.',
    ],
    solucao:
      '@media (max-width: 400px) {\n  h1 {\n    font-size: 1.75rem;\n  }\n\n  body {\n    padding: 8px;\n  }\n}\n',
  },
}
