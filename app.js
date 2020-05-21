//import {Login} from './login.js';

let formUsername = document.querySelector('#formUsername');
let inputUsername = document.querySelector('#inputUsername');
let divUser = document.querySelector('#divUser');
let formPojam = document.querySelector('#formPojam');
let inputPojam = document.querySelector('#inputPojam');
let linkPojmovi = document.getElementById('linkPojmovi');
let pojmovi = db.collection('pojmovi');

//console.log(linkPojmovi);


// Prikaz korisnickog imena, ako postoiji i sakrivanje link pojmovi
if (localStorage.username) {
    //console.log(localStorage.username)
    divUser.innerHTML = `Vase korisnicko ime je: <span class='text-danger'>${localStorage.username}</span>`;
    location.pathname.slice(1) ? 'index.html' : linkPojmovi.style.visibility = 'visible';
} else {
    divUser.innerHTML = ``;
    linkPojmovi.style.visibility = 'hidden';
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

// Formatiranje podataka za bazu
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
        let specialPocetnoSlovo;

        if (noWhitespace.slice(0, 2) === 'nj' || 'lj' || 'dž') {
            specialPocetnoSlovo = noWhitespace.charAt(0).toUpperCase() + noWhitespace.slice(1, 2);
        } else {
            specialPocetnoSlovo = noWhitespace.charAt(0).toUpperCase() + noWhitespace.slice(1);
        }

        // Provera i dodavanje da li izabrani pojam vec postoji u bazi
        pojmovi.where('kategorija', '==', selektovanPojam)
            .where('pojam', '==', formatiranPojam)
            .get()
            .then(snapshot => {
                if (snapshot.docs.length) {
                    alert(`Pojam '${formatiranPojam}' vec postoji za izabranu kategoriju: ${selektovanPojam}`);
                    console.log(snapshot.docs.length);
                } else {
                    let currentDate = new Date();

                    pojmovi.doc().set({
                        kategorija: selektovanPojam,
                        korisnik: localStorage.username,
                        pocetnoSlovo: specialPocetnoSlovo,
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
                }
            })
            .catch(error => {
                console.error("Cannot get documents from collection: ", error);
            });

    });
}


pojmovi
    .orderBy('korisnik', 'asc')
    .get()
    .then(
        snapshot => {
            let count = {};
            //let users = [];
            //let niz = [];
            //let temp = snapshot.docs[0].data().korisnik;
            //console.log(snapshot.docs);
            //console.log(temp);
            //let counter = 0;
            snapshot.docs.forEach(doc => {
                count[doc.data().korisnik] = (count[doc.data().korisnik] || 0) + 1;
                // Get an array of the keys:

                // Then sort by using the keys to lookup the values in the original object:

                //users.push(doc.data().korisnik);
                //console.log(count);
                //console.log(index);
                //console.log(doc.data().korisnik)
                // if(temp == users[index]) {
                //     //console.log(temp.korisnik == doc.data().korisnik);
                //     counter++;
                //     niz.push([users[index], counter]);
                // } else {
                //     counter = 0;
                //     temp = users[index];
                //     niz.push([users[index], counter]);
                //     counter++;
                // }
            });
            let keys = Object.keys(count);
            keys.sort(function (a, b) { return count[b] - count[a] });
            console.log(keys);
            console.log(count);
            // console.log(users);
            //console.log(niz);
        }
    );


// db.collection('pojmovi').get()
//     .then(function (querySnapshot) {
//         querySnapshot.forEach(function (doc) {
//             console.log(doc.id, " => ", doc.data());
//         });

//     })
//     .catch(function (error) {
//         console.log("Error getting documents: ", error);
//     });