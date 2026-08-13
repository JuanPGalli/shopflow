const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const { PORT } = process.env;

conn.sync({ alter: true }).then(() => {
  server.listen(PORT, () => {
    console.log('Port listening at', PORT);
  });
});