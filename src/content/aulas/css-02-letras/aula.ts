import type { AulaCss } from '../types'

export const aula: AulaCss = {
  slug: 'letras',
  ordem: 2,
  modulo: 'css',
  titulo: 'Letras',
  objetivo:
    'Nesta aula você vai escolher a letra do seu site e o tamanho dos títulos.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva uma regra para body com font-family, para trocar a letra do site todo.',
      'Na mesma regra, coloque line-height para afastar as linhas.',
      'Escreva uma regra para h1 com font-size, para deixar o título maior.',
    ],
    inicial: '/* Escreva seu CSS aqui embaixo */\n',
    conferencia: [
      {
        tipo: 'regra',
        seletor: 'body',
        propriedades: ['font-family', 'font'],
        descricao: 'A regra do body escolhe a fonte',
      },
      {
        tipo: 'regra',
        seletor: 'body',
        propriedades: ['line-height'],
        descricao: 'A regra do body afasta as linhas',
      },
      {
        tipo: 'regra',
        seletor: 'h1',
        propriedades: ['font-size', 'font'],
        descricao: 'A regra do h1 muda o tamanho do título',
      },
    ],
    pistas: [
      'A fonte vai em font-family. Escreva o nome de uma fonte, uma vírgula e uma família geral no fim, como serif.',
      'Fica assim: body { font-family: Georgia, serif; line-height: 1.6; }. E para o título: h1 { font-size: 3rem; }.',
    ],
    solucao:
      'body {\n  font-family: Georgia, serif;\n  line-height: 1.6;\n}\n\nh1 {\n  font-size: 3rem;\n}\n',
  },
}
