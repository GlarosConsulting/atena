import 'dotenv/config';

interface ISiconvConfig {
  timezone: string;

  pages: {
    search: {
      url: string;
    };
  };
}

export default {
  timezone: process.env.SICONV_TIMEZONE || 'America/Sao_Paulo',

  pages: {
    search: {
      url: process.env.SICONV_SEARCH_PAGE_URL,
    },
  },
} as ISiconvConfig;
