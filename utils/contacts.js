const fs = require("fs");

const dirPath = './data';
if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath);
};

// membuat file contacts.json jika tidak ada
const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)){
    fs.mkdirSync('./data/contacts.json', '[]', 'utf-8');
};

// ambil semua data di contacts.json
const loadContact = () => {
    const file = fs.readFileSync('data/contacts.json', 'utf-8');
    const contacts = JSON.parse(file);
    return contacts;
}


// cari kontak berdasarkan nama
const findContact = (nama) => {
    const contacts = loadContact();
    const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
    return contact;
}

// menuliskan / menimpa file contacts.json dengan data yang baru
const saveContacts = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}

// function addContact untuk menambahkan data kontak baru
const addContact = (contact) => {
    const contacts = loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

// function cek nama yang duplikast
const cekDuplikat = (nama) => {
    const contacts = loadContact();
    return contacts.find((contact) => contact.nama === nama);
}

module.exports = {loadContact, findContact, addContact, cekDuplikat};