const devConfig = {
  MONGO_URL: 'mongodb://localhost/justnote-dev',
  JWT_SECRET: 'thisisasecret',
};

const testConfig = {
  MONGO_URL: 'mongodb://localhost/justnote-test',
};

const prodConfig = {
  MONGO_URL: 'mongodb://localhost/justnote-prod',
};

const defaultConfig = {
  PORT: process.env.PORT || 3000,
};

function envConfig(env: any) {
  switch (env) {
    case 'development':
      return devConfig;
    case 'test':
      return testConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
};