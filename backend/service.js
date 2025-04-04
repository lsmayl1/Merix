const Service = require("node-windows").Service;

const svc = new Service({
  name: "ERP-POS",
  description:
    "Bu servis, Node.js uygulamamı Windows hizmeti olarak çalıştırır.",
  script: "C:\\erp_pos\\backend\\index.js",
  workingDirectory: "C:\\erp_pos\\backend", // Çalışma dizini eklendi
});

svc.on("install", () => {
  svc.start();
  console.log("Servis kuruldu ve başlatıldı");
});

svc.on("error", (err) => {
  console.log("Hata:", err); // Hata mesajlarını yakala
});

svc.on("start", () => {
  console.log("Servis başladı");
});

svc.on("stop", () => {
  console.log("Servis durdu");
});

svc.install();
