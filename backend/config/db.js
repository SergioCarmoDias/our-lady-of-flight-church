const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const dbURI = process.env.USE_LOCAL === 'true' 
            ? process.env.MONGO_URI_LOCAL 
            : process.env.MONGO_URI_ATLAS;

        const conn = await mongoose.connect(dbURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};

module.exports = connectDB;