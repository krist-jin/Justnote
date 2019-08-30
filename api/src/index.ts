import express from 'express';
import middlewareConfig from './config/middleware';
import apiRoutes from './modules';
import './config/database';

const app = express();
const PORT: number = parseInt(process.env.PORT as string) || 3000;

middlewareConfig(app);
// TODO: TEST
app.get('/', (req, res) => {
  res.send('Hello world!');
});
apiRoutes(app);

app.listen(PORT, (err: any) => {
    if (err) {
        throw err;
    } else {
        console.log(`
          Server running on port: ${process.env.PORT}
          MongoDB url: ${process.env.MONGO_URL}
          ---
          Running on ${process.env.NODE_ENV}
          ---
          Make something great!!!
        `);
      }
})
