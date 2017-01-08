var express = require('express');
var router = express.Router();

/* GET messages page. */
router.get('/', function(req, res, next) {
    res.render('messages', {
        title: 'SMSmessageParty - Messages',
        inbox_title: 'Admin',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        message_sidebar_active_admin: 'active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_personal: '',
        message_sidebar_active_sent: '',
        message_sidebar_active_received: '',
        message_sidebar_active_admin_archive: '',
        message_sidebar_active_personal_archive: '',
    });
});

/* GET messages admin page. */
router.get('/admin', function(req, res, next) {
    res.render('messages', {
        title: 'SMSmessageParty - Messages',
        inbox_title: 'Admin',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_admin: 'active',
        message_sidebar_active_personal: '',
        message_sidebar_active_sent: '',
        message_sidebar_active_received: '',
        message_sidebar_active_admin_archive: '',
        message_sidebar_active_personal_archive: '',
    });
});

/* GET messages personal page. */
router.get('/personal', function(req, res, next) {
    res.render('messages', {
        title: 'SMSmessageParty - Messages',
        inbox_title: 'Personal',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_admin: '',
        message_sidebar_active_personal: 'active',
        message_sidebar_active_sent: '',
        message_sidebar_active_received: '',
        message_sidebar_active_admin_archive: '',
        message_sidebar_active_personal_archive: '',
    });
});

/* GET messages sent page. */
router.get('/sent', function(req, res, next) {
    res.render('messages', {
        title: 'SMSmessageParty - Messages',
        inbox_title: 'Sent',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_admin: '',
        message_sidebar_active_personal: '',
        message_sidebar_active_sent: 'active',
        message_sidebar_active_received: '',
        message_sidebar_active_admin_archive: '',
        message_sidebar_active_personal_archive: '',
    });
});

/* GET messages received page. */
router.get('/received', function(req, res, next) {
    res.render('messages', {
        title: 'SMSmessageParty - Messages',
        inbox_title: 'Received',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_admin: '',
        message_sidebar_active_personal: '',
        message_sidebar_active_sent: '',
        message_sidebar_active_received: 'active',
        message_sidebar_active_admin_archive: '',
        message_sidebar_active_personal_archive: '',
    });
});

/* GET admin archive page. */
router.get('/adminarchive', function(req, res, next) {
    res.render('messages', {
        title: 'SMSmessageParty - Messages',
        inbox_title: 'Admin',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_admin: '',
        message_sidebar_active_personal: '',
        message_sidebar_active_sent: '',
        message_sidebar_active_received: '',
        message_sidebar_active_admin_archive: 'active',
        message_sidebar_active_personal_archive: '',
    });
});

/* GET personal archive page. */
router.get('/personalarchive', function(req, res, next) {
    res.render('messages', {
        title: 'SMSmessageParty - Messages',
        inbox_title: 'Personal',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_admin: '',
        message_sidebar_active_personal: '',
        message_sidebar_active_sent: '',
        message_sidebar_active_received: '',
        message_sidebar_active_admin_archive: '',
        message_sidebar_active_personal_archive: 'active',
    });
});

/* GET send new message page. */
router.get('/send/', function(req, res, next) {
    res.render('messages-send', {
        title: 'SMSmessageParty - Messages',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview active',
        sidebar_active_include: 'treeview',
        message_sidebar_active_admin: '',
        message_sidebar_active_personal: '',
        message_sidebar_active_sent: '',
        message_sidebar_active_received: '',
        message_sidebar_active_admin_archive: '',
        message_sidebar_active_personal_archive: '',
    });
});

module.exports = router;
