const server = require('./src/app.js');
const { conn } = require('./src/db.js');
const PORT = process.env.PORT || 3001;

conn.sync({ alter: true }).then(() => {
  server.listen(PORT, () => {
    console.log('Port listening at', PORT);
  });
});
