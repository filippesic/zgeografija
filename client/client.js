let formStartGame = document.querySelector('#formStartGame');
let formInputs = document.querySelectorAll('#formStartGame input');
let alphabet = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'B',
    'C', 'Č', 'Ć', 'D', 'Dž', 'Đ', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'Lj', 'N', 'M', 'Nj', 'O', 'P', 'R', 'S', 'Š', 'T', 'U', 'V', 'Z', 'Ž'];
let randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)]; // NEEDS TO MOVE TO SERVER
let termsCollection = db.collection('pojmovi');

const writeEvent = (text) => {
    // ul elemet
    const parent = document.querySelector('#events');

    // li element
    const el = document.createElement('li');
    el.innerHTML = text;

    parent.appendChild(el);
};

const onFormSubmitted = e => {
    e.preventDefault();

    const input = document.querySelector('#chat');
    const text = input.value;
    input.value = '';

    socket.emit('message', text);
};


formStartGame.addEventListener('submit', e => {
    e.preventDefault();
    let formattedUserInput = [];

    formInputs.forEach(input => {
        formattedUserInput.push(input.value.replace(/\s+/g, '').charAt(0).toUpperCase() + input.value.replace(/\s+/g, '').toLowerCase().slice(1));
    });

    formattedUserInput.splice(-1, 1);
    console.log(formattedUserInput, 'formattedUserInput');

    let checkedUserInput = [];

    let Drzava = '';
    let Reka = '';
    let Planina = '';
    let Grad = '';
    let Biljka = '';
    let Zivotinja = '';
    let Predmet = '';

    termsCollection.where('pocetnoSlovo', '==', 'A')
        .get()
        .then(snapshot => {
            let DBTerms = [];
            snapshot.docs.forEach(doc => {
                // console.log('unutar fora');
                DBTerms.push(doc.data().pojam);
                //console.log(DBTerms, 'DBTerms');
                if (doc.data().kategorija === 'Država' && DBTerms.includes(formattedUserInput[0])) { // bad logic
                    Drzava = formattedUserInput[0];
                    console.log(Drzava, 'DRZAVA U IFU');
                }
                if (doc.data().kategorija === 'Reka' && DBTerms.includes(formattedUserInput[1])) {
                    Reka = formattedUserInput[1];
                }
                if (doc.data().kategorija === 'Planina' && DBTerms.includes(formattedUserInput[2])) {
                    Planina = formattedUserInput[2];
                }
                if (doc.data().kategorija === 'Grad' && DBTerms.includes(formattedUserInput[3])) {
                    Grad = formattedUserInput[3];
                }
                if (doc.data().kategorija === 'Biljka' && DBTerms.includes(formattedUserInput[4])) {
                    Biljka = formattedUserInput[4];
                }
                if (doc.data().kategorija === 'Životinja' && DBTerms.includes(formattedUserInput[5])) {
                    Zivotinja = formattedUserInput[5];
                }
                if (doc.data().kategorija === 'Predmet' && DBTerms.includes(formattedUserInput[6])) {
                    Predmet = formattedUserInput[6];
                }
            });
            console.log(checkedUserInput, 'checkedUserInput');
            checkedUserInput.push(Drzava, Reka, Planina, Grad, Biljka, Zivotinja, Predmet);
            return checkedUserInput;
        })
        .then( data => {
            socket.emit('turn', data)
            console.log(data, 'data');
        }
        ); // then
    //console.log(DBTerms, 'DBTerms');
});

writeEvent('Welcome to ZGeo');

const socket = io();
socket.on('message', writeEvent);

document.querySelector('#chat-form')
    .addEventListener('submit', onFormSubmitted);