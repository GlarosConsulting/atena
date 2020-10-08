interface IAuthenticationConfig {
  jwt: {
    accessTokenSecret: string;
    refreshTokenSecret: string;
    expiresIn: string;
  };
}

export default {
  jwt: {
    accessTokenSecret:
      process.env.ACCESS_TOKEN_SECRET || 'access_token_secret_default',
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || 'refresh_token_secret_default',
    expiresIn: '1d',
  },
} as IAuthenticationConfig;
