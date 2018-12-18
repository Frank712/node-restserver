//=========================== 
// 	PORT
//===========================
process.env.PORT = process.env.PORT || 3000;

//===========================
// 	ENVIRONMENT
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// 	Expiration Date of Token
//===========================
process.env.EXPIRATE_TOKEN = 60 * 60 * 24 * 30;

//===========================
// 	SEED Authentication
//===========================
process.env.SEED = process.env.SEED || 'this-is-a-seed-for-dev';

//===========================
// 	DATABASE
//===========================
let urlDB;
if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


