class UserClass {

    constructor(id, username, password,collection=[]) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.collection = collection;
    }

}
module.exports = UserClass;