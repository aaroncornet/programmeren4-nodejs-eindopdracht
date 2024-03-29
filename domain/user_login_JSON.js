/*
    user_login_JSON.js   -  user_login_JSON class
 */

const assert = require('assert');

class user_login_JSON {

    //Constructor for user_login_JSON
    constructor(email, password){

        assert(email !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(password !== '', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(email) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');
        assert(typeof(password) === 'string', 'Een of meer properties in de request body ontbreken of zijn foutief');

        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        assert(regex.test(String(email).toLowerCase()), 'Een of meer properties in de request body ontbreken of zijn foutief');

        this.email = email;
        this.password = password;
    }
}

//Make user_login_JSON available to other classes
module.exports = user_login_JSON;

