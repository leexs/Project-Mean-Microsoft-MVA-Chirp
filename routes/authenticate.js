var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//Check Auth
	router.get('/check', function(req, res) {
		if(req.user){
			res.send({status: '200', data: req.user.username });
		}else{
			res.send({status: '401', data: null });
		}
		
	});

	//log in
	router.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if (err) return next(err);
			if (!user) return res.send({status: '401', data: null, msg: "Invalid username or password." });
			req.logIn(user, function(err) {
				if (err) return next(err);
				return res.send({status: '200', data: user });
			});
		})(req, res, next);
	});

	//sign up
	router.post('/signup', function(req, res, next) {
		passport.authenticate('signup', function(err, user, info) {
			if (err) return next(err);
			if (!user) return res.send({status: '401', data: null, msg: "Invalid username or password." });
			req.logIn(user, function(err) {
				if (err) return next(err);
				return res.send({status: '200', data: user });
			});
		})(req, res, next);
	});


	//log out
	router.get('/signout', function(req, res) {
		console.log("logging out " + req.user.username);
		req.session.destroy(function (err) {
				res.redirect('/');
		});
	});

	return router;

}
