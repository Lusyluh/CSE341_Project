const router = require('express').Router();

const authCheck = async (req, res, next) => {
    if (req.user) {
        next();
      } else {
        res.send('You need permission to view this page, please login');
        res.redirect('/auth/login');
      }

};

router.get('/',authCheck, (req, res) =>{
    res.render('dashboard');

});

module.exports = router;