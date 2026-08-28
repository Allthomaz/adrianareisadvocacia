export const site = {
  name: "Adriana Reis Advocacia",
  shortName: "Adriana Reis",
  // Placeholder técnico: substituir apenas após a cliente confirmar o domínio.
  url: "https://adriana-reis-advocacia.example",
  defaultTitle: "Adriana Reis Advocacia",
  defaultDescription:
    "Atuação jurídica em Direito Civil, Trabalhista e Previdenciário, com informações institucionais e canal de contato.",
  contact: {
    email: null,
    phone: "+55 11 93353-5801",
    whatsapp: "+55 11 93353-5801",
    location: null,
    oab: null,
  },
} as const;

export const whatsappUrl =
  "https://wa.me/5511933535801?text=Ol%C3%A1%2C%20Adriana.%20Vim%20pelo%20site%20e%20gostaria%20de%20apresentar%20brevemente%20minha%20situa%C3%A7%C3%A3o.";

export const navigation = [
  { label: "Início", href: "/" },
  { label: "Atuação", href: "/atuacao/" },
  { label: "Sobre", href: "/sobre/" },
  { label: "Conteúdos", href: "/conteudos/" },
  { label: "Contato", href: "/contato/" },
] as const;

export const landingNavigation = [
  { label: "Atuação", href: "#atuacao" },
  { label: "Como começar", href: "#como-comecar" },
  { label: "Sobre", href: "#sobre" },
] as const;

export const practiceAreas = [
  {
    number: "01",
    slug: "direito-civil",
    title: "Direito Civil",
    href: "/atuacao/direito-civil/",
    description:
      "Análise de relações privadas quando contratos, cobranças ou prejuízos geram dúvidas sobre direitos e obrigações.",
    introduction:
      "Relações privadas podem envolver obrigações, patrimônio e decisões que precisam ser compreendidas a partir dos documentos e do contexto entre as partes.",
    tone: "ivory",
    examples: [
      {
        title: "Contrato não cumprido",
        description:
          "Quando uma das partes deixa de realizar o que foi acordado, contratos, mensagens e comprovantes ajudam a esclarecer as obrigações assumidas.",
      },
      {
        title: "Cobrança indevida",
        description:
          "Valores desconhecidos, cobranças após pagamento ou exigências divergentes do combinado precisam ser documentados e analisados.",
      },
      {
        title: "Empréstimo não contratado",
        description:
          "Descontos ou créditos que a pessoa não reconhece podem exigir a conferência de extratos, contratos e registros da instituição financeira.",
      },
      {
        title: "Fraude em consignado ou portabilidade",
        description:
          "Uma oferta de redução de parcelas pode esconder uma nova contratação. A operação realizada e o caminho dos valores precisam ser verificados.",
      },
      {
        title: "Inventário e partilha",
        description:
          "A organização dos bens, documentos e pessoas envolvidas é essencial para compreender a sucessão e as possibilidades de partilha.",
      },
      {
        title: "Divórcio consensual",
        description:
          "Quando existe acordo sobre o encerramento da relação, ainda é necessário organizar os efeitos pessoais e patrimoniais da decisão.",
      },
    ],
    status: "confirmed",
  },
  {
    number: "02",
    slug: "direito-trabalhista",
    title: "Direito Trabalhista",
    href: "/atuacao/direito-trabalhista/",
    description:
      "Orientação em questões de jornada, vínculo e encerramento da relação de trabalho, a partir dos fatos e documentos.",
    introduction:
      "A rotina efetivamente vivida, os registros e a forma como a relação terminou ajudam a compreender direitos e deveres no trabalho.",
    tone: "wine",
    examples: [
      {
        title: "Verbas após o desligamento",
        description:
          "Termo de rescisão, comprovantes e datas ajudam a conferir as parcelas relacionadas ao encerramento do contrato de trabalho.",
      },
      {
        title: "Trabalho sem registro",
        description:
          "A ausência de anotação na carteira não encerra a análise. Rotina, pagamentos, mensagens e forma de subordinação podem ser relevantes.",
      },
      {
        title: "Jornada e horas extras",
        description:
          "Horários praticados, controles de ponto e comunicações ajudam a reconstruir a jornada realmente cumprida.",
      },
      {
        title: "Insalubridade ou periculosidade",
        description:
          "As atividades exercidas e as condições do ambiente de trabalho precisam ser avaliadas de acordo com a situação concreta.",
      },
      {
        title: "Doença ou acidente relacionado ao trabalho",
        description:
          "Documentos médicos, comunicações e histórico profissional ajudam a compreender a relação entre o trabalho e o ocorrido.",
      },
      {
        title: "Rescisão indireta",
        description:
          "O encerramento por falta atribuída ao empregador depende da análise cuidadosa dos fatos, da gravidade e das provas disponíveis.",
      },
    ],
    status: "confirmed",
  },
  {
    number: "03",
    slug: "direito-previdenciario",
    title: "Direito Previdenciário",
    href: "/atuacao/direito-previdenciario/",
    description:
      "Avaliação de benefícios e do histórico previdenciário quando uma decisão do INSS ou um pedido exige compreensão.",
    introduction:
      "Dados do histórico contributivo, documentos pessoais e decisões do INSS formam o ponto de partida para avaliar cada situação previdenciária.",
    tone: "sand",
    examples: [
      {
        title: "Benefício negado ou suspenso",
        description:
          "A razão apresentada pelo INSS, o histórico do pedido e os documentos enviados precisam ser lidos em conjunto.",
      },
      {
        title: "Aposentadorias",
        description:
          "Idade, contribuições, atividade profissional e regras aplicáveis ao histórico individual precisam ser conferidas antes do pedido.",
      },
      {
        title: "Benefício por incapacidade",
        description:
          "Documentação médica, atividade exercida e histórico previdenciário ajudam a contextualizar a incapacidade para o trabalho.",
      },
      {
        title: "Pensão por morte",
        description:
          "Vínculo com a pessoa falecida, qualidade de segurado e documentos de dependência fazem parte da avaliação.",
      },
      {
        title: "Revisão de benefício",
        description:
          "Carta de concessão, memória de cálculo e histórico contributivo permitem verificar se existe uma questão que merece análise individual.",
      },
      {
        title: "Planejamento previdenciário",
        description:
          "Organizar o CNIS, períodos de contribuição e documentos com antecedência ajuda a compreender cenários possíveis para a aposentadoria.",
      },
    ],
    status: "confirmed",
  },
] as const;

export type PracticeArea = (typeof practiceAreas)[number];

export const pendingFacts = [
  "OAB e seccional",
  "E-mail e demais canais de contato",
  "Cidade e abrangência do atendimento",
] as const;
