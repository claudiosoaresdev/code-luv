/** Um item da conferência (DS 8.2 — CheckList). Valida o resultado, não o código exato. */
export type Check =
  | { tipo: 'existe'; seletor: string; descricao: string }
  /** Passa se o primeiro elemento que casa com o seletor tem texto. */
  | { tipo: 'texto'; seletor: string; descricao: string }
  | { tipo: 'quantidade'; seletor: string; minimo: number; descricao: string }

export type CheckResult = { descricao: string; ok: boolean }
