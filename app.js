const express = require('express')
const expressLayouts = require('express-ejs-layouts')

const {body, validationResult, check} = require('express-validator')

const methodOverride = require('method-override')

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');


require('./utils/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

// setup method override
app.use(methodOverride('_method'))

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

  // Halaman form tambah data kontak
app.get('/contact/add', (req, res) => {
  res.render('add-contact' , {
    layout: 'layouts/main',
    title: 'Tambah Kontak',
  });
})

// proses tambah data kontak
app.post('/contact', [
  // validasi
  body('nama').custom(async(value) => {
    const duplikat = await Contact.findOne({nama: value});
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
    res.render('add-contact', {
      title: "Tambah Kontak",
      layout: 'layouts/main',
      errors: errors.array()
    })
  }else {
    Contact.insertMany(req.body, (error, result) => {
    // kirimkan flash message
    req.flash('msg', 'Data kontak berhasil ditambahkan');
    res.redirect('/contact')
    })
  }
})

  // proses delete kontak
app.delete('/contact', (req,res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash('msg', 'Data kontak berhasil dihapus');
    res.redirect('/contact')
  })
})

// form ubah data kontak
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama})

  res.render('edit-contact' , {
    layout: 'layouts/main',
    title: 'Ubah Kontak',
    contact,
  });
})

// proses ubah data
app.put('/contact', [
  // validasi
  body('nama').custom(async(value, {req}) => {
    const duplikat = await Contact.findOne({ nama: value });
    if(value !== req.body.oldNama && duplikat) {
      throw new Error('Nama kontak sudah digunakan!')
    }
    return true
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('phone', 'Nomor telepon tidak valid').isMobilePhone('id-ID')
], (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    res.render('edit-contact', {
      title: "Ubah Kontak",
      layout: 'layouts/main',
      errors: errors.array(),
      contact: req.body,
    })
  }else {
    Contact.updateOne(
      { _id: req.body._id }, 
      {
        $set: {
          nama: req.body.nama,
          phone: req.body.phone,
          email: req.body.email
        },
      }
      ).then((result) => {
        // kirimkan flash message
        req.flash('msg', 'Data kontak berhasil diubah');
        res.redirect('/contact')
      })
  }
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

