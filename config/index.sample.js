require('dotenv').config();

let config = {
    
  ENV: process.env.NODE_ENV,
  PORT: VAL_PORT,
  MONGO_ATLAS_PW: VAL_MONGO_PASSWORD,
  MONGO_ATLAS_USERNAME: VAL_MONGO_USERNAME,
  MONGO_ATLAS_DBNAME: VAL_MONGO_DBNAME,

};



module.exports = config;