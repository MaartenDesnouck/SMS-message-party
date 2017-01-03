var SMS = require('./SMS');
var correctPhonenumber = require('./correctPhonenumber');
var getHandleFromMessage = require('./getHandleFromMessage');
var getConversationFromId = require('./getConversationFromId');
var changeUserStatus = require('./changeUserStatus');
var getUserFromPhonenumber = require('./getUserFromPhonenumber');
var timeStamp = require('./timeStamp');
var getUserFromHandle = require('./getUserFromHandle');
var getFullHandleEntry = require('./getFullHandleEntry');
var inBlocklist = require('./inBlocklist');
var getTextFromMessage = require('./getTextFromMessage');
var newUser = require('./newUser');
var newConversation = require('./newConversation');
var addHandle = require('./addHandle');
var updateMessageStatusInDatabase = require('./updateMessageStatusInDatabase');

module.exports = {
    //elk bericht dat binnenkomt juist afhandelen
    run: function(gateway, gateway_id, smsgateway_devices, message, phonenumber, my_phonenumber, live) {
        logmessage = timeStamp.run() + ' RECEIVED: ' + phonenumber + " : " + message;
        console.log(logmessage.yellow);
        if (!(live && (correctPhonenumber.run(phonenumber) == my_phonenumber))) { //if phonenumber is not mine
            //(beetje overbodig maar ze zouden het telfoonnr kunnen spoofen en dan kom ik in een oneindige feedbackloop)
            //(met gevolg we ons zelf dos'en)
            getUserFromPhonenumber.run(phonenumber, function(err, senderrow) {
                //console.log(senderrow);
                if (senderrow != undefined) { //IF phonenumber in users
                    if (senderrow.status == 'active') { //IF userstatus is active
                        getHandleFromMessage.run(message, function(err, handle) {
                            if (err == 'error') { //geen correct handle in het bericht
                                if (message.substring(0, 5).toUpperCase() == 'START') { //else if message if 'START'
                                    //verstuur dat ze al actief waren en wat hun handle is
                                    SMS.run(gateway, phonenumber, "Je bent al actief. Je handle is: " + senderrow.id + ".", smsgateway_devices[0].id, live);
                                } else if (message.substring(0, 4).toUpperCase() == 'STOP') { //else if message is 'STOP'
                                    //zet status op stopped en bevestig + instructie om te reactiveren
                                    changeUserStatus.run(phonenumber, 'stopped');
                                    SMS.run(gateway, phonenumber, "Je bent gedeactiveerd, stuur START om terug mee te doen.", smsgateway_devices[0].id, live)
                                } else { //else (dus verkeerd geformateerd)
                                    SMS.run(gateway, phonenumber, "De bestemmeling van dit bericht was niet duidelijk, controleer en probeer dan opnieuw. : " + message, smsgateway_devices[0].id, live);
                                }
                            } else { //correcte handle in het bericht
                                getFullHandleEntry.run(handle, function(err, handlerow) {
                                    if (handlerow != undefined) { //if message starts with existing handle
                                        if (handlerow.type == "user") { //als het een directe handle is
                                            getUserFromHandle.run(handlerow.type_id, function(err, receiverrow) {
                                                if (receiverrow.status == 'active') { //if user is ACTIVE
                                                    inBlocklist.run(senderrow.id, receiverrow.type_id, function(err, blocked) {
                                                        if (blocked == 0) { //if van en naar combo van nummers niet in de blocklist zitten
                                                            //stuur het bericht door
                                                            getTextFromMessage.run(message, function(err, text) {
                                                                newConversation.run(senderrow.id, handle, function(status, conversationId) { //nieuwe coversatie aanmaken
                                                                    if (status == "success") {
                                                                        //console.log("success");
                                                                        addHandle.run("gesprek" + conversationId, "conversation", conversationId);
                                                                        SMS.run(gateway, receiverrow.phonenumber, 'Nieuw bericht. (reply @gesprek' + conversationId + '):' + text, smsgateway_devices[0].id, live);
                                                                        SMS.run(gateway, phonenumber, 'Nieuw gesprek gestart tussen jij en @' + handle + ' op de gesprekshandle @gesprek' + conversationId + '.', smsgateway_devices[0].id, live);
                                                                    } else {
                                                                        SMS.run(gateway, phonenumber, 'Oeps, er ging iets fout. Probeer nog eens opnieuw.', smsgateway_devices[0].id, live);
                                                                    }
                                                                });
                                                            });
                                                        }
                                                    });
                                                } else if (receiverrow.status == 'stopped') { //if handle is STOPPED
                                                    //stuur een bericht dat deze persoon gestopt is
                                                    SMS.run(gateway, phonenumber, '@' + handle + ' is niet meer actief. Sorry.', smsgateway_devices[0].id, live);
                                                } else if (receiverrow.status == 'blocked') { //else : handle is blocked
                                                    //stuur bericht dat de bestemmeling geblocked is
                                                    SMS.run(gateway, phonenumber, '@' + handle + ' is gebanned. Sorry.', smsgateway_devices[0].id, live);
                                                }
                                            });
                                        } else if (handlerow.type == "conversation") { //als het een conversation handle is
                                            getConversationFromId.run(handlerow.type_id, function(err, conversationrow) { // Conversation opvragen adhv handlerow.type_id
                                                // Controleren of de afzender in de conversation zit
                                                if (senderrow.id == conversationrow.stater_user_id) { //als de afzender de starter van de conversation is
                                                    getUserFromHandle.run(conversationrow.receiver_user_id, function(err, receiverrow) { //we vragen dan de receiver op
                                                        if (receiverrow.status == 'active') { //if user is ACTIVE
                                                            inBlocklist.run(sender, receiver, function(err, blocked) {
                                                                if (blocked == 0) { //if van en naar combo van nummers niet in de blocklist zitten
                                                                    //stuur het bericht door
                                                                    getTextFromMessage.run(message, function(err, text) {
                                                                        SMS.run(gateway, receiverrow.phonenumber, '@' + handle + ':' + text, smsgateway_devices[0].id, live);
                                                                    });
                                                                }
                                                            });
                                                        } else if (receiverrow.status == 'stopped') { //if handle is STOPPED
                                                            //stuur een bericht dat deze persoon gestopt is
                                                            SMS.run(gateway, phonenumber, '@' + handle + ' is niet meer actief. Sorry.', smsgateway_devices[0].id, live);
                                                        } else if (receiverrow.status == 'blocked') { //else : handle is blocked
                                                            //stuur bericht dat de bestemmeling geblocked is
                                                            SMS.run(gateway, phonenumber, '@' + handle + ' is gebanned. Sorry.', smsgateway_devices[0].id, live);
                                                        }
                                                    });
                                                } else if (senderrow.id == conversationrow.receiver_user_id) { //als de afzender de receiver van de conversation is
                                                    getUserFromHandle.run(conversationrow.starter_user_id, function(err, receiverrow) { //we vragen dan de starter op
                                                        if (receiverrow.status == 'active') { //if user is ACTIVE
                                                            inBlocklist.run(senderrow.id, receiverrow.type_id, function(err, blocked) {
                                                                if (blocked == 0) { //if van en naar combo van nummers niet in de blocklist zitten
                                                                    //stuur het bericht door
                                                                    getTextFromMessage.run(message, function(err, text) {
                                                                        SMS.run(gateway, receiverrow.phonenumber, '@' + handle + ' stuurde:' + text, smsgateway_devices[0].id, live);
                                                                    });
                                                                }
                                                            });
                                                        } else if (receiverrow.status == 'stopped') { //if handle is STOPPED
                                                            //stuur een bericht dat deze persoon gestopt is
                                                            SMS.run(gateway, phonenumber, '@' + handle + ' is niet meer actief. Sorry.', smsgateway_devices[0].id, live);
                                                        } else if (receiverrow.status == 'blocked') { //else : handle is blocked
                                                            //stuur bericht dat de bestemmeling geblocked is
                                                            SMS.run(gateway, phonenumber, '@' + handle + ' is gebanned. Sorry.', smsgateway_devices[0].id, live);
                                                        }

                                                    });
                                                } else { //de afzender zit niet in deze conversatie
                                                    SMS.run(gateway, phonenumber, 'Jij zit niet in deze conversatie. Controleer of je bericht wel juist was. :' + message, smsgateway_devices[0].id, live);
                                                }
                                            });
                                        } else { //if handle type is ongeldig
                                            console.log("ongeldige handle type");
                                        }
                                    } else { //else (dus onbestaande handle)
                                        //stuur bericht dat de handle naar waar je wou sturen niet bestaat
                                        SMS.run(gateway, phonenumber, 'De handle van dit bericht lijkt niet te bestaan, controleer en probeer dan opnieuw. :' + message, smsgateway_devices[0].id, live);
                                    }
                                });
                            }
                        });
                    } else if (senderrow.status == 'stopped') { //if userstatus is stopped
                        //console.log("stopped user sent a message");
                        if (message.substring(0, 5).toUpperCase() == 'START') { //if message is 'START'
                            //wijzig status naar ACTIVE en bevestig met handle
                            changeUserStatus.run(phonenumber, 'active');
                            SMS.run(gateway, phonenumber, 'Welcome back! Je handle is nog steeds: ' + senderrow.id + '.', smsgateway_devices[0].id, live);
                        } else { //else
                            //waarschuwen dat ze gestopt waren en instructie over hoe te herstarten
                            SMS.run(gateway, phonenumber, 'Je bent gedeactiveerd, stuur START om terug mee te doen.', smsgateway_devices[0].id, live);
                        }

                    } else if (senderrow.status == 'blocked') { //if userstatus is blocked
                        //console.log("blocked user sent a message");
                        SMS.run(gateway, phonenumber, 'Je bent gebanned, sorry. Als je denkt dat dit fout is moet je eens met Maarten gaan praten.', smsgateway_devices[0].id, live);
                    } else { //if userstatus is ongeldig
                        console.log("ongeldige status");
                    }

                } else { //else if phonenumber not in users
                    if (message.substring(0, 5).toUpperCase() == 'START') { //if message is 'START'
                        //verstuur welkom groet en instructies over hoe te versturen en hoe te stoppen
                        newUser.run(phonenumber, function(status, userId) {
                            if (status == "success") {
                                //console.log("success");
                                addHandle.run(userId, "user", userId);
                                SMS.run(gateway, phonenumber, 'Welkom! Je handle is: ' + userId + '. Om te stoppen: stuur STOP. Om een anonieme sms naar X te sturen stuur je naar dit telnr een sms met de vorm: @X blabla', smsgateway_devices[0].id, live);
                                //console.log('START');
                            } else {
                                SMS.run(gateway, phonenumber, 'Oeps, er ging iets fout. Probeer nog eens opnieuw.', smsgateway_devices[0].id, live);
                            }
                        });
                    } else { //if message is not 'START'
                        //verstuur dat ze nog niet actief zijn en hoe ze moeten starten
                        SMS.run(gateway, phonenumber, "Hallo, welkom bij de Messagebar. Je bent nog niet geregistreerd, stuur START om mee te doen.", smsgateway_devices[0].id, live);
                        //console.log('NOT START');
                    }
                }
            });
        }
        updateMessageStatusInDatabase.run(gateway_id, "handled");
    }
}
