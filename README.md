# Química com Sabrina

Portal estático da professora Sabrina Pacheco. Primeira versão visual, com três disciplinas e Química III prevista para o futuro. Química I contém os 11 temas fornecidos pela professora, na ordem solicitada. Os materiais de cada tema e as sequências das demais disciplinas ainda serão acrescentados.

## Arquivos

- `dist/index.html`: estrutura, textos e ilustrações SVG.
- `dist/styles.css`: apresentação responsiva e temas claro/escuro.
- `dist/app.js`: seleção de disciplinas, navegação por teclado, apresentação do portal e preferência de tema.

## Abrir localmente

Execute `python3 -m http.server 4173 --directory dist` nesta pasta e abra `http://localhost:4173`.

## Publicar no GitHub Pages

O conteúdo de `dist/` é independente do Sites. Copie esses três arquivos para a raiz de um repositório do GitHub e configure o Pages para publicar a raiz da branch. Também pode usar uma pasta `docs/` ou um workflow que publique `dist/`.

O portal não requer Flask nem banco de dados. Somente a preferência de tema é salva no navegador. As fontes Google são opcionais: sem rede, usam-se as fontes locais de substituição.

## Próxima etapa

Adicionar os links de materiais e roteiros de Química I e as sequências das demais disciplinas, fornecidos pela professora. Os espaços em preparação não representam conteúdos já publicados.
