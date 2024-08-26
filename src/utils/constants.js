const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const TEMP_DIR = "../../public/temp"
const BYTESCALE_ACCOUNT_ID = process.env.BYTESCALE_ACCOUNT_ID;

module.exports = {
  PORT,
  MONGO_URI,
  TEMP_DIR,
  BYTESCALE_ACCOUNT_ID,
};