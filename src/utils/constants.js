const PORT = process.env.PORT || 8000;
const MONGO_URI_DEV = process.env.MONGO_URI_DEV;
const MONGO_URI_PROD = process.env.MONGO_URI_PROD;
const TEMP_DIR = "../../public/temp"
const BYTESCALE_ACCOUNT_ID = process.env.BYTESCALE_ACCOUNT_ID;

module.exports = {
  PORT,
  MONGO_URI_DEV,
  TEMP_DIR,
  BYTESCALE_ACCOUNT_ID,
  MONGO_URI_PROD,
};