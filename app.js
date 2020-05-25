//import {Login} from './login.js';

let pojmovi = db.collection('pojmovi');
let formUsername = document.querySelector('#formUsername');
let inputUsername = document.querySelector('#inputUsername');
let divUser = document.querySelector('#divUser');
let formPojam = document.querySelector('#formPojam');
let inputPojam = document.querySelector('#inputPojam');
let linkPojmovi = document.getElementById('linkPojmovi');
let formStartGame = document.querySelector('#formStartGame');
let formInputs = document.querySelectorAll('#formStartGame input');
let startTimer = document.querySelector('#startTimer');


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
if (location.pathname.includes('index')) {
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
if (location.pathname.includes('dodaj_pojam.html')) {
    formPojam.addEventListener('submit', e => {
        e.preventDefault();
        let selektovanPojam = document.querySelector('select').value;

        if (inputPojam.value.replace(/\s+/g, '') == '' || selektovanPojam == 'Izbaberite kategoriju' || selektovanPojam.replace(/\s+/g, '') == '') {
            alert('Pojam ili kategorija ne moze biti prazna');
        } else {
            let noWhitespace = inputPojam.value.replace(/\s+/g, '').toLowerCase();
            let formatiranPojam = noWhitespace.charAt(0).toUpperCase() + noWhitespace.slice(1);
            let specialPocetnoSlovo;
            //console.log(document.querySelector('select').value);
            //console.log(formatiranPojam);

            if (noWhitespace.slice(0, 2) == 'nj' || noWhitespace.slice(0, 2) == 'lj' || noWhitespace.slice(0, 2) == 'dž') {
                specialPocetnoSlovo = noWhitespace.charAt(0).toUpperCase() + noWhitespace.charAt(1);
            } else {
                specialPocetnoSlovo = noWhitespace.charAt(0).toUpperCase();
            }

            // Provera i dodavanje da li izabrani pojam vec postoji u bazi
            pojmovi.where('kategorija', '==', selektovanPojam)
                .where('pojam', '==', formatiranPojam)
                .get()
                .then(snapshot => {
                    if (snapshot.docs.length) {
                        alert(`Pojam '${formatiranPojam}' vec postoji za izabranu kategoriju: ${selektovanPojam}`);
                        //console.log(snapshot.docs.length);
                    } else {
                        let currentDate = new Date();
                        if (localStorage.username) {
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
                        } else {
                            alert('Upis ne moze da se izvrsi, korisnicko ime nije postaljveno!')
                        }
                    }
                })
                .catch(error => {
                    console.error("Cannot get documents from collection: ", error);
                });
        }
    });
}

// Hall Of Fame no front-end yet
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

if (location.pathname.includes('covek_vs_cpu.html')) {

    let abeceda = ['A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'N', 'M', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];
    //let radnomSlovo = abeceda[Math.floor(Math.random() * abeceda.length)];
    //document.querySelector('#rSlovo').innerHTML = `Nasumicno izabrano slovo je:  <strong class='badge badge-primary text-wrap' ><h5>${radnomSlovo}</h5></strong>`;

    formStartGame.addEventListener('submit', e => {
        e.preventDefault();
        let formatiranUserInput = [];
        let pocetnaSlova = [];
        let abeceda = ['A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'N', 'M', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];
        let randomSlovo = abeceda[Math.floor(Math.random() * abeceda.length)];

        // Formatted input from user - no whitespacing, every first letter to upper case
        formInputs.forEach(input => {
            formatiranUserInput.push(
                input.value.replace(/\s+/g, '').charAt(0).toUpperCase() + input.value.replace(/\s+/g, '').toLowerCase().slice(1)
            );
        });

        // Every first letter sliced and added to separate array
        formatiranUserInput.forEach(input => {
            //console.log(input.slice(0, 2))
            if (input.slice(0, 2) == 'Nj' || input.slice(0, 2) == 'Lj' || input.slice(0, 2) == 'Dž') {
                pocetnaSlova.push(input.slice(0, 2));
            } else {
                pocetnaSlova.push(input.charAt(0));
            }

        });


        // User compare logic
        pojmovi.where('pocetnoSlovo', '==', 'A').get()
            .then(snapshot => {
                let poklopoljeniPojmoviUsera = [];

                snapshot.docs.forEach(doc => {
                    poklopoljeniPojmoviUsera.push(doc.data().pojam);
                })
                //console.log(poklopoljeniPojmoviUsera.filter(x => formatiranUserInput.includes(x)))
            });


        pojmovi.where('pocetnoSlovo', '==', 'A').get()
            .then(snapshot => {
                let CPUDrzava;
                let pojmoviArray = [];
                snapshot.docs.forEach(doc => {
                    if (doc.data().kategorija == 'Država') {
                        let chance = Math.round(Math.random() * 99) + 1;
                        pojmoviArray.push(doc.data().pojam);
                        
                        if (chance <= 80) {
                            //console.log(typeof (doc.data()))
                            CPUDrzava = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUDrzava = 'Nemam pojam!';
                        }
                        //console.log(CPUDrzava);
                    }
                });
                console.log(CPUDrzava);
            });

        //console.log(pocetnaSlova);
        //console.log(formatiranUserInput);
        //console.log(poklopoljeniPojmoviUsera);
    })

}