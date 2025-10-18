export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/david_clientes',
  jwtSecret: process.env.JWT_SECRET ?? 'super-secret'
});
