# CodeLuv

Plataforma para quem nunca programou aprender HTML, CSS e (em breve) JavaScript construindo o próprio site pessoal, com a gatinha Luv. As aulas podem ser ouvidas em voz alta, praticadas na hora e somadas, uma a uma, ao site da aluna.

**No ar:** https://claudiosoaresdev.github.io/code-luv/

O progresso fica só no navegador de quem estuda (`localStorage`); não há conta nem servidor.

## Rodando localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Scripts

| Script                | O que faz                                                   |
| --------------------- | ----------------------------------------------------------- |
| `npm run dev`         | servidor de desenvolvimento                                 |
| `npm run lint`        | ESLint                                                      |
| `npm test`            | testes unitários (Vitest)                                   |
| `npm run test:e2e`    | testes de ponta a ponta (Playwright + axe)                  |
| `npm run build`       | build do Next.js                                            |
| `npm run build:pages` | site estático em `out/`, com o prefixo `/code-luv` do Pages |

## Publicação

Cada push na `main` roda `.github/workflows/pages.yml`: lint, testes, `build:pages` e publicação no GitHub Pages. No build do Pages, o Next.js gera um export estático (`output: 'export'`) sem Cache Components/Partial Prefetching, que não existem nesse modo.

## Documentos

- [Briefing](docs/briefing.md) — o que o produto é e para quem.
- [Design system](docs/design-system.md) — identidade Y2K, componentes, voz da Luv e acessibilidade.
- [Planos e specs](docs/superpowers/) — como cada parte foi planejada.
