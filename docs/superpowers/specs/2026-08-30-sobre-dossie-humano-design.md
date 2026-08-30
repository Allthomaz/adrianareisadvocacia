# Página Sobre — Dossiê Humano

**Status:** direção aprovada em 30 de agosto de 2026  
**Escopo:** página `/sobre/`, resumo institucional da homepage e identificação
profissional compartilhada  
**Referências:** `START-HERE.md`, `docs/spec-site.md`,
`docs/astro-cloudflare-boas-praticas.md`, `docs/brand-assets.md` e respostas
fornecidas por Adriana Rodrigues Reis de Andrade

## 1. Objetivo

Transformar a página Sobre, hoje estrutural, em um perfil institucional autoral
que apresente Adriana por meio de sua forma concreta de trabalhar: compreender
o caso por inteiro, examinar fatos e documentos com critério e somente então
delimitar uma estratégia jurídica.

A página deve aumentar confiança sem recorrer a autoengrandecimento, promessa
de resultado, prova social ou alegação de especialização. A persuasão nasce da
especificidade do método, da identificação profissional verificável e da
presença humana da fotografia.

## 2. Fatos autorizados

- Nome completo: Adriana Rodrigues Reis de Andrade.
- Nome de marca e comunicação: Adriana Reis Advocacia / Adriana Reis.
- Inscrição profissional: OAB/SP nº 533.644.
- Bacharel em Direito pela Universidade Nove de Julho — UNINOVE.
- Pós-graduada em Direito Civil e Processual Civil pela Legale Educacional.
- Cursos de qualificação em Direito e Processo do Trabalho e em Direito
  Previdenciário.
- Atuação profissional em São Roque e região.
- Atendimento presencial e online.
- Possibilidade de acompanhar demandas em outras localidades quando a natureza
  do caso permitir.
- Autorização para uso da fotografia atual na seção Sobre.

Não publicar ano de início da trajetória. Não converter cursos de qualificação
em pós-graduações, títulos ou especialidades. Não usar `especialista`,
`especializada`, promessa de resultado ou qualquer superlativo profissional.

## 3. Estratégia editorial

### 3.1 Princípio de persuasão

A página aplica a equação de Julian Shapiro:

`Desejo − (esforço + confusão)`

- **Desejo:** ser ouvido, compreender as possibilidades e perceber que a
  situação será examinada com diligência.
- **Esforço:** blocos curtos, hierarquia evidente e uma ideia principal por
  seção.
- **Confusão:** explicar como o atendimento se desenvolve e oferecer um próximo
  passo inequívoco.

Não aplicar ao contexto jurídico prova social, FOMO, urgência, escassez,
comparações, casos vencidos, números de clientes ou depoimentos.

### 3.2 Voz

A voz será criteriosa, estratégica e humana. O português pode se aproximar do
registro próprio da advocacia, com palavras como `diligência`, `circunstâncias`,
`repercussões`, `delimitar` e `condução`, desde que o próprio período esclareça
seu sentido.

Regras de redação:

- preferir precisão a solenidade vazia;
- combinar um termo jurídico ou culto com uma consequência concreta;
- alternar períodos densos com frases curtas;
- evitar latinismos, arcaísmos e encadeamentos excessivos;
- demonstrar atributos pelo método, sem apenas declará-los;
- usar `possibilidades`, `riscos`, `alternativas` e `análise individual`, nunca
  certeza ou garantia de desfecho.

## 4. Conceito visual

### Dossiê humano

A página terá a cadência de um perfil editorial: fotografia autêntica,
tipografia em grande escala, linhas finas, numeração discreta e amplo espaço
negativo. O termo “dossiê” descreve profundidade e organização; não deve gerar
pastas, carimbos, papéis processuais ou outros elementos literais.

O momento memorável será a abertura em camadas: texto estável, fotografia
vertical em movimento sutil e monograma `AR` quase transparente em velocidade
distinta. A profundidade deve ser percebida, não exibida como efeito.

### Sistema existente

- Display: Bodoni Moda Variable.
- Corpo e interface: Manrope Variable.
- Fundo predominante: marfim `#F7F2E9` e `#F4EBDD`.
- Ênfase: vinho `#762638` e `#5F1C2C`.
- Detalhes: dourado queimado `#B78A55`.
- Texto: grafite `#282422`.
- Bordas retas, sem cartões arredondados.
- Textura apenas atmosférica e de baixa opacidade; não criar ruído que afete
  contraste ou compressão visual.

Não introduzir novas fontes, nova paleta, dark mode ou biblioteca de interface.

## 5. Fotografia

Fonte original:
`assets/references/foto-adriana-atual.jpeg`.

A imagem é vertical, possui contexto profissional real e deve aparecer sem
remoção de fundo. O ambiente, os livros e a iluminação quente integram a
narrativa visual.

Regras:

- preservar o original em `assets/references/`;
- criar uma cópia de trabalho em `src/assets/images/` para processamento pelo
  Astro;
- não retocar rosto, cabelo, corpo, roupa, pele, joias ou cenário;
- não aplicar geração de imagem, reconstrução ou expansão de fundo;
- usar `astro:assets` com AVIF e WebP responsivos;
- manter o rosto dentro da área segura em todas as proporções;
- texto alternativo factual: `Adriana Reis em seu ambiente profissional`.

Na abertura, a fotografia será candidata a LCP: carregamento imediato,
prioridade alta, dimensões declaradas e espaço reservado para evitar CLS.

## 6. Arquitetura da página

### 6.1 Abertura — compreender antes de definir

Composição desktop em duas colunas assimétricas, com conteúdo à esquerda e
fotografia à direita. No mobile, texto antes da imagem.

**Eyebrow**

`Sobre Adriana Reis`

**Identificação profissional**

`Adriana Rodrigues Reis de Andrade · OAB/SP nº 533.644`

**H1**

`Compreender o caso por inteiro precede a definição da estratégia jurídica.`

**Apoio**

`A atuação de Adriana começa pela escuta, avança pelo exame criterioso dos fatos
e documentos e considera os riscos, as alternativas e as repercussões de cada
caminho.`

A palavra `precede` eleva o registro sem obscurecer a mensagem; o apoio explica
imediatamente o que essa precedência significa.

### 6.2 Origem — uma inclinação transformada em ofício

**Título**

`Investigar, questionar e compreender.`

**Texto-base**

`Uma inclinação natural para compreender o que existe por trás de cada situação
conduziu Adriana ao Direito. Na advocacia, encontrou um ofício em que
conhecimento, estratégia e responsabilidade podem ser colocados a serviço de
pessoas que, diante de uma controvérsia, nem sempre sabem por onde começar.`

O trecho comunica motivação sem construir uma narrativa biográfica não
fornecida.

### 6.3 Método — três movimentos

Os princípios aparecem como blocos editoriais numerados, separados por linhas,
nunca como três cartões genéricos.

#### 01 — Escutar antes de concluir

`O primeiro atendimento começa pela narrativa da pessoa. Perguntas ajudam a
organizar juridicamente os fatos e a identificar circunstâncias que precisam
ser aprofundadas antes de qualquer conclusão.`

#### 02 — Examinar o conjunto, não apenas o episódio

`Documentos, registros e detalhes aparentemente menores podem alterar a leitura
do caso. Por isso, a análise procura relacionar os fatos às suas consequências
jurídicas, em vez de se contentar com uma resposta imediata.`

#### 03 — Orientar sem antecipar certezas

`Depois de compreender o contexto, Adriana apresenta possibilidades, riscos e
alternativas em linguagem acessível. Quando a matéria exige estudo adicional,
a conclusão aguarda o exame diligente dos elementos disponíveis.`

### 6.4 Frase autoral

Faixa vinho de grande presença tipográfica:

> “Primeiro eu preciso entender o seu caso por inteiro. Depois, nós decidimos
> qual é o melhor caminho.”

A citação permanece literal, sem transformar `melhor caminho` em promessa de
melhor resultado.

### 6.5 Formação e identificação

**Título**

`Formação e exercício profissional.`

**Texto-base**

`Adriana Rodrigues Reis de Andrade é advogada inscrita na OAB/SP sob o nº
533.644. É bacharel em Direito pela Universidade Nove de Julho — UNINOVE e
pós-graduada em Direito Civil e Processual Civil pela Legale Educacional.
Também concluiu cursos de qualificação em Direito e Processo do Trabalho e em
Direito Previdenciário.`

A formação deve ser apresentada em texto e em uma lista de leitura rápida, sem
selos ou ícones de premiação.

### 6.6 Atendimento

**Título**

`Presença em São Roque. Atendimento também à distância.`

**Texto-base**

`Adriana atua profissionalmente em São Roque e região, com atendimentos
presenciais e online. Demandas em outras localidades podem ser acompanhadas
quando a natureza do caso o permitir.`

Não publicar endereço, horário ou abrangência mais específica enquanto esses
dados não forem confirmados.

### 6.7 Encerramento

**Título**

`Cada situação começa por uma história que precisa ser compreendida.`

**Apoio**

`O primeiro contato permite apresentar o contexto e identificar quais
informações e documentos serão necessários para a análise inicial.`

**CTA**

`Apresente sua situação`

O CTA leva ao WhatsApp centralizado em `src/data/site.ts` e abre em nova aba com
o comportamento já adotado no site.

## 7. Resumo institucional da homepage

O bloco atual será mantido em sua estrutura, mas receberá copy coerente com a
página completa.

**Título**

`Antes da estratégia, vem a compreensão do caso.`

**Texto**

`Adriana Reis conduz cada atendimento a partir da escuta, do exame dos
documentos e das circunstâncias próprias da situação. Somente depois dessa
compreensão são delimitados os possíveis caminhos jurídicos.`

**CTA**

`Conheça Adriana`

O CTA deve levar a `/sobre/`. O WhatsApp permanece no CTA final da homepage,
evitando que todos os blocos disputem a mesma conversão.

## 8. Dados compartilhados

`src/data/site.ts` será a única fonte para:

- nome completo;
- OAB e seccional;
- cidade e região;
- modalidades presencial e online;
- formação e qualificações factuais.

O rodapé exibirá a identificação profissional e `São Roque e região`, sem
inventar endereço ou e-mail. A marca continuará sendo `Adriana Reis Advocacia`.

As pendências correspondentes devem ser removidas de `pendingFacts` e de
`START-HERE.md`. Permanecem pendentes e-mail, demais canais, endereço exato e
domínio definitivo.

## 9. Movimento

### 9.1 Abertura

Uma timeline curta coordena eyebrow, identificação, H1, apoio e fotografia. Os
elementos entram por `autoAlpha` e pequeno deslocamento em `y`, com o retrato
começando depois do texto principal. Não haverá animação por caractere.

### 9.2 Parallax

- Desktop: deslocamento total da fotografia entre 20 e 24 px.
- Desktop: monograma `AR` deslocado entre 8 e 12 px na direção oposta.
- Mobile: somente a fotografia, com deslocamento máximo de 8 px.
- Usar um único ScrollTrigger para a composição da abertura.
- Usar `scrub` numérico moderado e `ease: "none"` no movimento ligado à
  rolagem.
- Não aplicar pinning, smooth scroll ou parallax a textos de leitura.

### 9.3 Seções

Os três movimentos recebem revelações discretas e executadas uma vez. A linha
dourada pode surgir por `scaleX`; título e parágrafo entram por `autoAlpha` e
`y`. A faixa de citação recebe apenas uma entrada de conjunto.

Todo conteúdo estará visível no HTML e no CSS base. JavaScript apenas aprimora
a experiência. `prefers-reduced-motion` remove parallax e revelações, mostrando
imediatamente o estado final.

## 10. Performance mobile

- Sem islands ou framework de UI.
- Reutilizar GSAP e ScrollTrigger já instalados.
- Animar exclusivamente `transform` e `opacity`/`autoAlpha`.
- Aplicar `will-change` somente durante a animação e removê-lo ao concluir.
- Separar desktop, mobile e movimento reduzido com `gsap.matchMedia()`.
- Criar os ScrollTriggers na ordem visual da página.
- Não executar leituras de layout durante cada quadro.
- Não animar blur, sombra, `clip-path`, largura, altura, `top` ou `left`.
- Não criar loops, animações ociosas ou listeners de ponteiro.
- Limpar timelines e triggers em `astro:before-swap` com `revert()`.
- Testar em 390 px sem redimensionar a viewport durante o parallax.

## 11. Responsividade e acessibilidade

- Mobile-first, com composição própria em 390 px.
- Um único `h1` na página.
- Ordem mobile: identificação, H1, apoio, fotografia, narrativa, método,
  citação, formação, atendimento e CTA.
- Fotografia sem texto sobre o rosto ou sobre áreas de contraste instável.
- Alvos interativos com pelo menos 44 × 44 px.
- Foco visível e contraste WCAG 2.2 AA.
- Citação marcada semanticamente com `blockquote`.
- Formação em lista semântica e método em seções com headings hierárquicos.
- Conteúdo completo e acionável sem JavaScript.

## 12. Arquitetura de implementação

A página `/sobre/` deixa de usar `PageIntro` e passa a compor componentes Astro
específicos e estáticos. Os limites previstos são:

- abertura e fotografia;
- narrativa e método;
- citação autoral;
- credenciais e atendimento;
- CTA final.

Componentes podem permanecer no próprio arquivo enquanto forem curtos. Extrair
somente blocos com responsabilidade visual ou script próprio; não criar uma
abstração para cada seção.

Os estilos permanecem em `src/styles/global.css`, seguindo a organização atual.
O script GSAP fica no componente da abertura ou da página Sobre, sem criar
island.

## 13. Verificação e aceite

- `pnpm check` e `pnpm build` passam sem erros.
- Página validada visualmente em 390 px e 1440 px.
- Sem overflow horizontal.
- Sem console errors.
- Conteúdo permanece legível com JavaScript desativado.
- `prefers-reduced-motion` elimina movimento não essencial.
- Parallax não causa recorte do rosto nem expõe área vazia no frame.
- Fotografia não causa CLS.
- OAB, nome, formação e localidade são lidos de `src/data/site.ts`.
- Não aparecem `especialista`, `especializada`, promessa de resultado,
  depoimentos ou alegações não fornecidas.
- O CTA utiliza a URL centralizada do WhatsApp.
- A copy mantém registro culto sem comprometer a compreensão.

