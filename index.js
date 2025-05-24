const gptServer = require("./src/app.js");
//const { sfgroup_seq } = require("./src/sfgroup_db.js");
//const { sthemma_seq } = require("./src/sthemma_db.js");
const serverPort = process.env.PORT || 3000;

// Syncing all the models at once.
// conn.sync({ force: true }).then( async() => {

// console.log(`starting callisto server now...`);
//console.log(`sync models now...`);

//sfgroup_seq.sync({ alter: true })
  //.then(gbarco_seq.sync({ alter: true }))
  //.then(sthemma_seq.sync({ alter: true }))
  //.then(async () => {
    gptServer.listen(serverPort,"0.0.0.0", () => {
      console.log(`gpt server running at ${serverPort}`); // eslint-disable-line no-console
    });
  //});