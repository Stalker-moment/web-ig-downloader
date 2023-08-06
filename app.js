const express = require('express');
const snapsave = require("snapsave-downloader");
const bodyParser = require('body-parser');
const ejs = require('ejs'); // Tambahkan baris ini

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
    res.render('error'); // Buat halaman EJS bernama 'error' untuk menampilkan pesan kesalahan
  }
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
