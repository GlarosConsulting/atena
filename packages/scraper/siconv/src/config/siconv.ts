interface ISiconvConfig {
  pages: {
    search: {
      url: string;
    };
  };
}

export default {
  pages: {
    search: {
      url:
        'https://voluntarias.plataformamaisbrasil.gov.br/voluntarias/ForwardAction.do?modulo=Principal&path=/MostraPrincipalConsultarConvenio.do&Usr=guest&Pwd=guest',
    },
  },
} as ISiconvConfig;
