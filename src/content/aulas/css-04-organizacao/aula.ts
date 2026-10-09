import type { AulaCss } from '../types'

export const aula: AulaCss = {
  slug: 'organizacao',
  ordem: 4,
  modulo: 'css',
  titulo: 'Organização com flexbox',
  objetivo:
    'Nesta aula você vai deixar o seu site no meio da tela e organizar o formulário com flexbox.',
  duracaoMin: 20,
  pratica: {
    enunciado: [
      'Escreva uma regra para body com max-width e margin: 0 auto, para deixar o seu site no meio da tela.',
      'Escreva uma regra para form com display: flex e flex-direction: column, para empilhar os campos.',
      'Na mesma regra do form, coloque gap para separar os campos.',
    ],
    inicial: '/* Escreva seu CSS aqui embaixo */\n',
    conferencia: [
      {
        tipo: 'regra',
        seletor: 'body',
        propriedades: ['max-width'],
        descricao: 'A regra do body limita a largura',
      },
      {
        tipo: 'regra',
        seletor: 'body',
        propriedades: ['margin', 'margin-left', 'margin-inline'],
        descricao: 'A regra do body tem margin',
      },
      {
        tipo: 'regra',
        seletor: 'form',
        propriedades: ['display'],
        valor: 'flex',
        descricao: 'O form usa display: flex',
      },
      {
        tipo: 'regra',
        seletor: 'form',
        propriedades: ['flex-direction'],
        valor: 'column',
        descricao: 'O form empilha os campos com flex-direction: column',
      },
      {
        tipo: 'regra',
        seletor: 'form',
        propriedades: ['gap', 'row-gap'],
        descricao: 'O form tem gap entre os campos',
      },
    ],
    pistas: [
      'Tudo o que é do formulário fica numa regra só: form, as chaves e as três propriedades dentro.',
      'Fica assim: form { display: flex; flex-direction: column; gap: 12px; }. E o body: body { max-width: 420px; margin: 0 auto; }.',
    ],
    solucao:
      'body {\n  max-width: 420px;\n  margin: 0 auto;\n}\n\nform {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n',
  },
}
