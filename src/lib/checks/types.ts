/** Um item da conferência (DS 8.2 — CheckList). Valida o resultado, não o código exato. */
export type Check =
  | { tipo: 'existe'; seletor: string; descricao: string }
  /** Passa se o primeiro elemento que casa com o seletor tem texto. */
  | { tipo: 'texto'; seletor: string; descricao: string }
  | { tipo: 'quantidade'; seletor: string; minimo: number; descricao: string }

/**
 * Item da conferência de CSS: lê as regras escritas, não o resultado (DS-14).
 * Passa se alguma regra tem o seletor e uma declaração válida com uma das
 * propriedades (e o valor, se dado).
 */
export type CheckCss = {
  tipo: 'regra'
  /** Um seletor só, como 'h1' ou 'a:hover'. Também casa com um item de "h1, h2". */
  seletor: string
  /** Basta uma delas. Ex.: ['background-color', 'background']. */
  propriedades: string[]
  /** Se dado, o valor tem de ser este (sem diferenciar maiúsculas). */
  valor?: string
  /** true: a regra tem de estar dentro de um @media. */
  emMidia?: boolean
  descricao: string
}

export type CheckResult = { descricao: string; ok: boolean }
