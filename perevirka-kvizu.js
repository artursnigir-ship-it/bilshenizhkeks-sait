// Перевірка перед кожною публікацією сайту на Netlify.
// Якщо квіз втратив зв'язок із Google Формою заявок, публікація зупиняється,
// а на сайті лишається попередня робоча версія.
const fs = require("fs");
const path = require("path");

const FORM_ID = "1FAIpQLSfQMftI8-FNvEvhPXf8xormyMhWvA32un9bIvfNRKBozPXgzQ";
const POLYA = [
  "entry.1040253570", "entry.1105663941", "entry.1178902668",
  "entry.1382808586", "entry.1415146284", "entry.1428473894",
  "entry.1469003013", "entry.2028405576", "entry.619929684",
];

const pomylky = [];
const kviz = path.join(__dirname, "site", "kviz", "index.html");
const holovna = path.join(__dirname, "site", "index.html");

if (!fs.existsSync(holovna)) pomylky.push("немає головної сторінки site/index.html");
if (!fs.existsSync(kviz)) {
  pomylky.push("немає квізу site/kviz/index.html");
} else {
  const t = fs.readFileSync(kviz, "utf8");
  if (!t.includes(FORM_ID)) pomylky.push("у квізі змінено або видалено адресу Google Форми заявок");
  for (const p of POLYA) if (!t.includes(p)) pomylky.push("у квізі зникло поле форми " + p);
}
if (fs.existsSync(holovna) && !fs.readFileSync(holovna, "utf8").includes("kviz")) {
  pomylky.push("на головній сторінці немає жодного посилання на квіз");
}

if (pomylky.length) {
  console.error("ПУБЛІКАЦІЮ ЗУПИНЕНО. Квіз заявок може не працювати:");
  for (const p of pomylky) console.error(" - " + p);
  console.error("Поверніть зміни у квізі або напишіть керуючому.");
  process.exit(1);
}
console.log("Перевірка квізу пройдена: форма заявок і всі 9 полів на місці.");
