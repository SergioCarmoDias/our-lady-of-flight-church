const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Safely check if USE_LOCAL is explicitly 'true' (trimming any accidental spaces)
        const useLocal = process.env.USE_LOCAL && process.env.USE_LOCAL.trim() === 'true';
        
        const dbURI = useLocal 
            ? process.env.MONGO_URI_LOCAL 
            : process.env.MONGO_URI_ATLAS;

        if (!dbURI) {
            throw new Error(`Database URI is undefined! Check your environment variables (USE_LOCAL: ${useLocal})`);
        }

        const conn = await mongoose.connect(dbURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
