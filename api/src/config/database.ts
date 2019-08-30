import mongoose from 'mongoose';

// Remove the warning with Promise
mongoose.Promise = global.Promise;

// Connect the db with the url provide
const MONGO_URL = process.env.MONGO_URL;
const connect_options = {
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS
}
if (MONGO_URL) {
  try {
    mongoose.connect(MONGO_URL, connect_options);
  } catch (err) {
    console.error(err)
    mongoose.createConnection(MONGO_URL, connect_options);
  }
} else {
  console.error("MONGO_URL not provided in .env file!")
}

mongoose.connection
  .once('open', () => console.log('MongoDB Running'))
  .on('error', e => {
    throw e;
  });