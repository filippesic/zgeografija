//import {Login} from './login.js';

let pojmovi = db.collection('pojmovi');
let formUsername = document.querySelector('#formUsername');
let inputUsername = document.querySelector('#inputUsername');
let divUser = document.querySelector('#divUser');
let formPojam = document.querySelector('#formPojam');
let inputPojam = document.querySelector('#inputPojam');
let linkPojmovi = document.getElementById('linkPojmovi');
let formStartGame = document.querySelector('#formStartGame');
let startTimer = document.querySelector('#startTimer');
let vremeAnim = document.querySelector('#vreme');
let formInputs = document.querySelectorAll('#formStartGame input');

let usrDrzava = document.querySelector('#inputDrzava');
let usrReka = document.querySelector('#inputReka');
let usrPlanina = document.querySelector('#inputPlanina');
let usrGrad = document.querySelector('#inputGrad');
let usrBiljka = document.querySelector('#inputBiljka');
let usrZivotinja = document.querySelector('#inputZivotinja');
let usrPredmet = document.querySelector('#inputPredmet');


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
    let radnomSlovo = abeceda[Math.floor(Math.random() * abeceda.length)];
    document.querySelector('#rSlovo').innerHTML = `Nasumicno izabrano slovo je:  <strong class='badge badge-primary text-wrap' ><h5>${radnomSlovo}</h5></strong>`;

    formStartGame.addEventListener('submit', e => {
        e.preventDefault();
        let formatiranUserInput = [];
        let pocetnaSlova = [];
        // let abeceda = ['A', 'B', 'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'N', 'M', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];
        // let randomSlovo = abeceda[Math.floor(Math.random() * abeceda.length)];

        // Formatted input from user - no whitespacing, every first letter to upper case
        formInputs.forEach(input => {
            formatiranUserInput.push(input.value.replace(/\s+/g, '').charAt(0).toUpperCase() + input.value.replace(/\s+/g, '').toLowerCase().slice(1));
        });
        formatiranUserInput.splice(-1, 1);

        console.log(formatiranUserInput);

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
        // pojmovi.where('pocetnoSlovo', '==', 'A').get()
        //     .then(snapshot => {
        //         let poklopoljeniPojmoviUsera = [];

        //         snapshot.docs.forEach(doc => {
        //             poklopoljeniPojmoviUsera.push(doc.data().pojam);
        //         })
        //         console.log(poklopoljeniPojmoviUsera.filter(x => formatiranUserInput.includes(x)))
        //     });

        /*--------------------------------------------------------------------------------------------------------------------------------------------------------------*/

        pojmovi.where('pocetnoSlovo', '==', 'A').get() // DRZAVA
            .then(snapshot => {
                let pojmoviIzBaze = [];
                let CPUDrzava;
                let CPUReka;
                let CPUPlanina;
                let CPUGrad;
                let CPUBiljka;
                let CPUZivotinja;
                let CPUPredmet;

                snapshot.docs.forEach(doc => {
                    pojmoviIzBaze.push(doc.data().pojam);

                    if (doc.data().kategorija == 'Država') {
                        let pojmoviArray = [];
                        let chance = Math.random();
                        pojmoviArray.push(doc.data().pojam);

                        if (chance <= 0.8) {
                            //console.log(typeof (doc.data()))
                            CPUDrzava = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUDrzava = 'Nemam drzavu!';
                        }
                    }
                    if (doc.data().kategorija == 'Reka') {
                        let pojmoviArray = [];
                        let chance = Math.random();
                        pojmoviArray.push(doc.data().pojam);

                        if (chance <= 0.8) {
                            //console.log(typeof (doc.data()))
                            CPUReka = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUReka = 'Nemam reku!';
                        }
                    }
                    if (doc.data().kategorija == 'Planina') {
                        let pojmoviArray = [];
                        let chance = Math.random();
                        pojmoviArray.push(doc.data().pojam);

                        if (chance <= 0.8) {
                            //console.log(typeof (doc.data()))
                            CPUPlanina = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUPlanina = 'Nemam planinu!';
                        }
                    }
                    if (doc.data().kategorija == 'Grad') {
                        let pojmoviArray = [];
                        let chance = Math.random();
                        pojmoviArray.push(doc.data().pojam);

                        if (chance <= 0.8) {
                            //console.log(typeof (doc.data()))
                            CPUGrad = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUGrad = 'Nemam grad!';
                        }
                    }
                    if (doc.data().kategorija == 'Biljka') {
                        let pojmoviArray = [];
                        let chance = Math.random();
                        pojmoviArray.push(doc.data().pojam);

                        if (chance <= 0.8) {
                            //console.log(typeof (doc.data()))
                            CPUBiljka = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUBiljka = 'Nemam biljku!';
                        }
                    }
                    if (doc.data().kategorija == 'Životinja') {
                        let pojmoviArray = [];
                        let chance = Math.random();
                        pojmoviArray.push(doc.data().pojam);

                        if (chance <= 0.8) {
                            //console.log(typeof (doc.data()))
                            CPUZivotinja = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUZivotinja = 'Nemam zivotinju!';
                        }
                    }
                    if (doc.data().kategorija == 'Predmet') {
                        let pojmoviArray = [];
                        let chance = Math.random();
                        pojmoviArray.push(doc.data().pojam);

                        if (chance <= 0.8) {
                            //console.log(typeof (doc.data()))
                            CPUPredmet = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
                        } else {
                            CPUPredmet = 'Nemam predmet!';
                        }
                    }
                });

                let poklopoljeniPojmoviUsera = [];
                poklopoljeniPojmoviUsera.push(pojmoviIzBaze.filter(x => formatiranUserInput.includes(x) /* || ''*/)); // Doesn't put empty strings in array when no matching value is found

                // console.log(CPUDrzava);
                // console.log(CPUReka);
                // console.log(CPUPlanina);
                // console.log(CPUGrad);
                // console.log(CPUBiljka);
                // console.log(CPUZivotinja);
                // console.log(CPUPredmet);

                let cpuPoeni = 0;
                let userPoeni = 0;
                let CPUNiz = [];
                CPUNiz.push(CPUDrzava, CPUReka, CPUPlanina, CPUGrad, CPUBiljka, CPUZivotinja, CPUPredmet);

                for (i = 0; i < CPUNiz.length; i++) {
                    if (formatiranUserInput[i] != '' && (CPUNiz[i] == undefined || CPUNiz[i].includes('Nemam'))) {
                        userPoeni += 15;
                    }
                    if (formatiranUserInput[i] == '' && (CPUNiz[i] != undefined || !CPUNiz[i].includes('Nemam'))) {
                        cpuPoeni += 15;
                    }
                    if (formatiranUserInput[i] != '' && formatiranUserInput[i] != CPUNiz[i]) {
                        userPoeni += 10;
                        cpuPoeni += 10;
                    }
                    if (formatiranUserInput[i] != '' && formatiranUserInput[i] == CPUNiz[i]) {
                        userPoeni += 5;
                        cpuPoeni += 5;
                        console.log('petica');
                    }
                }



                console.log('CPU poeni: ' + cpuPoeni);
                console.log('User poeni: ' + userPoeni);

                console.log('USER INPUTS:');
                console.log(formatiranUserInput); // Doesn't have chekcking if the term actually exists in DB
                console.log('CPU INPUTS:');
                console.log(CPUNiz);

            });

        // pojmovi.where('pocetnoSlovo', '==', 'A').get() // REKA
        // .then(snapshot => {
        //     let CPUReka;
        //     let pojmoviArray = [];
        //     snapshot.docs.forEach(doc => {
        //         if (doc.data().kategorija == 'Reka') {
        //             let chance = Math.random();
        //             pojmoviArray.push(doc.data().pojam);

        //             if (chance <= 0.8) {
        //                 //console.log(typeof (doc.data()))
        //                 CPUReka = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
        //             } else {
        //                 CPUReka = 'Nemam pojam!';
        //             }
        //             //console.log(CPUReka);
        //         }
        //     });
        //     console.log(CPUReka);
        // });

        // pojmovi.where('pocetnoSlovo', '==', 'A').get() // PLANINA
        // .then(snapshot => {
        //     let CPUPlanina;
        //     let pojmoviArray = [];
        //     snapshot.docs.forEach(doc => {
        //         if (doc.data().kategorija == 'Planina') {
        //             let chance = Math.random();
        //             pojmoviArray.push(doc.data().pojam);

        //             if (chance <= 0.8) {
        //                 //console.log(typeof (doc.data()))
        //                 CPUPlanina = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
        //             } else {
        //                 CPUPlanina = 'Nemam pojam!';
        //             }
        //             //console.log(CPUPlanina);
        //         }
        //     });
        //     console.log(CPUPlanina);
        // });

        // pojmovi.where('pocetnoSlovo', '==', 'A').get() // GRAD
        // .then(snapshot => {
        //     let CPUGrad;
        //     let pojmoviArray = [];
        //     snapshot.docs.forEach(doc => {
        //         if (doc.data().kategorija == 'Grad') {
        //             let chance = Math.random();
        //             pojmoviArray.push(doc.data().pojam);

        //             if (chance <= 0.8) {
        //                 //console.log(typeof (doc.data()))
        //                 CPUGrad = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
        //             } else {
        //                 CPUGrad = 'Nemam pojam!';
        //             }
        //             //console.log(CPUGrad);
        //         }
        //     });
        //     console.log(CPUGrad);
        // });

        // pojmovi.where('pocetnoSlovo', '==', 'A').get() // BILJKA
        // .then(snapshot => {
        //     let CPUBiljka;
        //     let pojmoviArray = [];
        //     snapshot.docs.forEach(doc => {
        //         if (doc.data().kategorija == 'Biljka') {
        //             let chance = Math.random();
        //             pojmoviArray.push(doc.data().pojam);

        //             if (chance <= 0.8) {
        //                 //console.log(typeof (doc.data()))
        //                 CPUBiljka = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
        //             } else {
        //                 CPUBiljka = 'Nemam pojam!';
        //             }
        //             //console.log(CPUBiljka);
        //         }
        //     });
        //     console.log(CPUBiljka);
        // });

        // pojmovi.where('pocetnoSlovo', '==', 'A').get() // ZIVOTINJA
        // .then(snapshot => {
        //     let CPUZivotinja;
        //     let pojmoviArray = [];
        //     snapshot.docs.forEach(doc => {
        //         if (doc.data().kategorija == 'Životinja') {
        //             let chance = Math.random();
        //             pojmoviArray.push(doc.data().pojam);

        //             if (chance <= 0.8) {
        //                 //console.log(typeof (doc.data()))
        //                 CPUZivotinja = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
        //             } else {
        //                 CPUZivotinja = 'Nemam pojam!';
        //             }
        //             //console.log(CPUZivotinja);
        //         }
        //     });
        //     console.log(CPUZivotinja);
        // });            

        // pojmovi.where('pocetnoSlovo', '==', 'A').get() // PREDMET
        // .then(snapshot => {
        //     let CPUPredmet;
        //     let pojmoviArray = [];
        //     snapshot.docs.forEach(doc => {
        //         if (doc.data().kategorija == 'Predmet') {
        //             let chance = Math.random();
        //             pojmoviArray.push(doc.data().pojam);

        //             if (chance <= 0.8) {
        //                 //console.log(typeof (doc.data()))
        //                 CPUPredmet = pojmoviArray[Math.floor(Math.random() * pojmoviArray.length)];
        //             } else {
        //                 CPUPredmet = 'Nemam pojam!';
        //             }
        //             //console.log(CPUPredmet);
        //         }
        //     });
        //     console.log(CPUPredmet);
        //     console.log('KRAJ')
        // });


        //console.log(pocetnaSlova);
        //console.log(formatiranUserInput);
        //console.log(poklopoljeniPojmoviUsera);
    })

}