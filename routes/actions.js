var express = require('express');
var router = express.Router();

/* GET actions page. */
router.get('/', function(req, res, next) {
    res.render('actions', {
        title: 'SMSmessageParty',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview active',
        sidebar_active_messages: 'treeview',
        sidebar_active_include: 'treeview',
    });
});

module.exports = router;
