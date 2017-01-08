var express = require('express');
var router = express.Router();

/* GET smsgateway page. */
router.get('/:url', function(req, res, next) {
    res.render('include', {
        title: 'SMSmessageParty - Include',
        sidebar_active_dashboard: 'treeview',
        sidebar_active_actions: 'treeview',
        sidebar_active_messages: 'treeview',
        sidebar_active_include: 'treeview active',
        smsgateway_adress: 'https://smsgateway.me/admin/messages/index',
        smsgateway_url: req.params.url
    });
});

module.exports = router;
