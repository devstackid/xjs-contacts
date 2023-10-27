const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

// menggunakan ejs
app.set('view engine', 'ejs');

app.use(expressLayouts);

// konfigurasi flash
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

// Built-in Middleware
app.use(express.static('public'))

app.use(express.urlencoded({extended: true}))

app.listen(port, () => {
    console.log(`Mongo Contact App | Listening at http://localhost:${port}`)
})


// halaman home

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

  // halmaan about
  app.get('/about', (req, res) => {
    res.render('about', {
      layout: 'layouts/main',
      title: 'Halaman About'});
  })

  // halaman kontak
  app.get('/contact', async (req, res) => {
    // Contact.find().then((contact) => {
    //   res.send(contact)
    // })
    const contacts = await Contact.find();

    res.render('contact' , {
      layout: 'layouts/main',
      title: 'Halaman Contact',
      contacts,
      msg: req.flash('msg')
    });
  })


  // routing detail kontak berdasarkan nama
app.get('/contact/:nama', async(req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama});
  res.render('detail' , {
    layout: 'layouts/main',
    title: 'Detail Kontak',
    contact,
  });
})