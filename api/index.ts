import express from 'express';

const app = express();
const PORT: number = parseInt(process.env.PORT as string) || 3000;
app.listen(PORT, (err: any) => {
    if (err) {
        throw err;
    } else {
        console.log(`
          Server running on port: ${PORT}
          ---
          Running on ${process.env.NODE_ENV}
          ---
          Make something great
        `);
      }
})