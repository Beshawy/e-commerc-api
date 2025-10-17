const fs = require('fs');
require('colors') ;
const dotenv = require('dotenv');
const Product = require('../../models/productModel');
const dbConnection = require('../../config/database');

dotenv.config({ path: '../../config.env' });

dbConnection() ;

const products = JSON.parse(fs.readFileSync(`${__dirname}/products.json` , 'utf-8')) ;

const insertData = async () =>{
try {
    await Product.create(products) ;
    console.log('Data inserted...'.green.inverse) ;
    process.exit() ;
} catch(error) {
    console.log(`${error}`.red.inverse) ;
}
} ;

const destroyData = async () =>{
   try{
    await Product.deleteMany() ;
    console.log('Data destroyed...'.red.inverse) ;
    process.exit() ;

   } catch(error) {
    console.log(`${error}`.red.inverse) ;
   }
} ;


if(process.argv[2] === '-i'){
 insertData() ;

} else if (process.argv[2] === '-d') {
 destroyData() ;
}