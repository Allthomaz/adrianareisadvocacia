# Design — Parallax 2.5D institucional no Sobre

**Data:** 2026-08-30  
**Status:** aprovado para planejamento  
**Escopo:** fotografia de abertura da seção `#sobre` na homepage

## 1. Objetivo

Substituir o deslocamento plano da fotografia do Sobre por uma composição 2.5D
em Three.js, com profundidade perceptível e movimento discreto. O resultado deve
parecer um retrato editorial institucional — sóbrio, chique e apropriado à
advocacia — sem aparência de demonstração tecnológica, jogo ou cartão 3D.

O efeito será oferecido no desktop e no mobile. No mobile, a única fonte de
movimento será a rolagem.

## 2. Diagnóstico do efeito atual

O componente `AboutProfile.astro` usa uma única fotografia e aplica a ela um
deslocamento GSAP de 24 px no desktop e 8 px no mobile. Como todos os pixels se
movem juntos, o visitante percebe apenas um pequeno pan vertical, não
profundidade entre planos.

O novo sistema elimina somente esse parallax da fotografia. As timelines de
entrada do texto, da moldura e das demais seções continuam em GSAP.

## 3. Direção visual aprovada

A cena terá três planos, do fundo para a frente:

1. **Fundo institucional:** campo vinho/marfim, arco arquitetônico abstrato e
   textura muito sutil. O desenho deve sugerir portada, documento e tradição,
   sem usar balança, martelo ou coluna grega literal.
2. **Retrato:** recorte transparente derivado exclusivamente da fotografia
   autorizada `assets/references/foto-adriana-atual.jpeg` (1023 × 1537). O
   recorte pode remover o fundo, mas não pode alterar rosto, corpo, roupa,
   proporções, cor de pele ou identidade da cliente.
3. **Primeiro plano editorial:** monograma `AR`, fios dourados e detalhes de
   moldura documental. Deve permanecer discreto e nunca cobrir o rosto.

As camadas serão preparadas como PNGs transparentes com a mesma proporção-base,
mantendo área de overscan suficiente para que o movimento não revele bordas.
Os arquivos originais permanecerão intactos.

## 4. Ativação e ciclo de vida

O carregamento e o movimento são estados distintos:

- **Fallback inicial:** a fotografia HTML atual permanece renderizada e visível
  no conteúdo sem JavaScript.
- **Pré-aquecimento:** um `IntersectionObserver` começa a importar Three.js e
  carregar as texturas quando a moldura estiver aproximadamente uma viewport
  antes de entrar na tela (`rootMargin` positivo). Nenhum movimento é exibido
  nessa etapa.
- **Ativação visual:** quando pelo menos 10% da moldura estiver visível, o canvas
  pronto substitui progressivamente a fotografia estática por `opacity`. O
  primeiro frame já corresponde à posição atual da rolagem; o efeito não pode
  “começar e terminar” fora da tela.
- **Execução:** o `requestAnimationFrame` roda somente enquanto a moldura estiver
  visível. A posição é atualizada pela rolagem e, no desktop, também pelo
  ponteiro quando ele estiver sobre a moldura.
- **Pausa:** ao sair da viewport, o loop é cancelado. A cena e as texturas
  permanecem prontas para retorno, sem consumo contínuo de CPU/GPU.
- **Retorno:** ao voltar para a seção, a cena retoma a partir do progresso atual
  da rolagem, sem repetir uma entrada teatral.
- **Descarte:** listeners, observers, `ResizeObserver`, RAF, geometrias,
  materiais, texturas e renderer são liberados em `astro:before-swap`.

Estados diagnósticos em `data-parallax-state`:

- `fallback`: foto HTML ativa;
- `loading`: módulo/texturas em carregamento;
- `ready`: cena pronta, ainda fora da viewport;
- `active`: canvas visível e RAF rodando;
- `paused`: cena pronta, fora da viewport;
- `reduced`: movimento reduzido solicitado;
- `unsupported`: WebGL ou inicialização indisponível.

## 5. Movimento desktop

No desktop, a cena combina rolagem e ponteiro:

- o progresso de rolagem varia de `-1` antes do centro da viewport a `+1`
  depois dele, com clamp moderado;
- fundo: deslocamento equivalente a aproximadamente 2–4 px;
- plano editorial: aproximadamente 6–10 px;
- retrato: aproximadamente 10–16 px;
- rotação de câmera mínima, limitada para não deformar o retrato;
- o ponteiro afeta a cena apenas quando estiver sobre a moldura;
- a interpolação deve ser lenta (`lerp` próximo de 0,05–0,065), sem resposta
  brusca.

O rosto deve permanecer integralmente dentro da área segura em todos os
extremos do movimento.

## 6. Movimento mobile

No mobile, a cena usa Three.js, mas somente a rolagem controla o movimento:

- nenhuma leitura de giroscópio ou `DeviceOrientationEvent`;
- nenhuma permissão do sistema;
- nenhum gesto de arrastar ou listener que concorra com a rolagem da página;
- três planos, com amplitudes menores que no desktop;
- fundo: aproximadamente 1–2 px;
- plano editorial: aproximadamente 3–5 px;
- retrato: aproximadamente 5–8 px;
- `devicePixelRatio` limitado a no máximo `1.5`;
- composição própria validada em 390 × 844, preservando rosto e área de
  overscan.

O canvas não altera a altura da seção nem causa mudança de layout durante a
inicialização.

## 7. Three.js e integração Astro

- Instalar `three` como dependência local e importá-lo pelo bundler do Astro.
  Não usar CDN ou `esm.sh` em produção.
- Criar um módulo focado na cena, separado do conteúdo editorial do
  `AboutProfile.astro`.
- Usar `WebGLRenderer` com `alpha: true`, antialiasing condicionado ao perfil do
  dispositivo e pixel ratio limitado.
- Definir `renderer.outputColorSpace = THREE.SRGBColorSpace`.
- Definir `texture.colorSpace = THREE.SRGBColorSpace` em todas as texturas.
- Materiais transparentes usam `depthWrite: false`, `depthTest: false` e
  `renderOrder` explícito.
- As proporções das `PlaneGeometry` são calculadas a partir das dimensões reais
  das imagens.
- `ResizeObserver` atualiza renderer e câmera sem recriar a cena.
- Não adicionar island de framework; o script client-side em `.astro` continua
  intencional.

## 8. Progressive enhancement e acessibilidade

- A fotografia HTML com `alt="Adriana Reis em seu ambiente profissional"`
  permanece no DOM como conteúdo e fallback.
- O canvas é decorativo, recebe `aria-hidden="true"` e não entra na ordem de
  foco.
- Sem JavaScript, sem WebGL ou em erro de textura, a fotografia atual permanece
  visível e a página continua completa.
- Em `prefers-reduced-motion: reduce`, Three.js pode preparar uma composição
  estática, mas não inicia RAF, listeners de movimento ou scroll parallax.
- Nenhum texto essencial é renderizado dentro do canvas.
- A transição entre fallback e canvas respeita movimento reduzido e não produz
  flash de conteúdo.

## 9. Desempenho

- RAF ativo somente enquanto a moldura estiver visível.
- Pixel ratio máximo: `2` no desktop e `1.5` no mobile.
- Três camadas; uma quarta camada exige evidência visual de necessidade.
- Texturas exportadas em dimensões proporcionais ao maior tamanho de exibição,
  sem usar os arquivos originais desnecessariamente grandes.
- Evitar sombras, luzes, pós-processamento, partículas e shaders personalizados;
  `MeshBasicMaterial` é suficiente.
- Importação de Three.js e carregamento das texturas são tardios, próximos à
  entrada da seção.
- O fallback continua visível até o primeiro frame completo.
- Mudanças na rolagem apenas atualizam valores-alvo; a renderização interpolada
  acontece no RAF, sem leituras e escritas de layout intercaladas.

## 10. Relação com o GSAP existente

- GSAP continua responsável pela entrada da copy, moldura e revelação das
  demais subseções.
- O ScrollTrigger que hoje movimenta `[data-about-photo]` será removido para
  impedir dois sistemas disputando o mesmo elemento.
- Three.js assume somente o movimento interno da composição fotográfica.
- O monograma que passar a integrar a cena não deve continuar recebendo
  transformação GSAP paralela.
- Não alterar as animações dos capítulos de atuação ou seus cards.

## 11. Arquivos previstos

- Modify: `package.json` e `pnpm-lock.yaml` — dependência local `three`.
- Modify: `src/components/AboutProfile.astro` — container, fallback, canvas e
  integração do ciclo de vida.
- Create: módulo dedicado à cena em `src/scripts/` ou pasta equivalente já
  adotada no plano de implementação.
- Modify: `src/styles/global.css` — empilhamento, transição e estados.
- Create: três ativos derivados em `src/assets/images/about-parallax/`.
- Modify/Create: testes de conteúdo, estados, movimento reduzido e geometria
  responsiva.
- Modify: `START-HERE.md` após a implementação.

As mudanças não commitadas atualmente existentes em `AboutProfile.astro`,
`global.css` e `tests/desktop-section-layout.test.mjs` pertencem ao ajuste de
layout desktop anterior e devem ser preservadas, não absorvidas silenciosamente
pelo trabalho do parallax.

## 12. Critérios de aceite

1. O efeito começa a ser percebido somente quando a moldura entra na viewport;
   não termina fora da área visível.
2. Desktop combina rolagem e ponteiro local; mobile usa somente rolagem.
3. A profundidade entre fundo, retrato e primeiro plano é perceptível, porém
   discreta.
4. Rosto, roupa e proporções da cliente não são alterados nem recortados nos
   extremos do movimento em 390 px e 1440 px.
5. Não há overflow horizontal, bordas vazias ou flash durante a troca do
   fallback para o canvas.
6. `prefers-reduced-motion` entrega uma composição estática sem RAF contínuo.
7. Sem WebGL/JavaScript, a fotografia HTML e todo o conteúdo permanecem
   disponíveis.
8. O RAF pausa fora da viewport e todos os recursos são descartados na troca de
   página.
9. Cores da fotografia coincidem com o original por configuração sRGB do
   renderer e das texturas.
10. `pnpm test:site`, `pnpm check`, `pnpm build` e `pnpm format:check` passam.
11. Validação visual obrigatória em 390 × 844 e 1440 px.

## 13. Fora de escopo

- Parallax em outras seções da homepage.
- Giroscópio, orientação do dispositivo ou permissões de sensores.
- Interação por arraste no mobile.
- Partículas, iluminação 3D, pós-processamento ou shaders decorativos.
- Alteração da copy, paleta, fontes ou fatos profissionais.
- Retoque ou reconstrução generativa da aparência da cliente.
