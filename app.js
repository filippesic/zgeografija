//import {Login} from './login.js';

let formUsername = document.querySelector('#formUsername');
let inputUsername = document.querySelector('#inputUsername');
let divUser = document.querySelector('#divUser');
let formPojam = document.querySelector('#formPojam');
let inputPojam = document.querySelector('#inputPojam');


// Prikaz korisnickog imena, ako postoiji
if (localStorage.username) {
    //console.log(localStorage.username)
    divUser.innerHTML = `Vase korisnicko ime je: <span class='text-danger'>${localStorage.username}</span>`;
} else {
    divUser.innerHTML = ``;
}

// Postavljanje korisnickog imena u localstorage
if (location.pathname.slice(1) != 'dodaj_pojam.html') {
    formUsername.addEventListener('submit', e => {
        e.preventDefault();
        if (inputUsername.value.replace(/\s+/g, '') == '') {
            alert('Korisnicko ime ne moze biti prazno')
        }
        let formattedUsername = inputUsername.value.replace(/\s+/g, '').toLowerCase();
        localStorage.setItem('username', formattedUsername);
        formUsername.reset();
    });
}

// Dodavanje pojma i provera da li vec postoji u bazi isti
if (location.pathname.slice(1) == 'dodaj_pojam.html') {
    formPojam.addEventListener('submit', e => {
        e.preventDefault();
        let selektovanPojam = document.querySelector('select').value;
        if (inputPojam.value.replace(/\s+/g, '') == '' || selektovanPojam == 'Izbaberite kategoriju') {
            alert('Pojam ili kategorija ne moze biti prazna');
        }
        let noWhitespace = inputPojam.value.replace(/\s+/g, '').toLowerCase();
        let formatiranPojam = noWhitespace.charAt(0).toUpperCase() + noWhitespace.slice(1);
        //console.log(document.querySelector('select').value);
        //console.log(formatiranPojam);

        let pojmovi = db.collection('pojmovi');

        pojmovi.where('kategorija', '==', selektovanPojam)
            .where('pojam', '==', formatiranPojam)
            .get()
            .then(
                    alert(`Pojam '${formatiranPojam}' vec postoji za izabranu kategoriju: ${selektovanPojam}`))
            .catch(error => {
                console.error("Cannot get documents from collection: ", error);
            });



        let currentDate = new Date();

        pojmovi.doc().set({
            kategorija: selektovanPojam,
            korisnik: localStorage.username,
            pocetnoSlovo: formatiranPojam.charAt(0),
            pojam: formatiranPojam,
            vreme: firebase.firestore.Timestamp.fromDate(currentDate)
        })
            .then(() => {
                alert(`Uspesno ste dodali pojam '${formatiranPojam}' sa kategorijom: ${selektovanPojam} u bazu`);
            })
            .catch(error => {
                console.error("Cannot get documents from collection: ", error);
            });
        formPojam.reset();

    });
}


// db.collection('pojmovi').get()
//     .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//             console.log(doc.id, " => ", doc.data());
//         });

//     })
//     .catch(function (error) {
//         console.log("Error getting documents: ", error);
//     });