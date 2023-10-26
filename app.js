const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { loadContact, findContact, addContact, cekDuplikat } = require('./utils/contacts')
const {body, validationResult, check} = require('express-validator');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

const app = express();
const port = 3000


// menggunakan ejs
app.set('view engine', 'ejs');

app.use(expressLayouts);

// Built-in Middleware
app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))

// konfigurasi flash message
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: {maxAge: 6000},
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

app.get('/', (req, res) => {

  const mahasiswa = [
    {
      nama: 'wahyu',
      alamat: 'Banjarbaru'
    },
    {
      nama: 'Saif',
      alamat: 'Banjarbaru'
    },
    {
      nama: 'Bayu',
      alamat: 'Banjar,asin'
    }
  ];

  res.render('index', {
    nama: 'Muhammad Syaifuddin',
    layout: 'layouts/main',
    title: 'Halaman Home',
    mahasiswa
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main',
    title: 'Halaman About'});
})

app.get('/contact', (req, res) => {
  const contacts = loadContact();
  res.render('contact' , {
    layout: 'layouts/main',
    title: 'Halaman Contact',
    contacts,
    msg: req.flash('msg')
  });
})

// Halaman form tambah data kontak
app.get('/contact/add', (req, res) => {
  res.render('add-contact' , {
    layout: 'layouts/main',
    title: 'Tambah Kontak',
  });
})

// proses data kontak
app.post('/contact', [
  // validasi
  body('nama').custom((value) => {
    const duplikat = cekDuplikat(value);
    if(duplikat) {
      throw new Error('Nama kontak sudah digunakan!')
    }
    return true
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('phone', 'Nomor telepon tidak valid').isMobilePhone('id-ID')
], (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    // return res.status(400).json({errors: errors.array()})
    res.render('add-contact', {
      title: "Tambah Kontak",
      layout: 'layouts/main',
      errors: errors.array()
    })
  }else {
    addContact(req.body);
    // kirimkan flash message
    req.flash('msg', 'Data kontak berhasil ditambahkan');
    res.redirect('/contact')
  }
})


// routing detail kontak berdasarkan nama
app.get('/contact/:nama', (req, res) => {
  const contact = findContact(req.params.nama);
  res.render('detail' , {
    layout: 'layouts/main',
    title: 'Detail Kontak',
    contact,
  });
})



// harus ditulis paling bawah
app.use('/', (req, res) => {
  res.status(404)
  res.send('<h1>404</h1>')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})





