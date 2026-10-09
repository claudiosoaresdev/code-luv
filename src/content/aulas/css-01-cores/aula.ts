import type { AulaCss } from '../types'

export const aula: AulaCss = {
  slug: 'cores',
  ordem: 1,
  modulo: 'css',
  titulo: 'Cores',
  objetivo:
    'Nesta aula você vai dar cores ao seu site e descobrir como é uma regra de CSS.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva uma regra para body com background-color, para mudar a cor do fundo da página.',
      'Escreva uma regra para h1 com color, para mudar a cor do título.',
      'Escreva mais uma regra, agora para h2, também com color.',
    ],
    inicial: '/* Escreva seu CSS aqui embaixo */\n',
    conferencia: [
      {
        tipo: 'regra',
        seletor: 'body',
        propriedades: ['background-color', 'background'],
        descricao: 'A regra do body muda a cor do fundo',
      },
      {
        tipo: 'regra',
        seletor: 'h1',
        propriedades: ['color'],
        descricao: 'A regra do h1 muda a cor do título',
      },
      {
        tipo: 'regra',
        seletor: 'h2',
        propriedades: ['color'],
        descricao: 'A regra do h2 muda a cor dos subtítulos',
      },
    ],
    pistas: [
      'Uma regra começa com o seletor, como body. Depois vêm as chaves, e a propriedade fica dentro delas.',
      'Cada propriedade termina com ponto e vírgula. Assim: h1 { color: purple; }. Faça uma regra dessas para cada seletor.',
    ],
    solucao:
      'body {\n  background-color: lavenderblush;\n}\n\nh1 {\n  color: mediumvioletred;\n}\n\nh2 {\n  color: rebeccapurple;\n}\n',
  },
}
