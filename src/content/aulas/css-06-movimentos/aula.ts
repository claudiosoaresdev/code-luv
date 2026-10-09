import type { AulaCss } from '../types'

export const aula: AulaCss = {
  slug: 'movimentos',
  ordem: 6,
  modulo: 'css',
  titulo: 'Pequenos movimentos',
  objetivo:
    'Nesta aula você vai fazer os links e o botão reagirem quando o mouse passa por cima.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva uma regra para a:hover com color, para o link mudar de cor quando o mouse passa por cima.',
      'Na regra do a, coloque transition para a cor mudar devagar.',
      'Escreva uma regra para button:hover com background-color.',
    ],
    inicial: 'a {\n  color: purple;\n}\n',
    conferencia: [
      {
        tipo: 'regra',
        seletor: 'a:hover',
        propriedades: ['color'],
        descricao: 'A regra do a:hover muda a cor do link',
      },
      {
        tipo: 'regra',
        seletor: 'a',
        propriedades: ['transition', 'transition-duration'],
        descricao: 'A regra do a tem transition',
      },
      {
        tipo: 'regra',
        seletor: 'button:hover',
        propriedades: ['background-color', 'background'],
        descricao: 'A regra do button:hover muda o fundo do botão',
      },
    ],
    pistas: [
      'O :hover vem colado no seletor, sem espaço: a:hover. Ele ganha uma regra só para ele.',
      'A transition recebe a propriedade e o tempo, assim: transition: color 0.3s;. Ela fica na regra do a, junto com a cor.',
    ],
    solucao:
      'a {\n  color: purple;\n  transition: color 0.3s;\n}\n\na:hover {\n  color: mediumvioletred;\n}\n\nbutton:hover {\n  background-color: pink;\n}\n',
  },
}
