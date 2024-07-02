const express = require('express');
const snapsave = require("snapsave-downloader2");
const bodyParser = require('body-parser');
const ejs = require('ejs'); // Tambahkan baris ini
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.set('view engine', 'ejs'); // Tambahkan baris ini untuk mengatur mesin tampilan EJS
app.use(express.static('public')); // Tambahkan baris ini untuk mengizinkan penggunaan file statis (misalnya: CSS)

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index'); // Mengubah ini untuk merender halaman EJS bernama 'index'
});

app.post('/', async (req, res) => {
  const { url } = req.body;

  try {
    const jsonData = await snapsave(url);
    console.log(jsonData);

    res.render('thumbnails', { jsonData }); // Mengubah ini untuk merender halaman EJS bernama 'thumbnails' dengan data JSON
  } catch (error) {
    console.log('Gagal mendapatkan data dari URL:', url);
    res.render('404_production'); // Buat halaman EJS bernama 'error' untuk menampilkan pesan kesalahan
  }
});

app.get("/file/:name", (req, res) => {
  const { name } = req.params;
  const filePath = path.join(__dirname, 'file', name);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found.");
  }

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Error sending file.");
    }
  });
});


app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.status(404).render('404_production');
  } else {
    res.status(404).json({
      code: 404,
      message: "Not Found"
    });
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
