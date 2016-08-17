'use strict';

const fcm = require('../lib/fcm-man');

let options = {
    apiKey: 'project api key',
    senderId: 'project ID'
};
var group = new fcm.Group(options);

group.createDeviceGroup('deviceGroupName', ['firebase_token_id_list'], (err, notificationKey) => {
    if (err)
        console.error(err);
    else
        console.log('notification key: ' + notificationKey);
});
