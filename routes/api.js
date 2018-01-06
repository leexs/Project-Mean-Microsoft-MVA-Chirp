var express = require('express');
var router = express.Router();
var mongoose = require( 'mongoose' );
var User = require('../Models/user');
var Post = require('../Models/post');
var bCrypt = require('bcrypt-nodejs');

function isAuthenticated (req, res, next) {
	
	if(req.method === "GET"){
		return next();
	}
	
	if (req.isAuthenticated()){
		return next();
	}
	return res.send({status: '401', data: null, msg: "Unauthorized." });
};


router.use('/users', isAuthenticated);
router.use('/user', isAuthenticated);

router.route('/users')

	.post(function(req, res){
		User.findOne({ username : req.body.username }, function(err, user){
			if(user) return res.send({status: '500', data: null, msg: "User already exists." });
			if (!ValidatePassword.validate(password)) return res.send({status: '500', data: null, msg: "User already exists." });
			var user = new User();
			user.username = req.body.username;
			user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
			user.name = req.body.name;
			user.admin = req.body.admin;
			user.created_at = req.body.created_at;
			user.updated_at = req.body.updated_at;
			user.save(function(err, user) {
				return res.send({status: '200', data: user, msg: "Success." });
			});
		});
	})
	
	.get(function(req, res){
		User.find(function(err, users){
			if (!users) return res.send({status: '200', data: null, msg: "No users." });
			return res.send({status: '200', data: users, msg: "Success." });
		});
	});

router.route('/users/:id')

	.get(function(req, res){
		User.findOne({ username : req.params.id }, function(err, user){
			if (!user) return res.send({status: '400 ', data: null, msg: "Not found." });
			return res.send({status: '200', data: user, msg: "Success." });
		}).select({"_id": 0});
	}) 

	.put(function(req, res){
		User.findOne({ username : req.params.id }, function(err, olduser){
			if (!olduser) return res.send({status: '400 ', data: null, msg: "Not found." });
			var user = new User();
			user = olduser;
			user.username = req.body.username;
			user.name = req.body.name;
			user.admin = req.body.admin;
			if (!bCrypt.compareSync(req.body.password, olduser.password)){
				user.password = bCrypt.hashSync(req.body.password, bCrypt.genSaltSync(10), null);
			}
			user.save(function(err, user){
				return res.send({status: '200', data: user, msg: "Success." });
			});
		});
	})

	.delete(function(req, res) {
		User.remove({username : req.params.id}, function(err) {
			return res.send({status: '200', data: null, msg: "Success." });
		});
	});


router.use('/posts', isAuthenticated);
router.use('/post', isAuthenticated);

router.route('/posts')

	.post(function(req, res){
		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.save(function(err, post) {
			return res.send({status: '200', data: post, msg: "Success." });
		});
	})

	.get(function(req, res){
		Post.find(function(err, posts){
			if (!posts) return res.send({status: '200', data: null, msg: "No users." });
			return res.send({status: '200', data: posts, msg: "Success." });
		});
	});

router.route('/posts/:id')

	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if (!post) return res.send({status: '200', data: null, msg: "Not found." });
			return res.send({status: '200', data: post, msg: "Success." });
		});
	}) 

	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if (!post) return res.send({status: '200', data: null, msg: "Not found." });
			post.created_by = req.body.created_by;
			post.text = req.body.text;
			post.save(function(err, post){
				return res.send({status: '200', data: post, msg: "Success." });
			});
		});
	})

	.delete(function(req, res) {
		Post.remove({_id: req.params.id}, function(err) {
			return res.send({status: '200', data: null, msg: "Success." });
		});
	});

module.exports = router;