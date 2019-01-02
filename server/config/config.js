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
process.env.EXPIRATE_TOKEN = '48h';

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

process.env.CLIENT_ID = process.env.CLIENT_ID || '952339169567-gj8edoakhhgairtov5h671q6silseqj4.apps.googleusercontent.com';
