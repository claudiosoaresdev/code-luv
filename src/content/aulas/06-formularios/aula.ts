import type { Aula } from '../types'

export const aula: Aula = {
  slug: 'formularios',
  ordem: 6,
  modulo: 'html',
  titulo: 'Formulários',
  objetivo:
    'Nesta aula você vai criar um espaço para as visitas deixarem um recado no seu site.',
  duracaoMin: 20,
  pratica: {
    enunciado: [
      'Escreva um subtítulo com <h2> dizendo "Deixe um recado".',
      'Abaixo dele, abra um formulário com <form>.',
      'Dentro do formulário, coloque um campo <input> para o nome e um <textarea> para o recado, cada um com o seu <label>.',
      'Por último, coloque um botão com <button>.',
    ],
    inicial:
      '<h2>Deixe um recado</h2>\n<form>\n  <!-- Coloque os campos aqui -->\n</form>\n',
    conferencia: [
      {
        tipo: 'existe',
        seletor: 'form',
        descricao: 'Existe um formulário <form>',
      },
      {
        tipo: 'existe',
        seletor: 'form input',
        descricao: 'Existe um campo <input> dentro do formulário',
      },
      {
        tipo: 'existe',
        seletor: 'form textarea',
        descricao: 'Existe uma caixa de texto <textarea> dentro do formulário',
      },
      {
        tipo: 'quantidade',
        seletor: 'form label',
        minimo: 2,
        descricao: 'Existem pelo menos 2 rótulos <label>',
      },
      { tipo: 'texto', seletor: 'form button', descricao: 'O botão tem texto' },
    ],
    pistas: [
      'Cada campo tem o seu rótulo. O jeito mais direto é colocar o campo dentro do <label>: <label>Seu nome <input></label>.',
      'O <textarea> abre e fecha, mesmo vazio: <textarea></textarea>. O botão também: <button>Enviar recado</button>.',
    ],
    solucao:
      '<h2>Deixe um recado</h2>\n<form>\n  <label>Seu nome <input name="nome"></label>\n  <label>Seu recado <textarea name="recado"></textarea></label>\n  <button>Enviar recado</button>\n</form>\n',
  },
}
