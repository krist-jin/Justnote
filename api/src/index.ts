import express from 'express';
import constants from './config/constants';
import middlewareConfig from './config/middleware';
import apiRoutes from './modules';

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
          Server running on port: ${constants.PORT}
          ---
          Running on ${process.env.NODE_ENV}
          ---
          Make something great!!!
        `);
      }
})
