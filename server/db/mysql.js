const Sequalize = require("sequalize");
const sequalize = new Sequalize("chat", "root", "Sifra123$", {
  host: "localhost",
  dialect: "mysql",
});
sequalize
  .authenticate()
  .then(() => console.log("Connected to db"))
  .catch((error) => console.log("Unable to connect"));
