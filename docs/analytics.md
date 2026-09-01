# Analytics Architecture

**Atualizado em:** 2026-09-01

Esta camada é independente de SEO, GEO, `llms.txt` e WebMCP. Nenhuma integração
transforma o site em SPA ou participa da renderização do conteúdo principal.

## Vercel Web Analytics

Finalidade: visitas, origens, páginas, país aproximado, navegador, sistema e
tipo de dispositivo. A integração oficial `@vercel/analytics/astro` está no
layout global.

Segundo a documentação da Vercel, o produto não usa cookies de terceiros,
trabalha com dados agregados e descarta o identificador derivado da requisição
após 24 horas. O terceiro envolvido é a Vercel. O responsável pelo site ainda
deve registrar finalidade, base legal, transparência e direitos aplicáveis na
documentação de privacidade definitiva.

Custom Events exigem plano Vercel Pro ou Enterprise. O código pode enviar o
evento, mas a recepção no dashboard depende de Web Analytics habilitado e de um
plano compatível.

## Vercel Speed Insights

Finalidade: métricas reais de experiência e Core Web Vitals por dispositivo e
página. A integração usa `@vercel/speed-insights/astro` e APIs nativas do
navegador. Não contém conteúdo jurídico ou dados digitados. O terceiro é a
Vercel; disponibilidade, retenção e custos dependem do plano do projeto.

## Microsoft Clarity

**Status: CONSENT IMPLEMENTATION REQUIRED.** Clarity não é carregado nesta
entrega.

A ativação futura requer:

1. projeto real e variável pública `PUBLIC_CLARITY_PROJECT_ID` na Vercel;
2. política de privacidade definitiva e análise LGPD;
3. decisão documentada de consentimento/CMP;
4. Consent Mode com `consentv2` quando aplicável;
5. masking em modo Strict ou configuração equivalente validada antes do deploy.

O Clarity normalmente usa cookies próprios e de terceiros com identificadores
pseudônimos para unir sessões. Ele registra renderização, cliques, scroll e
movimento. Inputs e selects são mascarados por padrão, mas qualquer formulário
futuro com nome, telefone, CPF, benefício, processo ou situação jurídica deve
ser explicitamente mascarado e excluído antes de chegar à produção.

Não serão enviados IDs personalizados, telefone, conteúdo de mensagens,
fingerprinting adicional ou parâmetros sensíveis. DNT/GPC não recebe lógica
customizada sem suporte oficial e decisão jurídica específica.

## Events

### `whatsapp_click`

Usuário clicou explicitamente em um link real para iniciar contato pelo
WhatsApp.

Propriedades:

- `placement`;
- `label`.

O listener não usa `preventDefault`; falha do analytics não bloqueia o link.
Consultar contato por WebMCP não dispara conversão.

### `cta_click`

Reservado no contrato TypeScript para CTA rastreado que não seja WhatsApp.
Nenhum CTA recebe esse evento nesta entrega, pois não foi encontrado um caso
necessário que não duplicasse a conversão principal.

## Google Search Console Setup

Não existe biblioteca ou script do Search Console. A configuração é externa:

1. criar propriedade do tipo **Domain** para `dradrireisadvocacia.com.br`;
2. copiar o TXT fornecido pelo Google;
3. adicionar o TXT no DNS gerenciado pela Hostinger, sem inventar o valor;
4. após a verificação, enviar
   `https://www.dradrireisadvocacia.com.br/sitemap-index.xml`.

Canonical, robots, sitemap e indexabilidade já estão preparados.

## Privacy

Eventos próprios proíbem nome, telefone, mensagem, URL completa, IP, user agent
manual e qualquer dado sobre o problema jurídico. A política de privacidade
atual permanece provisória e `noindex`; ela precisa de revisão editorial e
jurídica antes da ativação do Clarity.

## Production Verification

Após aprovação e deploy futuro:

- habilitar Web Analytics e Speed Insights no dashboard Vercel;
- confirmar requests first-party de pageview, evento e vitals na aba Network;
- clicar uma vez em cada placement e verificar que o WhatsApp abre normalmente;
- confirmar `whatsapp_click` no painel somente se o plano aceitar custom events;
- não afirmar coleta do Clarity enquanto consentimento, variável e projeto não
  estiverem configurados;
- configurar o Search Console e enviar o sitemap nativo;
- validar a imagem social no Facebook Sharing Debugger, LinkedIn Post Inspector,
  compatibilidade de card do X e um compartilhamento novo no WhatsApp. Esses
  consumidores podem manter cache da URL.
