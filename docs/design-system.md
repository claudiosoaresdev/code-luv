# Design System — CodeLuv

Documento vivo. Define **a linguagem visual e de interação do CodeLuv**: princípios, fundamentos (tokens), componentes, padrões e conteúdo. É a fonte da verdade sobre aparência e comportamento de interface — design e código leem daqui, e nenhum dos dois inventa fora daqui.

> **Regra deste documento:** toda decisão visual é um **token** ou uma **regra nomeada**. Nada de valor solto. Se um valor aparece no produto e não existe aqui, ou ele entra com nome e motivo, ou sai do produto. O teste: **uma pessoa nova deve conseguir montar uma tela coerente usando só este documento**, sem perguntar "qual cor eu uso?".

> **Status:** rascunho completo, aguardando revisão.
> **Última revisão:** 2026-10-09 · **Responsável:** Claudio Soares · **Versão do design system:** 0.6.0
> **Fonte no design:** [moodboard](./assets/moodboard.webp) e logos em `public/images/` · **Fonte no código:** `src/app/globals.css` (tokens), `src/components/ui/` (base [shadcn/ui](https://ui.shadcn.com), estilo `base-nova` sobre Base UI — DS-09) e `src/components/` (componentes do CodeLuv)

**Documentos relacionados:** [Briefing](./briefing.md) (por que existe) · PRD (o que precisa fazer — a escrever) · Architecture (como é construído — a escrever).

> **Escopo:** este documento governa **a interface do CodeLuv**. O **site pessoal da aluna** — o que ela escreve nas aulas e vê no resultado da prática — **não** segue este design system: é dela, com o estilo que ela criar. A única regra que vale ali é que a moldura em volta (seção 8, `RetroWindow`) pertence ao CodeLuv.

---

## Como usar este documento

1. **Comece pelos princípios e fundamentos.** Seções 1 a 3 sustentam todas as outras.
2. **Nomeie pela intenção, não pela aparência.** `color.feedback.danger`, nunca `pink-error`.
3. **Um componente só entra quando aparece duas vezes.** Componentes com uso único previsto estão marcados `proposto`.
4. **Design e código mudam juntos.** Divergência vira linha na seção 13.4.
5. **Registre a decisão, não só o valor** (seção 14).
6. **Atualize o estado abaixo** sempre que mexer numa seção.

### Estado de preenchimento

| #   | Seção                   | Estado   | Responsável    | Revisado em |
| --- | ----------------------- | -------- | -------------- | ----------- |
| 1   | Princípios              | rascunho | Claudio Soares | 2026-10-09  |
| 2   | Arquitetura de tokens   | rascunho | Claudio Soares | 2026-10-09  |
| 3   | Fundamentos             | rascunho | Claudio Soares | 2026-10-09  |
| 4   | Temas                   | rascunho | Claudio Soares | 2026-10-09  |
| 5   | Layout e responsividade | rascunho | Claudio Soares | 2026-10-09  |
| 6   | Iconografia e imagens   | rascunho | Claudio Soares | 2026-10-09  |
| 7   | Movimento               | rascunho | Claudio Soares | 2026-10-09  |
| 8   | Componentes             | rascunho | Claudio Soares | 2026-10-09  |
| 9   | Padrões                 | rascunho | Claudio Soares | 2026-10-09  |
| 10  | Conteúdo e voz          | rascunho | Claudio Soares | 2026-10-09  |
| 11  | Acessibilidade          | rascunho | Claudio Soares | 2026-10-09  |
| 12  | Plataformas             | rascunho | Claudio Soares | 2026-10-09  |
| 13  | Governança              | rascunho | Claudio Soares | 2026-10-09  |
| 14  | Registro de decisões    | rascunho | Claudio Soares | 2026-10-09  |

Estados: `vazio` · `rascunho` · `em revisão` · `acordado`.

---

## 1. Princípios

Derivados dos compromissos da seção 11 do [briefing](./briefing.md#11-como-impactar-positivamente) e do princípio inegociável ("entender devagar a avançar sem entender").

| Princípio                           | O que significa na interface                                                                                          | O que abrimos mão por ele                                           |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| **Aprender vem antes de enfeitar**  | Áreas de leitura, escuta e prática são limpas; a decoração Y2K mora nas bordas, nas celebrações e nas telas vazias    | Telas inteiramente "temáticas", com brilho e adesivos em todo lugar |
| **Uma coisa de cada vez**           | Uma ação principal por tela; passos da aula aparecem em sequência; a Luv fala no máximo duas frases                   | Telas densas que mostram tudo de uma vez; atalhos para "pular"      |
| **Erro é conversa, não alarme**     | Feedback de "ainda não" usa tom de incentivo, ícone e texto; o vermelho nunca domina a tela                           | Destaque visual forte para erro; contagem de tentativas visível     |
| **Ouvir e ler são o mesmo caminho** | Todo texto de explicação pode ser ouvido; o trecho em leitura é sempre visível; nada depende só do som ou só da visão | Textos longos ou visuais que não fazem sentido em voz alta          |
| **Nostalgia com maturidade**        | Y2K em contornos, brilho, pixel e moldura retrô; tipografia e hierarquia de produto atual                             | Estética infantil, excesso de emoji, fontes "divertidas" em texto   |

> Diante de duas boas opções, vence a que for **mais fácil de entender para quem nunca programou**.

### Personalidade

- **É:** acolhedor, divertido, nostálgico.
- **Não é:** infantil, barulhento, corporativo.
- **Referências de tom visual:**
  - **Janelas de computador dos anos 2000** — a moldura com barra de título e três bolinhas que transforma qualquer conteúdo em "programa".
  - **Adesivos de notebook** — contorno escuro marcado, cores chapadas com brilho, levemente "plastificados".
  - **Jogos casuais** — recompensa visual curta e alegre, sem pressão.
  - **Interfaces modernas de leitura** — largura de linha confortável, contraste alto, ritmo vertical calmo.

---

## 2. Arquitetura de tokens

### 2.1 Camadas

| Camada         | O que guarda                    | Exemplo                                       | Quem usa                |
| -------------- | ------------------------------- | --------------------------------------------- | ----------------------- |
| **Primitivo**  | a paleta bruta, sem significado | `pink.500 = #FF4AB3`                          | só tokens semânticos    |
| **Semântico**  | a intenção                      | `color.action.primary = pink.500`             | componentes e telas     |
| **Componente** | ajuste local, quando inevitável | `button.primary.border = color.border.strong` | só o próprio componente |

> Tela e componente **nunca** usam primitivo diretamente. Trocar de tema exige mudar só a camada semântica.

### 2.2 Convenção de nomes

- **Formato no documento:** `categoria.propriedade.variante.estado` — ex.: `color.text.secondary`, `color.action.primary.hover`.
- **No código:** os semânticos usam **os nomes do shadcn/ui** sempre que existe um equivalente (`background`, `card`, `muted-foreground`, `primary`, `border`, `ring`…), para que os 61 componentes da base funcionem sem ajuste. Só o que o shadcn não tem ganha nome próprio (`success`, `warning`, `highlight`, `line-strong`, `link`). O mapeamento completo está na tabela 3.1.
  - `color.bg.surface` → `--card` → `bg-card`
  - `color.text.secondary` → `--muted-foreground` → `text-muted-foreground`
  - `color.feedback.success` → `--success` → `text-success`
  - `space.4` → escala padrão de espaçamento (`p-4`, `gap-4`)
- **Proibido no nome:** valor (`space-16px`), cor visível (`pink-button`), nome de tela (`lesson-bg`).

### 2.3 Formato de origem

- **Arquivo fonte da verdade:** `src/app/globals.css`.
  - Primitivos (`--ink-950`, `--pink-500`…) declarados uma vez em `:root`.
  - Semânticos do tema claro em `:root`; do tema escuro em `.dark` (a classe `dark` fica no `<html>` — DS-01).
  - `@theme inline` expõe os semânticos como utilitários do Tailwind CSS 4 (`bg-card`, `text-success`, `shadow-sticker`, `font-display`).
  - Utilitários nomeados para os gradientes: `bg-brand` e `gloss` (`@utility`).
- **Gerado para:** utilitários Tailwind e `var(--…)` em CSS de componente.
- **Quem pode alterar:** responsável pelo design system (seção 13).

---

## 3. Fundamentos

### 3.1 Cor

**Paleta primitiva**

As cinco cores da marca estão marcadas com ★. As demais são derivadas para o sistema funcionar (superfícies, estados, feedback e contraste no tema claro) e mantêm o matiz violeta da marca.

| Família   | Tons                                                                                                        | Uso pretendido                 |
| --------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------ |
| `ink`     | `950` ★ `#101017` · `900` `#1A1724` · `800` `#251F33` · `700` `#332B45` · `600` `#4A4060` · `400` `#9A90B3` | fundos escuros, texto no claro |
| `cream`   | `50` `#FFF9F2` · `100` ★ `#F6E8D8` · `200` `#EAD7C2`                                                        | texto no escuro, fundos claros |
| `violet`  | `300` `#B98AE8` · `500` ★ `#8E48D1` · `700` `#6A2FA6`                                                       | marca, bordas, destaques       |
| `pink`    | `100` ★ `#F9C6EA` (rosa-bebê) · `400` `#FF6FC4` · `500` ★ `#FF4AB3` (rosa vibrante) · `700` `#B0186F`       | ação, foco, celebração         |
| `success` | `400` `#5EE6A8` · `700` `#17714A`                                                                           | conferência aprovada           |
| `warning` | `300` `#FFC46B` · `700` `#8A5A00`                                                                           | pista, atenção                 |
| `danger`  | `400` `#FF6B81` · `700` `#B42339`                                                                           | "ainda não", ação destrutiva   |

**Tokens semânticos de cor**

Contrastes calculados por script (fórmula WCAG 2.x), não estimados.

| Token (documento)            | Código (variável → utilitário)                     | Escuro (padrão)                                    | Claro (Fase 2) | Uso                                    | Contraste verificado                                                                    |
| ---------------------------- | -------------------------------------------------- | -------------------------------------------------- | -------------- | -------------------------------------- | --------------------------------------------------------------------------------------- |
| `color.bg.canvas`            | `--background` → `bg-background`                   | `ink.950`                                          | `cream.100`    | fundo da aplicação                     | —                                                                                       |
| `color.bg.surface`           | `--card` → `bg-card`                               | `ink.900`                                          | `cream.50`     | cartões, painéis                       | —                                                                                       |
| `color.bg.surface.raised`    | `--popover` → `bg-popover`                         | `ink.800`                                          | `#FFFFFF`      | menus, diálogos, editor                | —                                                                                       |
| `color.bg.muted`             | `--muted` / `--secondary` → `bg-muted`             | `ink.800`                                          | `cream.200`    | trilho de progresso, hover, abas       | —                                                                                       |
| `color.bg.hover`             | `--accent` → `bg-accent`                           | `ink.700`                                          | `cream.200`    | item de menu em foco/hover             | —                                                                                       |
| `color.bg.highlight`         | `--highlight` → `bg-highlight`                     | `violet.500` @ 35%                                 | `pink.100`     | trecho em leitura na escuta            | texto sobre ele ≥ 4.5:1                                                                 |
| `color.text.primary`         | `--foreground` → `text-foreground`                 | `cream.100`                                        | `ink.950`      | texto principal                        | 15.7:1 · 15.7:1                                                                         |
| `color.text.secondary`       | `--muted-foreground` → `text-muted-foreground`     | `pink.100`                                         | `ink.600`      | texto de apoio                         | 12.9:1 · 8.0:1                                                                          |
| `color.text.disabled`        | opacidade 50% do próprio componente                | —                                                  | —              | texto indisponível                     | — (isento)                                                                              |
| `color.text.link`            | `--link` → `text-link`                             | `pink.400`                                         | `pink.700`     | links em texto corrido, tags no código | 7.5:1 · 5.4:1                                                                           |
| `color.text.on-action`       | `--primary-foreground` → `text-primary-foreground` | `ink.950`                                          | `ink.950`      | texto sobre `color.action.primary`     | 6.2:1                                                                                   |
| `color.border.default`       | `--border` / `--input` → `border-border`           | `violet.500`                                       | `violet.700`   | contorno de cartões e campos           | 3.6:1 · 6.8:1                                                                           |
| `color.border.strong`        | `--line-strong` → `border-line-strong`             | `ink.950`                                          | `ink.950`      | contorno "adesivo" de botões e badges  | — (ver DS-03)                                                                           |
| `color.border.focus`         | `--ring` → `outline-ring`                          | `pink.500`                                         | `pink.700`     | indicador de foco                      | 6.2:1 · 5.4:1                                                                           |
| `color.action.primary`       | `--primary` → `bg-primary`                         | `pink.500`                                         | `pink.500`     | ação principal                         | 6.2:1 sobre canvas escuro; no claro (2.5:1) o contorno `border.strong` garante o limite |
| `color.action.primary.hover` | `color-mix` de `--primary` com 15% de branco       | —                                                  | —              | hover da ação principal                | idem                                                                                    |
| `color.feedback.success`     | `--success` → `text-success`                       | `success.400`                                      | `success.700`  | item aprovado na conferência           | 12.1:1 · 5.0:1                                                                          |
| `color.feedback.warning`     | `--warning` → `text-warning` / `border-warning`    | `warning.300`                                      | `warning.700`  | pista, aviso                           | 12.1:1 · 4.9:1                                                                          |
| `color.feedback.danger`      | `--destructive` → `text-destructive`               | `danger.400`                                       | `danger.700`   | "ainda não", ação destrutiva           | 6.9:1 · 5.4:1                                                                           |
| `color.chart.1…5`            | `--chart-1…5`                                      | rosa, violeta, sucesso, aviso, violeta claro       | idem, tons 700 | gráficos (se houver)                   | —                                                                                       |
| `color.sidebar.*`            | `--sidebar-*`                                      | iguais a `card`/`primary`/`accent`/`border`/`ring` | idem           | componente `Sidebar` do shadcn         | —                                                                                       |

> **Cor nunca é o único sinal.** "Certo" e "ainda não" têm cor **e** ícone **e** texto.

> **Regra do botão rosa:** texto sobre `color.action.primary` é sempre `color.text.on-action` (escuro). Branco sobre o rosa vibrante fica em ~3:1 e reprova para texto — o moodboard usa branco e foi corrigido aqui (DS-02).

**Gradientes nomeados** (só nos lugares listados)

| Token                | Código                 | Valor                                                             | Onde pode aparecer                                  |
| -------------------- | ---------------------- | ----------------------------------------------------------------- | --------------------------------------------------- |
| `gradient.brand`     | `bg-brand`             | `pink.500` → `violet.500`, 135°                                   | barra de progresso, órbitas, fundos de celebração   |
| `gradient.gloss`     | `gloss`                | branco 35% → transparente, de cima para baixo, na metade superior | reflexo "plastificado" em botões primários e barras |
| `gradient.synthwave` | ainda não implementado | `ink.950` → `violet.700` @ 40%, com grade em `pink.500` @ 15%     | fundo de telas de conquista e fim de módulo         |

Nunca sob texto corrido, nunca no editor nem na área de explicação. **Nunca em texto** (texto com gradiente reduz contraste e legibilidade).

### 3.2 Tipografia

| Papel                                    | Família            | Pesos              | Utilitário                   | Licença | Fallback                                           |
| ---------------------------------------- | ------------------ | ------------------ | ---------------------------- | ------- | -------------------------------------------------- |
| Marca — títulos de página                | **Orbitron**       | 600, 700, 800      | `font-display`               | OFL     | `"Trebuchet MS", system-ui, sans-serif`            |
| Interface, texto e títulos de componente | **Poppins**        | 400, 500, 600, 700 | `font-sans` · `font-heading` | OFL     | `system-ui, -apple-system, "Segoe UI", sans-serif` |
| Código                                   | **JetBrains Mono** | 400, 600           | `font-mono`                  | OFL     | `ui-monospace, "SF Mono", Menlo, monospace`        |

- **Carregamento:** `next/font/google` em `src/app/layout.tsx`, expostas como `--font-poppins`, `--font-orbitron` e `--font-jetbrains`.
- **`font-heading` ≠ `font-display`:** o shadcn usa `font-heading` nos títulos de Dialog, Sheet, Drawer, Empty e afins, em 14–16px. Por isso `font-heading` aponta para Poppins, e Orbitron fica só em `font-display` (DS-10).
- **Escala:** tabela fixa com tamanhos fluidos entre 360px e 1280px de largura de tela.
- **Orbitron** é larga e decorativa: **nunca abaixo de 18px, nunca em texto corrido, nunca em botões** (DS-04).
- **Maiúsculas** só em `type.label.brand`, no máximo duas palavras, e **nunca como rótulo acima de um título** — o título carrega a informação sozinho ("Próxima aula: imagens", e não "PRÓXIMA AULA" + "Imagens"). Uso permitido: o nome do estado da Luv em telas de celebração e os selos das conquistas.

| Token              | Tamanho (mobile → desktop) | Altura de linha | Peso | Família        | Espaçamento | Uso                                                                                      |
| ------------------ | -------------------------- | --------------- | ---- | -------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `type.display`     | 36 → 56px                  | 1.05            | 800  | Orbitron       | -0.01em     | herói da página inicial, celebração — `font-display text-4xl md:text-6xl font-extrabold` |
| `type.heading.lg`  | 28 → 40px                  | 1.15            | 700  | Orbitron       | 0           | título de página — `font-display text-3xl md:text-4xl font-bold`                         |
| `type.heading.md`  | 22 → 28px                  | 1.2             | 600  | Orbitron       | 0           | título de seção, nome do módulo — `font-display text-2xl md:text-3xl font-semibold`      |
| `type.heading.sm`  | 18 → 20px                  | 1.3             | 600  | Poppins        | 0           | título de cartão (`CardTitle`), passo da aula                                            |
| `type.body.lg`     | 17 → 19px                  | 1.7             | 400  | Poppins        | 0           | **explicação da aula** (lida e ouvida)                                                   |
| `type.body.md`     | 16px                       | 1.6             | 400  | Poppins        | 0           | texto padrão de interface                                                                |
| `type.body.sm`     | 14px                       | 1.5             | 400  | Poppins        | 0           | texto de apoio                                                                           |
| `type.label`       | 15px                       | 1.2             | 600  | Poppins        | 0.01em      | botões, abas, rótulos de campo                                                           |
| `type.label.brand` | 13px                       | 1.2             | 700  | Poppins        | 0.12em      | rótulos em maiúsculas (estados, seções)                                                  |
| `type.caption`     | 13px                       | 1.4             | 400  | Poppins        | 0           | metadados (duração da aula, data)                                                        |
| `type.code`        | 14 → 15px                  | 1.6             | 400  | JetBrains Mono | 0           | editor, exemplos, código no texto                                                        |

- **Comprimento de linha da explicação:** máximo **68 caracteres** (`measure.reading`).
- **Números de progresso:** algarismos tabulares.
- **Código dentro do texto:** `type.code` a 0.92em, fundo `color.bg.surface.raised`, `radius.sm`.

### 3.3 Espaçamento

Unidade base: **4px**. Usa-se a escala padrão do Tailwind, restrita aos tokens abaixo.

| Token      | Valor | Uso típico                                              |
| ---------- | ----- | ------------------------------------------------------- |
| `space.0`  | 0     |                                                         |
| `space.1`  | 4     | entre ícone e texto                                     |
| `space.2`  | 8     | dentro de badges, entre itens da conferência            |
| `space.3`  | 12    | padding de botão (vertical), entre parágrafos curtos    |
| `space.4`  | 16    | padding padrão de componente; margem lateral no celular |
| `space.6`  | 24    | entre blocos relacionados; padding de cartão            |
| `space.8`  | 32    | entre passos da aula                                    |
| `space.12` | 48    | entre seções                                            |
| `space.16` | 64    | respiro do herói                                        |

> Regra de proximidade: coisas relacionadas ficam mais perto entre si do que de coisas não relacionadas.

### 3.4 Forma

No código, `--radius` = `0.875rem` (14px) e os utilitários do shadcn derivam dele.

| Token                  | Valor | Código                       | Uso                                            |
| ---------------------- | ----- | ---------------------------- | ---------------------------------------------- |
| `radius.none`          | 0     | `rounded-none`               | pixel art                                      |
| `radius.sm`            | ~8    | `rounded-sm`                 | campos, código no texto, etiquetas             |
| `radius.md`            | 14    | `rounded-lg`                 | botões, itens de lista, alertas                |
| `radius.lg`            | ~20   | `rounded-xl`                 | cartões, painéis, `RetroWindow`                |
| `radius.full`          | 9999  | `rounded-full`               | avatar da Luv, pílulas, badges                 |
| `border.width.default` | 2     | `border-2`                   | cartões, campos, botões — o contorno "adesivo" |
| `border.width.subtle`  | 1     | `border`                     | divisórias                                     |
| `border.width.focus`   | 3     | `outline-3 outline-offset-2` | anel de foco (com `2px` de afastamento)        |

### 3.5 Elevação

No escuro, elevação é **superfície mais clara + sombra dura**, que imita adesivo colado (não sombra difusa realista).

| Token                 | Sombra                                                      | Código                   | Tratamento no escuro      | Uso                                   |
| --------------------- | ----------------------------------------------------------- | ------------------------ | ------------------------- | ------------------------------------- |
| `elevation.0`         | nenhuma                                                     | —                        | `color.bg.canvas`         | conteúdo no fluxo                     |
| `elevation.1`         | `0 4px 0 0` `ink.950` @ 60%                                 | `shadow-sticker`         | `color.bg.surface`        | cartões, botões                       |
| `elevation.1.pressed` | `0 2px 0 0` `ink.950` @ 60%                                 | `shadow-sticker-pressed` | —                         | botão pressionado (movimento `press`) |
| `elevation.2`         | `0 6px 0 0` `ink.950` @ 60% + `0 12px 24px` `ink.950` @ 40% | `shadow-sticker-lg`      | `color.bg.surface.raised` | menus, balão da Luv, item em destaque |
| `elevation.3`         | `0 8px 0 0` `ink.950` @ 70% + `0 24px 48px` `ink.950` @ 50% | ainda não implementado   | `color.bg.surface.raised` | diálogos                              |

**Destaque** (`elevation.highlight`) — o item mais importante da tela (próxima aula, conquista nova, parte nova do site): borda `color.action.primary` + `elevation.2`. No máximo um por tela. **Sem brilho colorido difuso** (DS-11).

### 3.6 Camadas (z-index)

| Token        | Valor | Uso                                        |
| ------------ | ----- | ------------------------------------------ |
| `z.base`     | 0     |                                            |
| `z.sticky`   | 10    | cabeçalho fixo, controle da escuta         |
| `z.dropdown` | 20    | menus                                      |
| `z.overlay`  | 30    | fundo de diálogo, gaveta de navegação      |
| `z.modal`    | 40    | diálogo                                    |
| `z.toast`    | 50    | notificação temporária, balão de conquista |

---

## 4. Temas

| Tema                | Quando é usado                                | Diferenças em relação ao padrão                                                                                          |
| ------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Escuro** (padrão) | sempre, na Fase 1                             | —                                                                                                                        |
| **Claro (creme)**   | escolha da aluna — **Fase 2**                 | só a camada semântica muda (coluna "Claro" da tabela 3.1); gradientes e Luv iguais                                       |
| **Cores forçadas**  | modo de alto contraste do sistema operacional | o sistema assume as cores; contornos de 2px garantem que botões e cartões continuem visíveis; brilhos e gradientes somem |

- **Escolha do tema:** na Fase 1 não há escolha. Na Fase 2: segue a preferência do sistema na primeira visita; depois, a escolha da aluna prevalece.
- **Onde a escolha é lembrada:** no aparelho dela, junto com o progresso.

> Tema escuro não é inversão. Superfícies elevadas ficam **mais claras**; no claro, a elevação volta a ser sombra.

---

## 5. Layout e responsividade

### 5.1 Pontos de quebra

Estratégia **mobile-first**.

| Token           | Largura mínima | Dispositivo típico      | Colunas | Margem lateral    | Espaço entre colunas |
| --------------- | -------------- | ----------------------- | ------- | ----------------- | -------------------- |
| `breakpoint.sm` | 0              | celular                 | 4       | 16                | 16                   |
| `breakpoint.md` | 768            | tablet, celular deitado | 8       | 24                | 24                   |
| `breakpoint.lg` | 1024           | notebook                | 12      | 32                | 24                   |
| `breakpoint.xl` | 1280           | monitor                 | 12      | auto (centraliza) | 32                   |

- **Largura máxima da aplicação:** `layout.max` = 1200px.
- **Largura máxima de leitura:** `measure.reading` = 68 caracteres.
- **Largura mínima suportada:** 360px.

### 5.2 Estruturas de página

| Estrutura                 | Quando usar                                                                                                                                     | Comportamento no celular                                                         |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Coluna única**          | Início, lista de aulas, conquistas, configurações                                                                                               | igual, com margem de 16px                                                        |
| **Aula dividida**         | Aula, a partir de `lg`: explicação à esquerda (até `measure.reading`), prática à direita (editor + resultado), lado a lado e com altura da tela | empilha: explicação → prática; o controle da escuta fica fixo na base (ver 13.4) |
| **Prática em tela cheia** | Editar o site pessoal livremente                                                                                                                | resultado vira uma aba ao lado do editor ("Código" · "Resultado")                |

No celular, o produto **prioriza ler e ouvir**; a prática funciona, mas a experiência é pensada para notebook (briefing, seção 11.4).

### 5.3 Navegação

- **Navegação principal:** barra no topo. A partir de `md`, links visíveis; abaixo disso, botão de menu que abre gaveta lateral.
- **Destino ativo:** na barra do topo, sublinhado rosa de 2px (`border-primary`) e texto `text-foreground`; os demais em `text-muted-foreground`. Na gaveta, fundo `bg-muted`. Sempre com `aria-current="page"` (DS-12).
- **Gaveta no celular:** lateral, abrindo pela esquerda (`Sheet side="left"`).
- **Destinos principais (máximo 4):** **Início** · **Aulas** · **Meu site** · **Conquistas**. Configurações por ícone de engrenagem (rótulo acessível "Configurações").
- **Dentro da aula:** barra própria com "Voltar para aulas", título da aula e indicador de passo ("Passo 2 de 4"); a navegação principal fica recolhida para reduzir distração.
- **Área de toque mínima:** 48×48px, inclusive para os controles da escuta.

---

## 6. Iconografia e imagens

### 6.1 Ícones

Dois conjuntos, com papéis que não se misturam (DS-07):

| Conjunto          | Biblioteca                          | Estilo                                   | Uso                                                                                                                                         |
| ----------------- | ----------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Funcionais**    | Lucide (licença ISC)                | contorno, traço 2px, cantos arredondados | ações e navegação: ouvir, pausar, voltar, conferir, menu, configurações                                                                     |
| **Marca (pixel)** | próprios, desenhados em grade 16×16 | pixel art, cores da paleta               | status e celebração: coração (conquista), estrela de 4 pontas (destaque), planeta (módulo), cursor (JavaScript), `</>` (HTML), pincel (CSS) |

- **Tamanhos:** `icon.sm` 16 · `icon.md` 20 · `icon.lg` 24 · `icon.brand` 32 (só pixel; escala inteira — 16, 32, 48 — para não borrar).
- **Ícone sozinho:** só com rótulo acessível e tooltip; nos controles da escuta, rótulo também visível a partir de `md`.
- **Ícones de pixel** nunca são o único meio de transmitir uma ação.

### 6.2 Ilustrações e fotos

- **Luv:** ilustração oficial em oito estados (seção 8, `LuvBubble`), recortada do moodboard em fundo transparente, em `public/images/luv/`.
- **Logos:** `public/images/logo.webp` (só nome) e `public/images/logo-mascot.webp` (com a Luv). Não redesenhar, não recolorir, não distorcer. Altura mínima: 48px. No cabeçalho, usar o logotipo em texto ("CodeLuv" em Orbitron 700 + ícone `</>`), porque o logo ilustrado perde detalhe abaixo de 48px.
- **Quando usar ilustração:** boas-vindas, estados vazios, celebrações, fim de módulo — **nunca** dentro da explicação ou da prática.
- **Fotos:** não usamos fotos na interface do CodeLuv. (No site pessoal dela, ela usa as fotos que quiser.)
- **Texto alternativo:** obrigatório quando a imagem informa; vazio (`alt=""`) quando decora. A Luv acompanhada de texto é decorativa.

---

## 7. Movimento

| Token                       | Valor                           | Uso                                             |
| --------------------------- | ------------------------------- | ----------------------------------------------- |
| `motion.duration.fast`      | 120ms                           | hover, pressionar botão                         |
| `motion.duration.base`      | 200ms                           | abrir menu, trocar aba, revelar pista           |
| `motion.duration.slow`      | 400ms                           | diálogo, gaveta, balão da Luv entrando          |
| `motion.duration.celebrate` | 1200ms                          | brilhos de conquista (uma vez, sem repetir)     |
| `motion.easing.standard`    | `cubic-bezier(.2, .8, .2, 1)`   | movimento dentro da tela                        |
| `motion.easing.enter`       | `cubic-bezier(.2, .9, .3, 1.2)` | entrada com leve "quique" (balão da Luv, toast) |
| `motion.easing.exit`        | `cubic-bezier(.4, 0, 1, 1)`     | saída                                           |

**Movimentos nomeados**

| Nome          | Descrição                                                         | Onde                          |
| ------------- | ----------------------------------------------------------------- | ----------------------------- |
| `press`       | botão desce 2px e a sombra dura encolhe (como apertar um adesivo) | todos os botões               |
| `sparkle`     | 4 a 6 estrelas de 4 pontas saem do elemento e somem               | conquista, aula concluída     |
| `gloss-sweep` | reflexo branco atravessa a barra uma vez                          | barra de progresso ao avançar |
| `luv-bob`     | Luv sobe e desce 4px, duas vezes                                  | Luv ao falar                  |

- **Movimento reduzido:** com a preferência do sistema **ou** a opção "Reduzir animações" ligada, tudo vira troca instantânea ou esmaecimento de até 120ms; `sparkle` e `luv-bob` não acontecem.
- **Nunca animar:** o texto que está sendo lido na escuta (o destaque muda de trecho sem deslizar); nada em loop; nada além de 1,2s.

---

## 8. Componentes

### 8.1 Inventário

Categorias: ação · entrada · navegação · exibição · feedback · sobreposição · estrutura · aprendizagem.

A base é o shadcn/ui (DS-09): os 61 componentes estão em `src/components/ui/` e são código do projeto. Componentes do CodeLuv são **composições** desses, em `src/components/`. Antes de criar markup próprio, procurar o equivalente do shadcn.

| Componente (DS)                               | Categoria    | Base shadcn                                                                                                                          | Ajuste para o CodeLuv                                                            | Estado no código |
| --------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | ---------------- |
| `Button`                                      | ação         | `button`                                                                                                                             | contorno 2px, `shadow-sticker`, `gloss` no `default`, 48px de altura             | pronto           |
| `IconButton`                                  | ação         | `button` com `size="icon"`                                                                                                           | 48×48px                                                                          | pronto           |
| `Card`                                        | estrutura    | `card`                                                                                                                               | contorno 2px, `shadow-sticker`, título em Poppins 18px                           | pronto           |
| `RetroWindow`                                 | estrutura    | `card` (composição)                                                                                                                  | barra de título com três bolinhas                                                | pronto           |
| `TextField`                                   | entrada      | `field` + `input` — Início e Configurações                                                                                           | —                                                                                | pronto           |
| `Switch`                                      | entrada      | `switch`                                                                                                                             | —                                                                                | proposto         |
| `Tabs`                                        | navegação    | `tabs`                                                                                                                               | 48px de altura, rótulo em 600                                                    | pronto           |
| `Header` / `NavDrawer` (código: `SiteHeader`) | navegação    | `<Link>` próprio na barra (sublinhado rosa) + `buttonVariants` na gaveta e em Configurações + `sheet` + `tooltip`                    | botões só de ícone com 48px e tooltip; fechar da gaveta rotulado "Fechar"        | pronto           |
| `LessonStepper`                               | navegação    | `progress` ou `breadcrumb` — adiado — ver §13.4                                                                                      | —                                                                                | proposto         |
| `ProgressBar`                                 | exibição     | `progress`                                                                                                                           | trilho com contorno 2px, preenchimento `bg-brand` + `gloss`                      | pronto           |
| `Badge`                                       | exibição     | `badge`                                                                                                                              | —                                                                                | pronto           |
| `AchievementBadge`                            | exibição     | `card` + `badge` — `src/components/conquistas/lista-conquistas.tsx`                                                                  | —                                                                                | pronto           |
| `LessonListItem`                              | exibição     | `item` (`outline`) + selo "Concluída" (`EstadoAula`)                                                                                 | —                                                                                | pronto           |
| `LuvBubble` (código: `LuvSays` + `LuvAvatar`) | feedback     | `message` + `bubble` (`tinted`) + `avatar` (`xl`)                                                                                    | `Avatar` ganhou o tamanho `xl` (64px); versão `hero` com ilustração de até 240px | pronto           |
| `Toast`                                       | feedback     | `toast` (Base UI), montado no layout raiz; fechar com 48px e rótulo "Fechar aviso"                                                   | —                                                                                | pronto           |
| `Dialog`                                      | sobreposição | `alert-dialog` (Apagar progresso, com foco inicial no Cancelar) — `src/components/configuracoes/configuracoes.tsx`                   | —                                                                                | pronto           |
| `EmptyState`                                  | feedback     | `empty` + `LuvAvatar`                                                                                                                | —                                                                                | pronto           |
| `ListenControls`                              | aprendizagem | `card` + `button` + `toggle-group` — `src/components/aula/listen-controls.tsx`                                                       | `ToggleGroup`: 48px, item pressionado em `bg-primary`                            | pronto           |
| `ReadAlongText`                               | aprendizagem | CSS Custom Highlight API (`::highlight(leitura)`) sobre o texto MDX — `src/components/aula/escuta.tsx` + `src/lib/escuta/trechos.ts` | —                                                                                | pronto           |
| `CodeEditor`                                  | aprendizagem | CodeMirror 6 (`@codemirror/*`, HTML e CSS) com tema do DS — `src/components/aula/code-editor.tsx`                                    | —                                                                                | pronto           |
| `ResultPreview`                               | aprendizagem | `RetroWindow` + `iframe sandbox=""` — `src/components/aula/result-preview.tsx`                                                       | "Ver como celular" (`toggle`, 360px) nas aulas de CSS                            | pronto           |
| `CheckList`                                   | aprendizagem | `item` (`outline`) em `item-group` — `src/components/aula/check-list.tsx`                                                            | —                                                                                | pronto           |
| `HintPanel`                                   | aprendizagem | `alert` (`warning`) + `button` — `src/components/aula/hint-panel.tsx`                                                                | nova variante `warning`; contorno 2px                                            | pronto           |
| `PaginaNaoEncontrada`                         | feedback     | `LuvSays` + `buttonVariants` — `src/app/not-found.tsx`                                                                               | —                                                                                | pronto           |

Estados possíveis: `proposto` · `em construção` · `pronto` · `descontinuado`. "Pronto" aqui significa que o componente base já segue os tokens; a composição do CodeLuv pode ainda estar `proposto`.

**Componentes da base ainda não revisados:** os demais componentes do shadcn (calendar, chart, carousel, menubar, sidebar…) herdam os tokens, mas não foram revisados contra as regras de contorno, área de toque e tipografia. Revisar cada um antes do primeiro uso.

### 8.2 Fichas

**Button**

- **Para que serve:** disparar uma ação.
- **Quando usar:** ações com texto ("Ouvir explicação", "Conferir", "Concluir aula").
- **Quando não usar:** navegação para outra página sem ação → link; ação só com ícone → `IconButton`.
- **Anatomia:** contêiner com contorno "adesivo" · reflexo `gradient.gloss` (só primary) · ícone à esquerda (opcional) · rótulo.

| Variante (DS) | `variant` no código | Aparência                                                                                                                | Quando usar                                   |
| ------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `primary`     | `default`           | fundo `color.action.primary`, texto `color.text.on-action`, borda `color.border.strong`, `elevation.1`, `gradient.gloss` | **uma por tela** — a ação principal           |
| `secondary`   | `outline`           | fundo transparente, texto `color.text.primary`, borda `color.border.default`                                             | ações alternativas ("Ver pista", "Recomeçar") |
| `ghost`       | `ghost`             | sem borda nem fundo                                                                                                      | navegação, ações terciárias                   |
| `danger`      | `destructive`       | fundo `color.feedback.danger` @ 20%, texto `color.feedback.danger`                                                       | só "Apagar progresso"                         |

As variantes `secondary` e `link` do shadcn existem no código, mas não fazem parte do vocabulário do CodeLuv — não usar.

- **Tamanhos (`size`):** `sm` (36, só dentro de painéis densos — mantém área de toque de 48 com margem) · `default` (48) · `lg` (56, chamadas do herói) · `icon` (48×48, inclusive no cabeçalho e no botão de fechar de gavetas e diálogos). `icon-sm` (36) não é usado: a área de toque mínima é 48 em todo lugar (5.3, 11).
- **Links com cara de botão:** `<Link href="…" className={buttonVariants({ variant: 'ghost' })}>`. **Não** usar `<Button nativeButton={false} render={<Link />}>`: o Base UI aplica `role="button"` no `<a>` e o leitor de tela anuncia o link como botão.
- **Ícone no botão:** `<Icone data-icon="inline-start" />`, sem classes de tamanho.

| Estado       | Aparência                                                                        | Comportamento                                                    |
| ------------ | -------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| padrão       | conforme variante                                                                |                                                                  |
| hover        | primary → `color.action.primary.hover`; demais → fundo `color.bg.surface.raised` | só com ponteiro                                                  |
| foco         | anel `color.border.focus`, `border.width.focus`, afastado 2px                    | sempre visível ao navegar por teclado                            |
| pressionado  | movimento `press`                                                                |                                                                  |
| desabilitado | opacidade 50%, sem sombra, texto `color.text.disabled`                           | explicar por quê ao lado ("Termine a conferência para concluir") |
| carregando   | ícone girando no lugar do ícone; rótulo mantido                                  | mantém largura, bloqueia repetição                               |

- **Conteúdo:** verbo no infinitivo + objeto, até 3 palavras; nunca quebra linha.
- **Acessibilidade:** `button` nativo; rótulo é o próprio texto.

**ListenControls** — controle da escuta

- **Para que serve:** permitir ouvir a explicação na voz da Luv, no ritmo da aluna.
- **Quando usar:** no topo de toda explicação; fixo (`z.sticky`) enquanto a explicação estiver na tela; no celular, fixo na base (ver 13.4).
- **Anatomia:** avatar da Luv (`icon.lg`, estado "aprender"; ver 13.4) · botão Ouvir/Pausar · Voltar trecho · Repetir trecho · seletor de velocidade (0,75× · 1× · 1,25× · 1,5×) · indicador "Trecho 3 de 9".

| Estado       | Aparência / comportamento                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| parado       | botão principal "Ouvir explicação" (variante `primary`)                                                |
| tocando      | botão vira "Pausar"; avatar faz `luv-bob` uma vez por trecho (sem movimento reduzido; ver 13.4)        |
| pausado      | botão "Continuar"; trecho atual continua destacado                                                     |
| fim          | botão "Ouvir de novo"; foco vai para a seção Prática                                                   |
| indisponível | controles desabilitados + mensagem "A voz não está disponível neste aparelho. O texto está todo aqui." |

- **Regras:** nunca começa sozinho. A velocidade escolhida é lembrada. Atalhos de teclado: `Espaço` (ouvir/pausar quando o controle está em foco), `←` / `→` (trecho anterior/próximo).
- **Acessibilidade:** grupo com rótulo "Controle da escuta"; o botão principal anuncia o estado; mudanças de trecho **não** são anunciadas pelo leitor de tela (evita voz sobre voz).

**ReadAlongText** — texto acompanhado

- **Para que serve:** mostrar qual trecho da explicação está sendo lido.
- **Anatomia:** parágrafos em `type.body.lg`, divididos em trechos (uma frase cada).
- **Trecho em leitura:** fundo `color.bg.highlight` + sublinhado de 2px `color.action.primary` — dois sinais, não só cor. (o `::highlight` não aceita raio nem padding).
- **Comportamento:** a página rola para manter o trecho visível, mas só se ele sair da tela (sem pular a cada frase). Clicar num trecho começa a leitura a partir dele.
- **Termos técnicos:** na primeira aparição, em `type.code`; a explicação do termo vem na frase seguinte, nunca em tooltip.

**CodeEditor** + **ResultPreview**

- **Para que serve:** escrever código e ver o resultado na hora.
- **Anatomia:** abas por linguagem (`Tabs`, só as da aula) · área de código (`type.code`, numeração de linhas, fundo `color.bg.surface.raised`) · `RetroWindow` com título "Meu site" contendo o resultado · barra de ações (`Conferir` primary, `Recomeçar` secondary).
- **Cores do código:** tema de realce próprio, a partir da paleta (tags e seletores em `pink.400`, atributos e propriedades de CSS em `violet.300`, valores em `pink.100`, textos em `cream.100`, comentários em `ink.400`) — todos ≥ 4.5:1 sobre `color.bg.surface.raised` e sobre a linha ativa, que usa `color.bg.surface` (`ink.900`), mais escura. Exemplos de código na explicação recebem foco pelo teclado, porque podem rolar para o lado.
- **Regras:** o resultado **não herda** nenhum estilo do CodeLuv (fundo branco padrão do navegador até a aluna mudar). Erro que impede o resultado: mensagem curta dentro da janela, em `color.feedback.warning`, nunca tela vermelha.

**CheckList** — conferência

- **Para que serve:** mostrar, item por item, o que a prática pede e o que já está certo.
- **Anatomia:** lista de itens; cada item = ícone + texto do critério.

| Estado do item | Ícone             | Texto                  | Cor                                                             |
| -------------- | ----------------- | ---------------------- | --------------------------------------------------------------- |
| não conferido  | círculo vazio     | critério               | `color.text.secondary`                                          |
| certo          | check em círculo  | critério + "certo!"    | `color.feedback.success`                                        |
| ainda não      | círculo tracejado | critério + "ainda não" | `color.feedback.danger` no ícone; texto em `color.text.primary` |

- **Acessibilidade:** resultado anunciado uma vez, de forma educada ("2 de 3 itens certos").

**HintPanel** — pistas

- **Anatomia:** `Card` com borda `color.feedback.warning`, ícone de lâmpada, título "Pista 1 de 2", texto; ação "Ver próxima pista" e, depois da última, "Ver solução".
- **Regras:** pistas aparecem uma de cada vez; a solução sempre disponível; nada indica "perda".

**LuvBubble**

- **Para que serve:** dar voz à Luv em boas-vindas, incentivo, pistas e celebrações.
- **Anatomia:** `Message` > `MessageAvatar` (`Avatar size="xl"`, 64px, imagem `alt=""` + `AvatarFallback`) + `MessageContent` > `Bubble variant="tinted"` (fundo levemente rosado — DS-12) > `BubbleContent` (até 2 frases, `text-base`).
- **Versão herói:** ilustração de até 240px (192px no celular), redonda, com contorno e `elevation.2`, e o balão logo abaixo. Usada no Início e nas celebrações.
- **Arte:** `public/images/luv/<estado>.png`. Hoje só existe `ola.png` (recortada do logo); os demais estados usam `ola.png` até ganharem arte própria (13.4).
- **Estados da Luv:** `ola` · `aprender` · `praticar` · `pista` · `incentivo` · `comemorar` · `descansar` · `evoluir` (correspondência visual na seção 13 do briefing).
- **Tamanhos:** `avatar` 48–64px em balões · `ilustracao` até 240px em herói e celebração; nunca mais de ~25% da área visível.
- **Regras:** uma Luv por tela; entra com `motion.easing.enter`; nunca cobre editor nem explicação; some sozinha só se a mensagem não for necessária (incentivo e pista ficam até a próxima conferência); desligável em Configurações.
- **Acessibilidade:** imagem `alt=""`; mensagem em região `aria-live="polite"`.

**RetroWindow**

- **Para que serve:** moldurar o resultado da prática e as miniaturas do site pessoal como "programa de computador antigo".
- **Anatomia:** barra de título (`color.bg.surface.raised`, altura 32) com três bolinhas decorativas (`danger.400`, `warning.300`, `success.400`, 10px) e título em 12px/600 (`text-xs font-semibold`, `color.text.secondary`) — a barra é compacta, de 32px · corpo · borda `border.width.default` `color.border.default` · `radius.lg`.
- **Regras:** as bolinhas são decorativas — não são botões, não têm foco.

**Toast**

- **Para que serve:** confirmar algo que acabou de acontecer (aula concluída, conquista).
- **Anatomia:** `Card` `elevation.2`, ícone de pixel, título e uma frase; para conquista, com `LuvBubble` em estado `comemorar`.
- **Regras:** canto inferior direito (topo no celular), some em 6s, pausa ao passar o mouse ou focar; nunca para erro que exige decisão.

**ProgressBar**

- **Anatomia:** trilho `color.bg.surface.raised` com borda `color.border.default`; preenchimento `gradient.brand` com `gradient.gloss`; rótulo textual ao lado ("4 de 7 aulas").
- **Regras:** `gloss-sweep` ao avançar; o rótulo textual é obrigatório (não só a barra).

**AchievementBadge**

- **Estados:** `bloqueado` (silhueta em `ink.700`, texto "Como ganhar: …") · `ganho` (cores plenas, contorno `color.border.strong`) · `novo` (`elevation.highlight` até ser visto).

**Card**, **TextField**, **Switch**, **Tabs**, **Dialog**, **Badge**, **LessonListItem**, **LessonStepper**, **Header/NavDrawer**, **IconButton** — seguem os tokens das seções 3 e 5 com as regras gerais: borda `border.width.default`, `radius` conforme 3.4, foco conforme `Button`, rótulos sempre visíveis. Fichas completas serão escritas quando cada um passar de `proposto` para `em construção`.

---

## 9. Padrões

| Padrão                       | Regra                                                                                                                                                                                                                                                                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primeiro uso**             | `LuvBubble` (`ola`) + campo "Como você quer ser chamada?" (opcional, com "Pular") + 3 frases do combinado + um único botão "Começar a primeira aula". Nada mais na tela.                                                                                                                                                                     |
| **Estrutura da aula**        | Sempre a mesma ordem: Objetivo → Explicação (com `ListenControls`) → Exemplo → Prática (`CodeEditor` + `CheckList`) → Conclusão. `LessonStepper` mostra o passo atual.                                                                                                                                                                       |
| **Escuta**                   | Controle no topo da explicação, nunca toca sozinho, trecho destacado com dois sinais (fundo + sublinhado), texto sempre completo na tela.                                                                                                                                                                                                    |
| **Conferência e pistas**     | "Conferir" é a ação principal da prática. Item "ainda não" → `LuvBubble` (`incentivo`) + botão "Ver pista" abaixo da conferência (uma pista de cada vez para o exercício todo). Pistas progressivas; "Ver solução" depois da última.                                                                                                         |
| **Conclusão de aula**        | "Concluir aula" só habilita com a conferência completa (com texto explicando enquanto estiver desabilitado). Ao concluir: aviso 'Aula concluída' (e um aviso por conquista nova) + o site da aluna com a parte nova, no lugar da Luv grande (a Luv do objetivo já está na tela — DS-13).                                                     |
| **Celebração de módulo**     | Única tela cheia permitida: `gradient.synthwave`, Luv (`evoluir`), `type.display`, botão para continuar. Fecha com `Esc`.                                                                                                                                                                                                                    |
| **Formulários**              | Rótulo sempre visível acima do campo; ajuda abaixo; validação ao sair do campo; mensagem com ícone e texto.                                                                                                                                                                                                                                  |
| **Campos opcionais**         | Marca-se o opcional ("(opcional)"); o resto é obrigatório. Na Fase 1, o único campo é o nome, e é opcional.                                                                                                                                                                                                                                  |
| **Estado vazio**             | Luv no estado que combina com o contexto (padrão `descansar`; `aprender` em Aulas, `comemorar` em Conquistas) + uma frase explicando o que vai aparecer aqui + a primeira ação, quando existe uma. Telas sem ação possível ainda (Aulas e Configurações na Fase 1) mostram só a frase. Ex.: "Seu site aparece aqui depois da primeira aula." |
| **Carregando**               | Até 1s nada; até 3s indicador discreto; acima disso, esqueleto. Nunca a Luv "carregando".                                                                                                                                                                                                                                                    |
| **Erro de página**           | O que aconteceu, em linguagem comum + o que fazer + como voltar. Luv (`incentivo`). Nunca código de erro sozinho.                                                                                                                                                                                                                            |
| **Voz indisponível**         | `ListenControls` em estado "indisponível"; a aula continua normal.                                                                                                                                                                                                                                                                           |
| **Progresso não recuperado** | Mensagem que não culpa ("Não encontramos seu progresso neste aparelho") + caminho para recomeçar.                                                                                                                                                                                                                                            |
| **Confirmação destrutiva**   | Só "Apagar progresso": `Dialog` nomeia o que será perdido; botão diz a ação ("Apagar meu progresso"), variante `danger`; cancelar é o foco inicial.                                                                                                                                                                                          |
| **Desfazer**                 | "Recomeçar" não pede confirmação: oferece "Desfazer" num `Toast` por 6s.                                                                                                                                                                                                                                                                     |
| **Notificação temporária**   | Só para confirmar o que aconteceu; nunca para erro que exige decisão.                                                                                                                                                                                                                                                                        |
| **Retomada**                 | Início mostra o cartão "Continuar" (`elevation.highlight`) com a próxima aula e uma frase lembrando a anterior.                                                                                                                                                                                                                              |

---

## 10. Conteúdo e voz

### 10.1 Voz

- **Tratamento:** você, no feminino quando se refere à aluna ("pronta", "conseguiu"); neutro quando possível.
- **Pessoa verbal do produto:** a **Luv fala em primeira pessoa** nos balões ("Vou ler pra você"); a **interface** fala de forma impessoal e direta ("Aula concluída").
- **Tom por situação:**

| Situação    | Tom                        | Exemplo                                                                 |
| ----------- | -------------------------- | ----------------------------------------------------------------------- |
| sucesso     | alegre, curto, sem exagero | "Funcionou! Seu título apareceu."                                       |
| "ainda não" | encorajador, específico    | "Quase! Falta fechar a tag `</p>`. Quer uma pista?"                     |
| pista       | gentil, aponta onde olhar  | "Olha a segunda linha: toda tag que abre precisa fechar."               |
| espera      | honesto                    | "Preparando a voz da Luv…"                                              |
| destrutivo  | claro sobre a consequência | "Isso apaga todas as aulas concluídas e o seu site neste aparelho."     |
| celebração  | orgulhoso, pessoal         | "Você terminou o módulo de HTML. Seu site já tem estrutura de verdade!" |

### 10.2 Regras de escrita

- **Botões:** verbo no infinitivo + objeto — "Ouvir explicação", "Conferir", "Ver pista", "Concluir aula". Nunca "OK", "Enviar".
- **Títulos:** só a primeira letra maiúscula. Exceção: `type.label.brand`, sempre em maiúsculas, até duas palavras.
- **Datas:** "9 de outubro"; números por extenso até dez no texto da Luv.
- **Termos:** exatamente os do vocabulário (seção 16 do [briefing](./briefing.md#16-vocabulário)) — aula, módulo, explicação, prática, conferência, pista, solução, site pessoal, conquista.
- **Palavras proibidas:** "errado", "erro seu", "fácil", "simples", "simplesmente", "óbvio", "basta", "apenas".
- **Bom de ouvir:** frases de até ~20 palavras; sem siglas soltas (escrever "H-T-M-L" é desnecessário — a voz lê "HTML" bem; evitar "ex.:", "p/", "c/"); sem parênteses longos; listas curtas.
- **Emojis:** não usamos na interface. Os ícones de pixel cumprem esse papel.

---

## 11. Acessibilidade

- **Nível-alvo:** WCAG 2.2 AA.
- **Contraste:** texto 4.5:1 · texto grande e elementos funcionais 3:1 — verificado em ambos os temas (tabela 3.1). `violet.500` sobre `ink.950` (~3.6:1) só em bordas, ícones e texto ≥ 24px.
- **Foco:** sempre visível (`color.border.focus`, 3px, afastado 2px); ordem segue a leitura; ao concluir a escuta, o foco vai para a prática.
- **Área de toque:** 48×48px (seção 5.3).
- **Texto ampliado:** layout aguenta 200% sem sobreposição nem rolagem horizontal; na aula dividida, a 200% vira coluna única.
- **Movimento:** respeita preferência do sistema e a opção própria "Reduzir animações" (seção 7).
- **Cor:** nunca é o único sinal (conferência, trecho em leitura, estados de conquista).
- **Escuta e leitores de tela:** a escuta do CodeLuv não substitui o leitor de tela da pessoa; mudanças de trecho não são anunciadas para não sobrepor vozes; todo o texto lido existe na página.
- **Cores forçadas:** contornos de 2px mantêm a forma dos componentes; gradientes e brilhos são dispensáveis.
- **Como verificar:** checagem automática de acessibilidade nos testes de ponta a ponta + teste manual por componente com teclado e leitor de tela (VoiceOver), em ambos os temas.

---

## 12. Plataformas

| Plataforma                      | Implementação                                                              | Onde segue a plataforma                               | Onde segue o design system  |
| ------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------- | --------------------------- |
| **Web — notebook** (principal)  | Next.js + Tailwind CSS 4 + shadcn/ui (`base-nova`, Base UI, ícones Lucide) | rolagem, seleção de texto, atalhos do navegador       | tudo o mais                 |
| **Web — celular** (ler e ouvir) | mesma base, responsiva                                                     | gestos do navegador, teclado virtual                  | tudo o mais                 |
| **Voz da Luv**                  | voz em português disponível no aparelho                                    | timbre e pronúncia dependem do aparelho (briefing Q1) | controles, destaque, textos |

Não há aplicativo nativo previsto.

---

## 13. Governança

### 13.1 Papéis

- **Responsável pelo design system:** Claudio Soares.
- **Quem pode propor mudança:** o responsável e a aluna (a partir da Fase 3, se ela quiser participar — briefing Q7).
- **Quem aprova:** o responsável.

### 13.2 Ciclo de uma contribuição

1. **Proposta** — o problema e onde ele aparece (pelo menos dois lugares).
2. **Revisão** — visual, código e acessibilidade (contraste, foco, movimento).
3. **Construção** — tokens e componente juntos, com a ficha da seção 8.2.
4. **Publicação** — versão nova e linha no histórico deste documento.
5. **Adoção** — telas existentes migradas ou exceção registrada em 13.4.

### 13.3 Versionamento

- **Esquema:** SemVer. Enquanto `0.x`, mudanças que quebram são permitidas, desde que registradas.
- **Descontinuação:** componente marcado `descontinuado` por pelo menos uma versão menor antes de sair, com substituto indicado.
- **Notas de mudança:** histórico deste documento e `CHANGELOG.md` do projeto.

### 13.4 Divergências abertas

| Item                                                | Diverge onde       | Diferença                                                                                                                                                                                                                                                      | Plano                                                                                                                                                           | Prazo   |
| --------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| Texto dos botões rosa                               | design (moodboard) | moodboard usa texto branco; DS exige texto escuro (DS-02)                                                                                                                                                                                                      | seguir o DS; moodboard é referência de clima, não de regra                                                                                                      | —       |
| Recortes da Luv                                     | design             | só `ola.png` existe (recortada do logo); os outros 7 estados existem só no moodboard, sem fundo transparente                                                                                                                                                   | produzir os recortes em `public/images/luv/`; até lá, todos usam `ola.png`                                                                                      | Fase 1  |
| Ícones de pixel                                     | design             | só existem no moodboard (coração, estrela, planeta, cursor)                                                                                                                                                                                                    | redesenhar em grade 16×16; até lá, Lucide (`HeartIcon`, `SparklesIcon`)                                                                                         | Fase 1  |
| Tema claro                                          | código             | valores definidos em `:root`, sem seletor                                                                                                                                                                                                                      | implementar com seletor em Configurações                                                                                                                        | Fase 2  |
| `gradient.synthwave` e `elevation.3`                | código             | definidos aqui, não implementados                                                                                                                                                                                                                              | implementar quando a celebração de módulo e os diálogos forem construídos                                                                                       | Fase 1  |
| Largura máxima                                      | código             | cabeçalho e conteúdo usam `max-w-6xl` (1152px); `layout.max` diz 1200px                                                                                                                                                                                        | alinhar o token ou o documento                                                                                                                                  | Fase 1  |
| Camadas de sobreposição                             | código             | `Sheet`/`Dialog` do shadcn usam `z-50`; a tabela 3.6 prevê `z.overlay` 30 e `z.modal` 40                                                                                                                                                                       | ajustar a tabela 3.6 aos valores do shadcn (não usar `z-index` manual em sobreposições); incluir o link "Pular para o conteúdo" (`z-20`) e o cabeçalho (`z-10`) | Fase 1  |
| `LessonStepper` ("Passo 2 de 4")                    | código             | a aula mostra tudo numa página (explicação à esquerda, prática à direita); a barra diz só "Aula N · HTML"                                                                                                                                                      | decidir se o indicador de passo ainda faz sentido com a aula dividida                                                                                           | Plano 3 |
| Movimento `sparkle` na conclusão                    | código             | a conclusão ainda não tem os brilhos                                                                                                                                                                                                                           | implementar junto com a celebração de módulo                                                                                                                    | Fase 1  |
| Destaque da parte nova no site                      | código             | a conclusão mostra o site inteiro com a parte nova, sem destacá-la dentro do site (DS-08: o site da aluna não recebe estilos do CodeLuv)                                                                                                                       | manter                                                                                                                                                          | —       |
| Cópia de recuperação automática                     | código             | se o progresso guardado não puder ser lido, a primeira gravação nova guarda o texto original em `codeluv:progresso:recuperacao` (sem tela para recuperá-lo ainda)                                                                                              | oferecer "recuperar" quando isso acontecer                                                                                                                      | Fase 2  |
| Página não encontrada (status HTTP)                 | código             | endereço de aula inexistente responde 200 com `noindex`; o HTML inicial traz o esqueleto da aula, e a página em português é desenhada no cliente depois da hidratação (o Suspense exigido pelo Partial Prefetching começa o streaming antes do `notFound()`)`) | aceito para um app pessoal; um 404 real exigiria validar o slug num Proxy                                                                                       | —       |
| Coluna da prática com altura da tela (DS 5.2)       | código             | a prática rola junto com a página; não é fixa nem tem a altura da tela                                                                                                                                                                                         | avaliar com a aluna se a rolagem atrapalha                                                                                                                      | Plano 3 |
| Toast no topo no celular (DS 8.2)                   | código             | o viewport do toast do shadcn fica embaixo em todas as larguras                                                                                                                                                                                                | ajustar o `ToastViewport`                                                                                                                                       | Fase 1  |
| Controles da escuta no celular                      | código             | ficam fixos no topo (abaixo da barra da aula), não na base                                                                                                                                                                                                     | avaliar com a aluna no celular                                                                                                                                  | Fase 2  |
| Avatar da Luv nos controles da escuta               | código             | os controles não mostram a Luv (a página já tem a Luv do objetivo — uma Luv por tela)                                                                                                                                                                          | manter                                                                                                                                                          | —       |
| Clique no texto para ouvir dali                     | código             | funciona com a escuta tocando ou pausada (pausada, pula e retoma dali), nunca parada (nada toca sozinho); é ignorado durante a seleção de texto e em links                                                                                                     | manter                                                                                                                                                          | —       |
| Destaque do trecho sem a CSS Custom Highlight API   | código             | navegadores sem a API leem normalmente, sem destaque                                                                                                                                                                                                           | aceitar (API presente em Chrome, Safari e Firefox atuais)                                                                                                       | —       |
| Espaço para ouvir/pausar e dica de teclado (DS 8.2) | código             | o Espaço só aciona o botão em foco (nativo); não há dica `kbd` dos atalhos ← →                                                                                                                                                                                 | manter o comportamento nativo; avaliar a dica com a aluna                                                                                                       | Fase 2  |
| Robustez da voz do navegador                        | código             | não há vigia para fala ignorada logo após cancelar (alguns Chrome de Linux/Android) nem tratamento do corte de ~15s de vozes de rede do Google                                                                                                                 | observar no uso real; frases são curtas                                                                                                                         | —       |
| Atalhos ← → nos limites                             | código             | ← no primeiro trecho repete o trecho; → no último não faz nada (os botões ficam desabilitados)                                                                                                                                                                 | manter                                                                                                                                                          | —       |
| Site de exemplo nas aulas de CSS                    | código             | sem HTML concluído, o CSS aparece nas soluções das aulas de HTML (o "site da Ana"), com aviso ligado ao resultado por `aria-describedby` (prática, aula concluída e Meu site)                                                                                  | manter                                                                                                                                                          | —       |
| Conferência de CSS e herança                        | código             | a conferência pede o seletor da aula; cor herdada do `body` aparece certa no resultado, mas não passa no item (DS-14)                                                                                                                                          | observar com a aluna                                                                                                                                            | Fase 2  |

---

## 14. Registro de decisões

**DS-01 — Tema escuro como padrão**

- **Data:** 2026-10-09
- **Contexto:** moodboard mostra a interface em fundo escuro; a aluna estuda à noite.
- **Alternativas consideradas:** claro (creme) como padrão — mais "papel", combina com leitura diurna; escuro como padrão — fiel ao moodboard, confortável à noite, acentos rosa/violeta brilham mais.
- **Decisão:** escuro padrão; claro (creme) como opção na Fase 2.
- **Por quê:** contexto de uso (noite) e identidade Y2K "quarto gamer".
- **Tokens / componentes afetados:** todos os semânticos de cor.
- **Revisar se:** ela preferir o claro na maioria das sessões.

**DS-02 — Texto escuro sobre o rosa vibrante**

- **Data:** 2026-10-09
- **Contexto:** o moodboard usa texto branco no botão rosa; o contraste fica em ~3:1.
- **Alternativas consideradas:** branco (fiel ao moodboard, reprova WCAG para texto); rosa mais escuro com texto branco (passa, mas perde o brilho da marca); texto escuro sobre o rosa original (~6:1).
- **Decisão:** texto `ink.950` sobre `pink.500`.
- **Por quê:** princípio "Aprender vem antes de enfeitar" e WCAG AA, mantendo a cor da marca.
- **Tokens / componentes afetados:** `color.text.on-action`, `Button` primary.
- **Revisar se:** nunca, enquanto a cor de ação for `pink.500`.

**DS-03 — Contorno "adesivo" de 2px como assinatura**

- **Data:** 2026-10-09
- **Contexto:** o estilo Y2K do moodboard usa contornos marcados; o rosa vibrante tem pouco contraste contra o creme no tema claro.
- **Alternativas consideradas:** bordas finas de 1px (mais "moderno", menos personalidade); sem borda, só sombra (pouco visível no escuro); contorno de 2px.
- **Decisão:** `border.width.default` = 2px em botões, cartões e campos; botões e badges com contorno `color.border.strong` e sombra dura.
- **Por quê:** traduz a estética de adesivo, garante o limite dos componentes em ambos os temas e no modo de cores forçadas.
- **Tokens / componentes afetados:** `border.width.*`, `elevation.*`, `Button`, `Card`, `AchievementBadge`.
- **Revisar se:** a interface parecer pesada em telas densas.

**DS-04 — Orbitron só em títulos, nunca abaixo de 18px**

- **Data:** 2026-10-09
- **Contexto:** Orbitron é a fonte da marca, mas é larga e pouco legível em tamanhos pequenos.
- **Alternativas consideradas:** Orbitron em títulos e botões; só em títulos e números; trocar por outra futurista mais legível.
- **Decisão:** Orbitron só em `type.display` e `type.heading.lg/md`; botões e rótulos em Poppins.
- **Por quê:** princípio "Nostalgia com maturidade" — personalidade nos títulos, legibilidade no resto.
- **Tokens / componentes afetados:** escala tipográfica 3.2.
- **Revisar se:** surgir uma fonte com a mesma personalidade e melhor leitura em tamanho pequeno.

**DS-05 — Decoração só nas bordas da experiência**

- **Data:** 2026-10-09
- **Contexto:** risco registrado no briefing: visual decorado atrapalhar a leitura.
- **Decisão:** gradientes, brilhos, pixel art e ilustração da Luv proibidos na explicação, no editor e no resultado; permitidos em herói, estados vazios, celebrações, cabeçalho e moldura.
- **Por quê:** princípio "Aprender vem antes de enfeitar".
- **Tokens / componentes afetados:** `gradient.*`, `elevation.highlight`, `LuvBubble`, padrões da seção 9.
- **Revisar se:** a interface parecer "sem graça" para a aluna nas áreas de estudo — ajustar com cor, não com ornamento.

**DS-06 — Trecho em leitura com dois sinais e sem animação**

- **Data:** 2026-10-09
- **Contexto:** a escuta é o recurso central; o destaque precisa ser percebido sem distrair.
- **Alternativas consideradas:** só cor de fundo; palavra a palavra (mais preciso, muito agitado); frase a frase com fundo + sublinhado.
- **Decisão:** destaque por frase, com fundo `color.bg.highlight` e sublinhado `color.action.primary`, trocando sem transição.
- **Por quê:** cor nunca é o único sinal; ritmo calmo; texto lido nunca é animado.
- **Tokens / componentes afetados:** `color.bg.highlight`, `ReadAlongText`.
- **Revisar se:** a aluna sentir falta de acompanhar palavra a palavra.

**DS-07 — Dois conjuntos de ícones com papéis separados**

- **Data:** 2026-10-09
- **Contexto:** o moodboard tem ícones de pixel (coração, estrela, planeta, cursor), mas eles não cobrem ações de interface e ficam ruins em 16–20px.
- **Alternativas consideradas:** só pixel (identidade forte, ações pouco claras); só biblioteca de contorno (claro, sem personalidade); os dois com papéis distintos.
- **Decisão:** Lucide para ações e navegação; pixel art para status e celebração.
- **Por quê:** clareza nas ações, personalidade nos momentos de marca.
- **Tokens / componentes afetados:** seção 6.1.
- **Revisar se:** a mistura parecer incoerente em uso real.

**DS-08 — O site pessoal da aluna fica fora do design system**

- **Data:** 2026-10-09
- **Contexto:** o resultado da prática é o site dela.
- **Decisão:** o conteúdo do resultado não herda estilos do CodeLuv; só a moldura (`RetroWindow`) pertence ao design system.
- **Por quê:** o site precisa "parecer dela" (briefing, seção 10.3) e ela precisa ver o efeito real do próprio CSS.
- **Tokens / componentes afetados:** `ResultPreview`, `RetroWindow`.
- **Revisar se:** nunca.

**DS-09 — shadcn/ui como base dos componentes**

- **Data:** 2026-10-09
- **Contexto:** o primeiro preview foi um HTML solto; cada componente precisaria ser escrito do zero, incluindo foco, teclado e papéis de acessibilidade.
- **Alternativas consideradas:** componentes próprios do zero (controle total, muito trabalho e risco de acessibilidade); biblioteca fechada (rápido, difícil de dar a cara Y2K); shadcn/ui (código copiado para o projeto, acessível via Base UI, tematizável por variáveis).
- **Decisão:** shadcn/ui, estilo `base-nova`, primitivos Base UI, ícones Lucide, todos os componentes instalados em `src/components/ui/`. A identidade entra por tokens (`globals.css`) e por ajustes pontuais nas variantes dos componentes da base.
- **Por quê:** acessibilidade e comportamento prontos; os componentes são código do projeto, então o estilo "adesivo" pode ser aplicado na fonte.
- **O que abrimos mão:** parte da liberdade de nomear tokens (seguimos os nomes do shadcn — seção 2.2) e atualizações automáticas da base (cada atualização passa por `shadcn add --diff`).
- **Tokens / componentes afetados:** todos.
- **Revisar se:** a base atrapalhar mais do que ajudar em componentes de aprendizagem.

**DS-10 — `font-heading` em Poppins; Orbitron só em `font-display`**

- **Data:** 2026-10-09
- **Contexto:** o shadcn usa `font-heading` em títulos de componente de 14–16px (Dialog, Sheet, Drawer, Empty). Com Orbitron ali, a DS-04 seria violada em seis componentes.
- **Alternativas consideradas:** editar os seis componentes; mapear `font-heading` para Poppins e criar `font-display` para Orbitron.
- **Decisão:** `font-heading` → Poppins; `font-display` → Orbitron, usada só nos títulos de página da tabela 3.2.
- **Por quê:** a DS-04 passa a valer por padrão, sem editar componente por componente.
- **Tokens / componentes afetados:** `--font-heading`, `--font-display`, `type.display`, `type.heading.lg/md`.
- **Revisar se:** algum componente da base precisar de título de marca.

**DS-11 — Destaque sem brilho colorido difuso**

- **Data:** 2026-10-09
- **Contexto:** a primeira versão previa `elevation.glow` (halo rosa/violeta difuso) para o item em destaque. Na revisão do preview, o halo colorido sobre fundo escuro foi apontado como clichê visual e não foi usado na proposta aprovada.
- **Alternativas consideradas:** halo colorido difuso; borda rosa + sombra dura maior.
- **Decisão:** `elevation.highlight` = borda `color.action.primary` + `elevation.2`.
- **Por quê:** mantém a linguagem de adesivo (sombra dura) e o destaque continua claro, sem efeito genérico.
- **Tokens / componentes afetados:** `elevation.highlight`, `AchievementBadge`, padrões "Conclusão de aula" e "Retomada".
- **Revisar se:** o destaque não for percebido em uso real.

**DS-12 — Escolhas visuais do Plano 1**

- **Data:** 2026-10-09
- **Contexto:** para cada componente da fundação, duas ou três opções foram mostradas lado a lado no visual companion, com os tokens do CodeLuv e a arte da Luv.
- **Decisão:**
  - Cabeçalho: destino ativo com **sublinhado rosa** (eco do moodboard), em vez de fundo ou pílula.
  - Menu no celular: **gaveta lateral**, em vez de gaveta de baixo.
  - Balão da Luv: **tingido** (rosado), em vez de escuro ou contornado.
  - Janela retrô: **três bolinhas** na barra escura, em vez de barra rosa ou moldura dupla.
  - Estado vazio: **limpo** (Luv, texto e ação), sem contorno tracejado nem cartão.
  - Início: **Luv grande** ao lado do texto, com a fala embaixo dela.
- **Por quê:** escolha da responsável pelo produto, olhando as opções reais.
- **Tokens / componentes afetados:** seção 5.3, `LuvBubble`, `RetroWindow`, `EmptyState`, padrão "Primeiro uso"/Início.
- **Revisar se:** a aluna achar o balão tingido ou a Luv grande chamativos demais no uso diário.

**DS-13 — A conclusão de aula celebra com o site, não com a Luv**

- **Data:** 2026-10-09
- **Contexto:** a celebração com a Luv grande deixava duas Luvs na tela (a do objetivo e a da celebração).
- **Alternativas consideradas:** esconder a Luv do objetivo; trocar a Luv da celebração pelo site da aluna.
- **Decisão:** a celebração mostra o site da aluna atualizado ("Seu site ganhou uma parte nova").
- **Por quê:** cumpre "uma Luv por tela" e reforça o fio condutor do briefing (o site que cresce aula a aula).
- **Tokens / componentes afetados:** `LessonDone`, `SitePreview`, padrão "Conclusão de aula".
- **Revisar se:** a aluna sentir falta da Luv comemorando.

**DS-14 — A conferência de CSS lê as regras escritas**

- **Data:** 2026-10-09
- **Contexto:** o módulo de CSS precisa conferir a prática. O resultado na tela aceitaria qualquer caminho, mas depende de desenhar a página e é difícil de testar e de explicar numa pista.
- **Alternativas consideradas:** medir o estilo calculado no resultado; ler as regras escritas.
- **Decisão:** ler as regras (`css-tree`): "existe uma regra para `h1` com `color`". Declaração com valor inválido não conta, como no navegador; valores com `var()` contam como válidos (o analisador não consegue validá-los) e regras dentro de qualquer `@media`, até aninhada em `@supports`, são reconhecidas.
- **Por quê:** previsível, igual nos testes e no navegador, e cada item da conferência vira uma pista clara.
- **O que abrimos mão:** caminhos que chegam ao mesmo resultado por outro seletor (por exemplo, cor herdada do `body`) não passam no item.
- **Revisar se:** a aluna travar com frequência num item que o resultado já mostra certo.

---

## Histórico deste documento

| Data       | O que mudou                                                                                                                                                                             | Quem           |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| 2026-10-09 | Primeira versão, a partir do template e do briefing reescrito                                                                                                                           | Claudio Soares |
| 2026-10-09 | 0.2.0 — shadcn/ui como base (DS-09); tokens com nomes do shadcn; `font-display` (DS-10); destaque sem brilho (DS-11); inventário com a base de cada componente; contrastes recalculados | Claudio Soares |
| 2026-10-09 | 0.2.1 — escolhas visuais do Plano 1 registradas (DS-12)                                                                                                                                 | Claudio Soares |
| 2026-10-09 | 0.2.2 — área de toque de 48px sem exceção no cabeçalho; divergências da revisão do Plano 1 registradas                                                                                  | Claudio Soares |
| 2026-10-09 | 0.2.3 — Plano 1 entregue: RetroWindow, SiteHeader, LuvSays/LuvAvatar e EmptyState prontos; `/preview` removida; link "Pular para o conteúdo"; inventário e padrões alinhados ao código  | Claudio Soares |
| 2026-10-09 | 0.3.0 — Plano 2 entregue: CodeEditor, ResultPreview, CheckList, HintPanel, Toast e lista de aulas prontos                                                                               | Claudio Soares |
| 2026-10-09 | 0.3.1 — revisão final do Plano 2: uma Luv por tela na prática, avisos com 6s, divergências atualizadas                                                                                  | Claudio Soares |
| 2026-10-09 | 0.4.0 — Plano 3 entregue: escuta com ListenControls e destaque do trecho (ReadAlongText)                                                                                                | Claudio Soares |
| 2026-10-09 | 0.4.1 — revisão final do Plano 3: rolagem respeita os controles fixos, foco na seção Prática, alto contraste no destaque                                                                | Claudio Soares |
| 2026-10-09 | 0.5.0 — Plano 4 entregue: progresso no aparelho, primeiro uso, Meu site, conquistas e cópia do progresso (DS-13)                                                                        | Claudio Soares |
| 2026-10-09 | 0.6.0 — Plano 5 entregue: módulo de CSS, editor de CSS, "Ver como celular" e conferência por regras (DS-14)                                                                             | Claudio Soares |

---

> Este documento descreve **como o CodeLuv se apresenta e se comporta na interface**. O que ele precisa fazer estará no PRD; por que existe está no [briefing](./briefing.md); como é construído estará na Architecture. Quando uma tela contradisser o que está aqui, ou a tela está errada, ou este documento precisa de uma decisão nova — e registrá-la é sempre a prioridade.
