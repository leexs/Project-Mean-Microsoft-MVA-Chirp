var mongoose = require('mongoose');   
var User = require('./Models/user');
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');
var Validate = require('./ValidateUP');

module.exports = function(passport){

	passport.serializeUser(function(user, done) {
		done(null, user._id);
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) { 
			User.findOne({ 'username' :  username }, 
				function(err, user) {
					if (err) return done(err);
					if (!user) return done(null, false);
					if (!isValidPassword(user, password)) return done(null, false);
					return done(null, user);
				}
			);
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback : true 
		},
		function(req, username, password, done) {
			User.findOne({ 'username' :  username }, function(err, user) {
				if (err) return done(err);
				if (user) return done(null, false);
				console.log(Validate(password));
				console.log("regex:/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])([a-zA-Z0-9_\\-\\$!@#%&]{8,20})$/");
				if (!Validate({username : username, password : password})) return done(null, false);
				
				var newUser = new User();
				newUser.username = username;
				newUser.password = createHash(password);

				newUser.save(function(err, user) {
					if (err) throw err;  
					return done(null, user);
				});
				
			});
		})
	);

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
