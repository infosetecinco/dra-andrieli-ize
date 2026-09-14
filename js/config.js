/**
 * CONFIGURAÇÃO CENTRAL DO SITE — Dra. Andrieli Ize
 *
 * Este é o ÚNICO arquivo que precisa ser editado para trocar textos,
 * contatos, fotos e dados institucionais.
 *
 * Convenção de status:
 *  - Campos com valor preenchido são exibidos.
 *  - Campos vazios ("" / [] / null) são OCULTADOS automaticamente na página.
 *  - Comentários "PENDENTE" marcam dados que ainda não foram confirmados
 *    pela profissional / clínica. Não invente valores para eles.
 *
 * @typedef {{ id: string, name: string, description: string, alias?: string }} Procedure
 * @typedef {{ question: string, answer: string }} FaqItem
 * @typedef {{ text: string, author: string, date?: string, source?: string, url?: string }} Review
 * @typedef {{ src: string, alt: string, width: number, height: number }} SiteImage
 */

export const SITE_CONFIG = Object.freeze({
  /* ───────────────── IDENTIDADE ───────────────── */
  brand: {
    name: "Dra. Andrieli Ize",
    clinic: "Clínica Renove",
    city: "Primavera do Leste",
    state: "MT",
    /** Título e descrição usados nas metatags (index.html replica os valores). */
    seoTitle: "Dra. Andrieli Ize | Estética em Primavera do Leste — MT",
    seoDescription:
      "Conheça os procedimentos e o atendimento da Dra. Andrieli Ize na Clínica Renove, em Primavera do Leste — MT. Consulte horários pelo WhatsApp.",
  },

  /* ───────────────── DADOS PROFISSIONAIS ───────────────── */
  professional: {
    /** PENDENTE — formação confirmada (ex.: "Biomédica"). Vazio = bloco oculto. */
    education: "Biomédica · Medicina em formação",
    /** PENDENTE — conselho e registro (ex.: "CRBM-1 00000"). Vazio = oculto. */
    registration: "",
    /** PENDENTE — áreas de atuação verificadas. Lista vazia = oculto. */
    areas: [],
  },

  /* ───────────────── CONTATO ───────────────── */
  contact: {
    /**
     * PENDENTE (ESSENCIAL PARA PUBLICAÇÃO).
     * Somente dígitos, com país e DDD. Ex.: "5566999999999".
     * Enquanto vazio, todos os CTAs ficam sinalizados como indisponíveis.
     */
    whatsappNumber: "5566992478972",
    /** PENDENTE — telefone fixo para exibição (opcional). */
    phoneDisplay: "+55 66 99247-8972",
    /** PENDENTE — URL completa do perfil. Ex.: "https://instagram.com/usuario". */
    instagramUrl: "https://www.instagram.com/dra.andrieliize/",
    /** Nome exibido para o link do Instagram, ex.: "@usuario". */
    instagramHandle: "@dra.andrieliize",
  },

  /* ───────────────── LOCALIZAÇÃO ───────────────── */
  location: {
    /** PENDENTE — endereço completo confirmado (rua, número, bairro). */
    addressLine: "R. Maringá, 920 - Jardim Riva",
    /** PENDENTE — complemento / sala (opcional). */
    addressComplement: "CEP 78850-000",
    /** PENDENTE — lista de linhas de horário. Ex.: ["Seg. a sex., 8h às 18h"]. */
    hours: [],
    /** PENDENTE — link "Abrir rota" do Google Maps da Clínica Renove. */
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=R.%20Maring%C3%A1%2C%20920%20-%20Jardim%20Riva%2C%20Primavera%20do%20Leste%20-%20MT%2C%2078850-000",
    /** PENDENTE — URL de incorporação (embed) do Google Maps. Só use a da clínica. */
    mapsEmbedUrl: "https://maps.google.com/maps?q=R.%20Maring%C3%A1%2C%20920%20-%20Jardim%20Riva%2C%20Primavera%20do%20Leste%20-%20MT%2C%2078850-000&z=16&output=embed",
    /** PENDENTE — informações reais de acesso (opcional). Ex.: ["Entrada pela rua X"]. */
    accessNotes: [],
  },

  /* Avaliações: publicar somente textos verificados e autorizados. */
  reviews: {
    /** PENDENTE — link do perfil correto no Google (da profissional). */
    googleUrl: "",
    /** PENDENTE — a quem pertence o perfil: "professional" | "clinic". */
    profileOwner: "",
    /** @type {Review[]} PENDENTE — apenas avaliações reais e autorizadas. */
    items: [],
  },

  /* ───────────────── DIFERENCIAIS ───────────────── */
  flags: {
    /**
     * PENDENTE — só mude para true com confirmação expressa da clínica.
     * Exibe a frase "Não utilizamos PMMA nos procedimentos realizados na clínica."
     */
    pmmaStatementConfirmed: true,
    /** PENDENTE — só mude para true se a marca confirmar o uso de "Dra. Bumbum". */
    showBumbumAlias: true,
  },

  /* ───────────────── IMAGENS ─────────────────
   * Deixe `src` vazio para usar o placeholder editorial abstrato.
   * Quando houver foto real: informe caminho, alt descritivo e dimensões
   * (largura/altura em px) para evitar saltos de layout.
   * @type {{ hero: SiteImage, about: SiteImage, procedures: Record<string, SiteImage> }}
   */
  images: {
    /** PENDENTE — retrato real da profissional (vertical, ~4:5). */
    /* Recorte 4:5 de foto do Instagram em alta resolução (2748 px). Originais em assets/instagram/. */
    hero: { src: "assets/retrato-dra-andrieli.jpg", alt: "Retrato da Dra. Andrieli Ize na clínica", width: 1200, height: 1500 },
    /** PENDENTE — foto de atendimento / conversa de avaliação (~4:5). */
    /* Interior da Clínica Renove (Instagram, 1440 px). Outras opções em assets/instagram/. */
    about: { src: "assets/clinica-interior.jpg", alt: "Ambiente interno da clínica, com a Dra. Andrieli Ize ao fundo", width: 1200, height: 1500 },
    /** Opcional — imagem por procedimento, chave = id do procedimento (~16:10). */
    procedures: {},
  },

  /* ───────────────── PROCEDIMENTOS ─────────────────
   * Catálogo informado no briefing, sujeito à validação da profissional.
   * @type {Procedure[]}
   */
  procedures: [
    {
      id: "harmonizacao-de-gluteos",
      name: "Harmonização de glúteos",
      description:
        "Avaliação individual para conversar sobre seus objetivos e conhecer as possibilidades e os cuidados do procedimento.",
      alias: "Dra. Bumbum",
    },
    {
      id: "botox-facial",
      name: "Botox facial",
      description: "Entenda o procedimento, suas limitações e os cuidados envolvidos antes de decidir.",
    },
    {
      id: "preenchimento-labial",
      name: "Preenchimento labial",
      description: "Converse sobre proporção, contorno e suas preferências em uma avaliação individual.",
    },
    {
      id: "preenchimento-de-olheiras",
      name: "Preenchimento de olheiras",
      description:
        "Uma avaliação para entender a região e discutir se esse procedimento pode ser considerado para o seu caso.",
    },
    {
      id: "bioestimuladores-de-colageno",
      name: "Bioestimuladores de colágeno",
      description: "Conheça as opções disponíveis e converse sobre a indicação e o planejamento do atendimento.",
    },
    {
      id: "laser-lavieen",
      name: "Laser Lavieen",
      description:
        "Saiba mais sobre a tecnologia e os cuidados que precisam ser avaliados antes e depois da sessão.",
    },
    {
      id: "fios-de-pdo",
      name: "Fios de PDO",
      description: "Informações sobre o procedimento, as possibilidades para cada caso e os cuidados envolvidos.",
    },
    {
      id: "peim",
      name: "PEIM",
      description: "Tire suas dúvidas sobre o procedimento, sua indicação e as etapas do atendimento.",
    },
    {
      id: "ozonioterapia",
      name: "Ozonioterapia",
      description:
        "Consulte a disponibilidade e receba esclarecimentos da profissional antes de considerar o procedimento.",
    },
  ],

  /* ───────────────── FAQ ─────────────────
   * @type {FaqItem[]}
   */
  faq: [
    {
      question: "Preciso escolher um procedimento antes de entrar em contato?",
      answer:
        "Não. Você pode contar à equipe o que deseja cuidar e consultar os horários para uma avaliação. A indicação de um procedimento depende da análise individual.",
    },
    {
      question: "Como funciona a avaliação?",
      answer:
        "É o momento de conversar sobre suas expectativas, esclarecer dúvidas e entender quais possibilidades podem ser consideradas, incluindo limitações e cuidados.",
    },
    {
      question: "Como posso consultar os valores?",
      answer:
        "Entre em contato pelo WhatsApp para consultar o valor da avaliação e receber informações sobre os procedimentos. O planejamento pode variar conforme cada caso.",
    },
    {
      question: "Quantas sessões serão necessárias?",
      answer:
        "A quantidade depende do procedimento e da avaliação individual. Uma estimativa poderá ser discutida durante o atendimento e ajustada conforme o acompanhamento.",
    },
    {
      question: "Os resultados são iguais para todas as pessoas?",
      answer:
        "Não. As características individuais e outros fatores podem influenciar a resposta. As possibilidades e limitações devem ser discutidas durante a avaliação.",
    },
    {
      question: "Receberei orientações antes e depois?",
      answer:
        "As orientações dependem do procedimento indicado. A equipe esclarecerá os cuidados necessários para cada etapa do atendimento.",
    },
    {
      question: "Como faço para agendar?",
      answer:
        "Clique no botão do WhatsApp e solicite os horários disponíveis. O agendamento será confirmado pela equipe durante a conversa.",
    },
  ],

  /* ───────────────── MENSAGENS DO WHATSAPP ───────────────── */
  messages: {
    general:
      "Olá! Conheci o atendimento da Dra. Andrieli Ize pelo site e gostaria de consultar os horários para uma avaliação.",
    /** `{procedimento}` é substituído pelo nome do procedimento. */
    procedure:
      "Olá! Conheci o site da Dra. Andrieli Ize e gostaria de tirar dúvidas sobre {procedimento} e consultar os horários para uma avaliação.",
    faq: "Olá! Acessei o site da Dra. Andrieli Ize e gostaria de esclarecer uma dúvida antes de agendar.",
  },

  /* ───────────────── PÁGINAS INSTITUCIONAIS ───────────────── */
  legal: {
    /** PENDENTE — caminho da Política de Privacidade revisada. Vazio = link oculto. */
    privacyPolicyUrl: "",
  },
});
