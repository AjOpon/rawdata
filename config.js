require('dotenv').config();


module.exports= {
	'database' : process.env.DB_URL,
 	'port' : process.env.APP_PORT,//port for server requests
 	'mongoptions' : {
	  'user': process.env.DB_USER,
	  'pass': process.env.DB_PSWD
	} 
};