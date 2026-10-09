import type { AulaCss } from '../types'

const PADDING = [
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-inline',
  'padding-block',
]

export const aula: AulaCss = {
  slug: 'espacamento',
  ordem: 3,
  modulo: 'css',
  titulo: 'Espaçamento e bordas',
  objetivo:
    'Nesta aula você vai dar espaço ao seu site e desenhar bordas em volta das coisas.',
  duracaoMin: 20,
  pratica: {
    enunciado: [
      'Escreva uma regra para body com padding, para afastar o conteúdo da beirada da tela.',
      'Escreva uma regra para img com border-radius, para arredondar os cantos da imagem.',
      'Escreva uma regra para form com border, para desenhar uma moldura no formulário.',
    ],
    inicial: '/* Escreva seu CSS aqui embaixo */\n',
    conferencia: [
      {
        tipo: 'regra',
        seletor: 'body',
        propriedades: PADDING,
        descricao: 'A regra do body tem padding',
      },
      {
        tipo: 'regra',
        seletor: 'img',
        propriedades: ['border-radius'],
        descricao: 'A regra da img arredonda os cantos',
      },
      {
        tipo: 'regra',
        seletor: 'form',
        propriedades: ['border', 'border-style'],
        descricao: 'A regra do form desenha uma borda',
      },
    ],
    pistas: [
      'O padding recebe uma medida, como 24px. O border-radius também aceita porcentagem: 50% deixa a imagem redonda.',
      'A borda recebe três valores: grossura, estilo e cor. Assim: form { border: 2px solid purple; }.',
    ],
    solucao:
      'body {\n  padding: 24px;\n}\n\nimg {\n  border-radius: 50%;\n}\n\nform {\n  border: 2px solid mediumvioletred;\n  padding: 16px;\n}\n',
  },
}
