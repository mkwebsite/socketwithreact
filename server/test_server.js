var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var express = require('express');
var config_fun = require('./db_config.js');
var config = config_fun.forgeterDb();
var mysql = require('mysql');

var event_config = {
	connectionLimit: 2000,
	host: config.DB_HOST,
	user: config.DB_USER,
	password: config.DB_PASSWORD,
	database: config.DB_NAME,
	dateStrings: true
};

var eventPool = mysql.createPool(event_config);

app.use(express.static(__dirname + '/doc'));


io.on('connection', socket => {

	socket.on('get_records', function (resp) {
		var post = { task: resp[0], description: resp[1] };
		saveTask(post, function (message) {
			post.id = message;
			io.sockets.emit('get_record', post);
		})
	})


	socket.on('task_lists', function (resp) {

		taskList(function (result) {

			io.sockets.emit('task_list', result);
		})
	})

	// disconnect is fired when a client leaves the server
	socket.on('disconnect', () => {
		console.log('user disconnected')
	})
})




var saveTask = function (post, callback) {
	var task = post.task;
	var description = post.description;
	eventPool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
		} else {

			var queryStringInsert = "INSERT INTO `table_test` (`id`, `task`, `description`, `created_at`) VALUES (NULL, '" + task + "', '" + description + "',  CURRENT_TIMESTAMP);";
			connection.query(queryStringInsert, function (err, rows) {

				if (err) {
					console.log(err);
					connection.release();
				} else {
					let inserted_id = rows.insertId;
					connection.release();
					callback(inserted_id);

				}
			});
		}
	});
};



var taskList = function (callback) {

	eventPool.getConnection(function (err, connection) {
		if (err) {
			console.log(err);
		} else {
			var queryString = " SELECT * FROM `table_test`   order by id DESC"
			connection.query(queryString, function (err, rows) {
				connection.release();
				if (err) {
					console.log(err);
				} else {
					if (rows[0] === undefined) {
						callback(0);
					} else {
						callback(rows);
					}
				}
			});

		}
	});
};

Object.size = function (obj) {
	var size = 0, key;
	for (key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
};


http.listen(config.CHAT_PORT, function () {
	console.log('listening on *:' + config.CHAT_PORT);

});

process.on('uncaughtException', function (err) {
	console.log(err);
	console.log("Node NOT Exiting...");
});