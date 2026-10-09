import type { Aula } from '../types'

export const aula: Aula = {
  slug: 'imagens',
  ordem: 5,
  modulo: 'html',
  titulo: 'Imagens',
  objetivo:
    'Nesta aula você vai colocar uma imagem no seu site e descrever o que ela mostra.',
  duracaoMin: 15,
  pratica: {
    enunciado: [
      'Escreva uma imagem com <img>.',
      'No atributo src, use o endereço /images/luv/ola.png.',
      'No atributo alt, descreva com suas palavras o que a imagem mostra.',
    ],
    inicial: '<!-- Coloque a imagem aqui embaixo -->\n',
    conferencia: [
      { tipo: 'existe', seletor: 'img', descricao: 'Existe uma imagem <img>' },
      {
        tipo: 'existe',
        seletor: 'img[src]:not([src=""])',
        descricao: 'A imagem tem um endereço no src',
      },
      {
        tipo: 'existe',
        seletor: 'img[alt]:not([alt=""])',
        descricao: 'A imagem tem uma descrição no alt',
      },
    ],
    pistas: [
      'A imagem não tem tag de fechar. Tudo fica dentro de uma tag só: <img src="..." alt="...">.',
      'Fica assim: <img src="/images/luv/ola.png" alt="A gatinha Luv acenando">. Troque a descrição pelas suas palavras.',
    ],
    solucao:
      '<img src="/images/luv/ola.png" alt="A gatinha Luv acenando e dizendo olá" width="200">\n',
  },
}
