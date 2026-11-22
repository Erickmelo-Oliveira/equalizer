# Equalizer

Sistema web de precificação para pequenos negócios: cadastre materiais, calcule o preço de venda com margem de lucro e consulte o histórico de cálculos.

🔗 **Site:** https://projeto-equalizer.netlify.app/

## Sobre o projeto
A primeira versão foi gerada com apoio de IA (Bolt). Depois disso, estou estudando o código e fazendo as mudanças por conta própria, com um commit para cada alteração.

## O que eu já fiz
- Corrigi o cálculo da margem: ela agora é sobre o preço de venda (preço = custo ÷ (1 − margem)), e não um markup sobre o custo
- Adicionei validação nos campos (quantidade e margem)

## Em andamento
- [ ] Remover o login (que dependia de um serviço externo) e deixar os dados no navegador
- [ ] Revisar o histórico e o painel
- [ ] Refazer o visual

## Tecnologias
React · TypeScript · Vite · Tailwind CSS

## Como rodar
```bash
npm install
npm run dev
```
