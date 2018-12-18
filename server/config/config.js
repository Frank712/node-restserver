//=========================== 
// 	PORT
//===========================
process.env.PORT = process.env.PORT || 3000;

//===========================
// 	ENVIRONMENT
//===========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===========================
// 	DATABASE
//===========================
let urlDB;
if( process.env.NODE_ENV === 'dev' ){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb://admin-coffe:zxc123asd456qwe789@ds157818.mlab.com:57818/cafedb';
}
process.env.URLDB = urlDB;
