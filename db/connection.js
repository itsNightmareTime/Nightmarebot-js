import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/swatbotdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

module.exports = mongoose.connection;