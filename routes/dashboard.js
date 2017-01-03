var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', { title: 'SMessageParty',
    sidebar_active_dashboard: 'treeview active',
    sidebar_active_actions: 'treeview',
    sidebar_active_messages: 'treeview',
    sidebar_active_include: 'treeview',
  });
});

router.get('/dashboard/', function(req, res, next) {
  res.render('dashboard', { title: 'SMessageParty',
    sidebar_active_dashboard: 'treeview active',
    sidebar_active_actions: 'treeview',
    sidebar_active_messages: 'treeview',
    sidebar_active_include: 'treeview',
  });
});

module.exports = router;
