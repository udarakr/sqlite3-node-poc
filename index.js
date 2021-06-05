console.log("Starting sqlite3 poc!");

const sqlite3 = require("sqlite3").verbose();

let recArray = [];
let db = new sqlite3.Database(
  "/Users/udara/dev/playground/db/rec-list/dev.db",
  sqlite3.OPEN_READONLY,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the dev database.");
  }
);

db.serialize(() => {
  //select MessageHistory from history limit 100000
  db.each(`select MessageHistory from history`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    const history = JSON.parse(row.MessageHistory);
    if (history && history.recordsAttachmentHistory) {
      history.recordsAttachmentHistory.forEach((historyEle) => {
        const records = historyEle.records;
        if (records.length > 0) {
          records.forEach((element) => {
            console.log(element.recordTypeName);
            //recArray.indexOf(element.recordTypeName) === -1 ? recArray.push(element.recordTypeName) : console.log( element.recordTypeName + " already exists");
            recArray.push(element.recordTypeName);
          });
        }
      });
    }
  });
});

db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  const map = recArray.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());

  console.log(map.entries());
  console.log("Close the database connection.");
});
