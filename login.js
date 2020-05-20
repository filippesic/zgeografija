export class Login {
    constructor(u) {
        this.username = u;
        this.pojmovi = db.collection('pojmovi');
    }

    set username(u) {
        this._username = u;
    }

    get username() {
        return this._username;
    }
}