# Dashboard (Início) com habit tracker — design

**Data:** 2026-10-09 · **Status:** aprovado na sessão de brainstorming (visual companion, `.superpowers/brainstorm/96999-1791581901/`, telas `habit-tracker`, `componentes`, `layout`, `dashboard-v3`).

## Objetivo

Trocar a tela de boas-vindas do Início (quem já usou o CodeLuv) por um dashboard que mostra **o próximo passo** e **a constância dela**, sem cobrança. O dashboard ajuda a cumprir a métrica do briefing ("≥ 3 sessões por semana nas primeiras quatro semanas", seção 10) sem ferir o que o briefing proíbe: perseguir sequência de dias seguidos (10.4) e "sequências que 'quebram' e geram culpa por pausar" (11).

## Regras de produto (inegociáveis)

- **Nada conta dias seguidos.** Nenhum número de sequência, nenhuma chama, nenhum "você perdeu".
- **Nada quebra.** A semana recomeça toda segunda sem perder nada; o mapa só soma.
- **A Luv nunca fica triste.** Com zero dias na semana, ela convida; não lamenta.
- **Sem tempo de uso** nem contagem de conquistas como meta (briefing 10.4).
- **Uma Luv por tela** (DS-13): a Luv do dashboard é a nova ilustração; não há outra Luv na tela.

## Escopo

**Entra:**

1. Nova ilustração da Luv (fone, notebook) como mascote do dashboard.
2. **Luv com corações** — a semana em corações, até a meta.
3. **Continuar** — o cartão atual, redesenhado.
4. **Sua semana** — sete quadrados, segunda a domingo.
5. Seção **Seu progresso**:
   - **Módulos** — um anel por módulo (HTML, CSS) e "JavaScript · em breve".
   - **Seus dias de estudo** — mapa das últimas 13 semanas.
   - **Conquistas** — as ganhas e a próxima ao alcance.
6. **Meta da semana** escolhida pela aluna em Configurações (1 a 7 dias, começa em 3).

**Fica de fora (decidido na sessão):** curiosidade do dia, relembrar uma aula, trilha de fases, miniatura do Meu site, números do caminho, acessórios ou falas desbloqueadas pelos corações.

**Não muda:** a tela de primeiro uso (`PrimeiroUso`), o aviso "Não encontramos seu progresso neste aparelho", o estado "Você concluiu todas as aulas disponíveis", o carregamento (esqueleto).

## Layout (B — foco no próximo passo)

Uma coluna, largura máxima de leitura confortável (~760px), centralizada. No celular é a mesma coluna.

```
┌──────────────────────────────────────────┐
│ [Luv ilustração]  Oi, Ana!               │  ← a ilustração sai um pouco pelo topo do cartão
│                   A Luv guardou 2 corações│
│                   ♥ ♥ ♡                   │
├──────────────────────────────────────────┤
│ Continuar: Imagens                        │  ← cartão em destaque (borda rosa, sticker)
│ Na última vez você concluiu "Links".      │
│ [▶ Continuar]                             │
├──────────────────────────────────────────┤
│ Sua semana                                │
│ Você estudou em 2 dias. Meta: 3 dias.     │
│ [♥][ ][♥][hoje][ ][ ][ ]                  │
└──────────────────────────────────────────┘
  Seu progresso                              ← h2
┌ Módulos: (4/7 HTML) (0/6 CSS) (JS em breve)┐
┌ Seus dias de estudo: mapa 13×7 + legenda   ┐
┌ Conquistas: selos + "Próxima: …"           ┐
```

Ordem de leitura = ordem visual. Títulos: `h1` "Oi, Ana!" (ou "Oi!"); `h2` "Continuar: …", "Sua semana", "Seu progresso"; `h3` "Módulos", "Seus dias de estudo", "Conquistas".

## Componentes

Todos em `src/components/inicio/`, recebendo dados prontos por props (sem ler o progresso direto), testáveis isoladamente. O `Inicio` continua sendo o único que chama `useProgresso`.

| Componente          | Mostra                                                                                         | Props principais                                 |
| ------------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| `LuvDaSemana`       | ilustração, `h1` com o nome, fala da Luv, corações                                             | `nome?`, `estudados`, `meta`                     |
| `ContinuarCard`     | o cartão "Continuar" atual (ou "Você concluiu todas as aulas…")                                | `proxima?`, `ultima?`                            |
| `SuaSemana`         | sete dias com coração nos estudados, hoje tracejado, frase com a meta                          | `dias: { dia, rotulo, estudou, hoje }[]`, `meta` |
| `ProgressoModulos`  | anel por módulo + "JavaScript · em breve"                                                      | `modulos: { id, nome, concluidas, total }[]`     |
| `MapaDeDias`        | grade de 13 semanas × 7 dias, três níveis, legenda, total de dias                              | `semanas: Celula[][]`, `total`                   |
| `VitrineConquistas` | selos das conquistas (ganhas cheias, a ganhar tracejadas), "Próxima: …", link "Ver conquistas" | `ganhas`, `proxima?`                             |

### Fala da Luv (corações)

Corações = `min(estudados na semana, meta)`, de um total de `meta`. Frases (voz do DS 10, sem palavras proibidas, números por extenso até dez):

| Situação     | Fala                                                                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 dias       | "Semana nova, corações novos. Que tal começar com uma aula?"                                                                                  |
| 1 ≤ n < meta | "A Luv guardou {n} coração/corações esta semana. Falta/Faltam {meta − n} para a sua meta." (números por extenso: "um coração", "Faltam dois") |
| n ≥ meta     | "Meta da semana completa! A Luv está radiante."                                                                                               |

Os corações são um único elemento com `role="img"` e `aria-label="{n} de {meta} corações"`.

### Sua semana

- Semana de **segunda a domingo**, no horário local (mesma regra de `hoje()`).
- Dia estudado = está em `diasEstudados` (hoje já entra quando ela confere ou conclui).
- Hoje tem contorno tracejado e o rótulo "hoje" no lugar do dia da semana.
- Dias futuros aparecem vazios (sem estilo de "faltou").
- Frase: "Você estudou em {n} dia(s) desta semana. Meta: {meta} dia(s) por semana." Com zero: "Nenhum dia ainda nesta semana. Meta: {meta} dias por semana."
- Acessibilidade: lista (`ul`) de sete itens; cada item com nome completo, ex.: "segunda-feira, estudou", "quinta-feira, hoje".

### Módulos

- Um anel (SVG) por módulo de `MODULOS`, com "{concluidas}/{total}" no centro e o nome embaixo.
- "JavaScript · em breve" é um item estático (anel tracejado), fora de `MODULOS`.
- Cada anel tem `role="img"` e `aria-label="HTML: 4 de 7 aulas concluídas"`.

### Seus dias de estudo (mapa)

- 13 colunas (semanas, a última é a atual) × 7 linhas (segunda a domingo).
- Níveis: `nada` (vazio), `estudou` (violeta), `concluiu` (rosa — dia em que concluiu alguma aula pela primeira vez, a partir de `concluidaEm`). Dias depois de hoje não são desenhados.
- Texto: "{total} dias estudados desde o começo." (total = `diasEstudados.length`; "1 dia estudado").
- Legenda visível com os três níveis (cor nunca é o único sinal: o nível também vai no `title` de cada célula para quem passa o mouse).
- A grade é `aria-hidden`; o resumo em texto e a legenda são o conteúdo acessível.

### Conquistas

- Selos de todas as `CONQUISTAS`: ganhas cheias com o ícone, a ganhar tracejadas com "?".
- "Próxima: **{título}** — {comoGanhar}" para a primeira conquista ainda não ganha; sem frase se todas foram ganhas.
- Link "Ver conquistas" (`/conquistas`), com cara de botão contornado.

## Dados

- **Novo campo** `metaSemanal?: number` em `Progresso` (1–7). `normalizar` aceita só inteiros de 1 a 7; ausente vale 3 (`META_PADRAO`).
- **Nova ação** `definirMeta(p, meta)` em `acoes.ts`.
- **Funções puras** novas em `src/lib/progresso/painel.ts` (com testes):
  - `diasDaSemana(agora: Date)` → os sete dias (AAAA-MM-DD), de segunda a domingo, com rótulo curto e marca de hoje.
  - `estudadosNaSemana(p, agora)` → quantos dias da semana atual estão em `diasEstudados`.
  - `mapaDeDias(p, agora, semanas = 13)` → colunas de células `{ dia, nivel, futuro }`.
  - `progressoPorModulo(p, aulas, modulos)` → `{ id, nome, concluidas, total }[]`.
  - `proximaConquista(p)` → a primeira conquista ainda não ganha.
  - `falaDaSemana(n, meta)` → a frase da Luv.
- Datas sempre no horário local, montadas à mão como em `hoje()` (sem `toLocaleDateString`, para teste estável).

## Configurações

Novo campo **"Meta da semana"** (padrão do DS para formulários): `Select` com "1 dia por semana" … "7 dias por semana", valor inicial 3, salva ao mudar (com aviso "Meta salva"). Texto de apoio: "Quantos dias por semana você quer estudar. Dá para mudar quando quiser."

## A nova ilustração da Luv

- Arquivo: `public/images/luv/luv-notebook.webp` (a imagem enviada na sessão, 1224×1285, fundo transparente). Gerar também uma versão menor (ex.: 480px de largura) para o tamanho em que aparece.
- `next/image` com `loading="eager"` (é o primeiro elemento da tela), largura de 140–200px conforme a tela, saindo ~36px pelo topo do cartão, com sombra "sticker" violeta (`drop-shadow`).
- `alt=""` (decorativa): o texto ao lado ("Oi, Ana!" e a fala) carrega a informação. Respeita "Reduzir animações" (sem animação nesta versão).
- Atualiza a divergência "Recortes da Luv" do DS 13.4 (agora há duas ilustrações: `ola.png` e `luv-notebook.webp`).

## Estados

| Estado                           | O que aparece                                                                                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Carregando (servidor/hidratação) | esqueleto com a mesma estrutura (cartão do topo + dois blocos)                                                                                   |
| Primeiro uso                     | tela atual de primeiro uso, sem mudança                                                                                                          |
| Progresso não recuperado         | o aviso atual, logo abaixo do cartão da Luv                                                                                                      |
| Nenhum dia estudado              | corações vazios + convite; semana vazia; mapa vazio e, no lugar do total, "Seus dias de estudo aparecem aqui quando você fizer a primeira aula." |
| Todas as aulas concluídas        | no lugar do "Continuar": "Você concluiu todas as aulas disponíveis por enquanto. Que tal olhar o seu site?" + "Ver meu site"                     |

## Testes

- **Unitários** (`painel.spec.ts`): semana começando na segunda (inclusive quando hoje é domingo), virada de mês e de ano, `estudadosNaSemana` ignorando dias de outras semanas, mapa com 13 colunas e futuro marcado, `concluiu` vencendo `estudou`, `progressoPorModulo`, `proximaConquista`, todas as faixas de `falaDaSemana`.
- **Modelo:** `metaSemanal` válido, inválido (0, 8, 2.5, "3") e ausente.
- **Componentes:** cada um com Testing Library (nomes acessíveis, textos, `aria-label` dos corações e anéis), `Inicio` com relógio fixo (`vi.setSystemTime`).
- **Configurações:** mudar a meta grava e aparece no dashboard.
- **Ponta a ponta:** Início com progresso semeado (localStorage) mostra os corações e a semana certos; axe sem violações; celular (375px) sem rolagem horizontal.

## Fora deste design

- Animações (corações enchendo, `sparkle` na meta completa) — entram com a celebração de módulo.
- Novas conquistas (ex.: concluir um módulo).
- Lembrete/notificação para estudar.
