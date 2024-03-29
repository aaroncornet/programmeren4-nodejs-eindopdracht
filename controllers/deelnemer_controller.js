/*
    deelnemer_controller.js   -   Controller for the requests for deelnemer
 */

const sql = require('mssql');
const db = require('../config/db');
const assert = require('assert');

const ApiError = require('../domain/ApiError');
const chalk = require('chalk');

const DeelnemerResponse = require('../domain/deelnemer_response');

module.exports = {
    // function used to get all deelnemers of a given maaltijdID of a given studentenhuisID from the database
    getDeelnemerList(request, response, next){
        console.log('---------------A GET request was made---------------');
        console.log('-------------------GET deelnemer--------------------');
        try {
            // Set values and test them
            const huisId = request.params.id || -1;
            const maaltijdId = request.params.maaltijdId || -1;

            assert(huisId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');

            // use the connection pool to execute the statement
            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('maaltijdID',sql.Int);

                // prepare the statement
                statement.prepare('EXEC getDeelnemersFromMaaltijdId @huisID, @maaltijdID;').then(s => {
                    s.execute({
                        huisID: huisId,
                        maaltijdID: maaltijdId
                    }).then(result => {
                        s.unprepare();

                        // process the result
                        if(result.recordset.length !== 0) {
                            if ('result' in result.recordset[0]) {
                                if (result.recordset[0].result === -1) {
                                    next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                                } else {
                                    next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
                                }
                            } else {
                                response.status(200).json(result.recordset).end();
                            }
                        } else {
                            response.status(200).json([]).end();
                        }
                    }).catch( err => {
                        console.log(chalk.red('[MSSQL]    ' + err.message));
                        next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                    });
                }).catch(err => {
                    console.log(chalk.red('[MSSQL]    ' + err.message));
                    next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                });
            }).catch(err => {
                console.log(chalk.red('[MSSQL]    ' + err.message));
                next(new ApiError(500, 'Er is op dit moment geen verbinding met de database. Probeer het later opnieuw'));
            });
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },
    // function used to add a deelnemer of a given maaltijdID of a given studentenhuisID from the database
    createDeelnemer(request, response, next){
        console.log('---------------A POST request was made---------------');
        console.log('-------------------POST deelnemer--------------------');
        try {
            // Set values and test them
            const huisId = request.params.id || -1;
            const maaltijdId = request.params.maaltijdId || -1;

            assert(huisId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');

            // use the connection pool to execute the statement
            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('accountID',sql.Int);
                statement.input('maaltijdID',sql.Int);

                // prepare the statement
                statement.prepare('EXEC addDeelnemer @huisID, @accountID, @maaltijdID;').then(s => {
                    s.execute({
                        huisID: huisId,
                        accountID: request.header.tokenid,
                        maaltijdID: maaltijdId
                    }).then(result => {
                        s.unprepare();

                        // process the result
                        if ('result' in result.recordset[0]) {
                            switch(result.recordset[0].result) {
                                case 0:
                                    next(new ApiError(409, 'Conflict (Gebruiker is al aangemeld)'));
                                    break;
                                case -1:
                                    next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
                                    break;
                                case -2:
                                    next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                                    break;
                            }
                        } else {
                            const row = result.recordset[0];
                            response.status(200).json(new DeelnemerResponse(row.voornaam, row.achternaam, row.email)).end();
                        }
                    }).catch( err => {
                        console.log(chalk.red('[MSSQL]    ' + err.message));
                        next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                    });
                }).catch(err => {
                    console.log(chalk.red('[MSSQL]    ' + err.message));
                    next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                });
            }).catch(err => {
                console.log(chalk.red('[MSSQL]    ' + err.message));
                next(new ApiError(500, 'Er is op dit moment geen verbinding met de database. Probeer het later opnieuw'));
            });
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    },
    // function used to delete a deelnemer of a given maaltijdID of a given studentenhuisID from the database
    deleteDeelnemer(request, response, next){
        console.log('---------------A DELETE request was made---------------');
        console.log('-------------------DELETE deelnemer--------------------');
        try {
            // Set values and test them
            const huisId = request.params.id || -1;
            const maaltijdId = request.params.maaltijdId || -1;

            assert(huisId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');
            assert(maaltijdId >= 0, 'Een of meer properties in de request parameters ontbreken of zijn foutief');

            // use the connection pool to execute the statement
            db.then(conn => {
                const statement = new sql.PreparedStatement(conn);
                statement.input('huisID',sql.Int);
                statement.input('accountID',sql.Int);
                statement.input('maaltijdID',sql.Int);

                // prepare the statement
                statement.prepare('EXEC deleteDeelnemer @huisID, @accountID, @maaltijdID;').then(s => {
                    s.execute({
                        huisID: huisId,
                        accountID: request.header.tokenid,
                        maaltijdID: maaltijdId
                    }).then(result => {
                        s.unprepare();

                        // process the result
                        if(result.recordset !== undefined) {
                            if ('result' in result.recordset[0]) {
                                switch(result.recordset[0].result) {
                                    case 0:
                                        next(new ApiError(409, 'Conflict (Gebruiker is niet aangemeld)'));
                                        break;
                                    case -1:
                                        next(new ApiError(404, 'Niet gevonden (maaltijdId bestaat niet)'));
                                        break;
                                    case -2:
                                        next(new ApiError(404, 'Niet gevonden (huisId bestaat niet)'));
                                        break;
                                }
                            } else {
                                response.status(200).json({}).end();
                            }
                        } else {
                            response.status(200).json({}).end();
                        }
                    }).catch( err => {
                        console.log(chalk.red('[MSSQL]    ' + err.message));
                        next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                    });
                }).catch(err => {
                    console.log(chalk.red('[MSSQL]    ' + err.message));
                    next(new ApiError(500, 'Er heeft een interne fout opgetreden. Probeer het later opnieuw'));
                });
            }).catch(err => {
                console.log(chalk.red('[MSSQL]    ' + err.message));
                next(new ApiError(500, 'Er is op dit moment geen verbinding met de database. Probeer het later opnieuw'));
            });
        } catch(error) {
            next(new ApiError(412, error.message));
        }
    }
};