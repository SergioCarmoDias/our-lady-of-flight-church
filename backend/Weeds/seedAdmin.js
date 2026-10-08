const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Define a simple Admin Schema (or import your existing model)
const adminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.USE_LOCAL === 'true' ? process.env.MONGO_URI_LOCAL : process.env.MONGO_URI_ATLAS);
        console.log('Connected to Database for Seeding...');

        // Check if an admin already exists
        const existingAdmin = await Admin.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists. Skipping seed.');
            process.exit(0);
        }

        // Hash the initial password securely
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('YourSecurePassword123', salt);

        // Create the first admin
        await Admin.create({
            username: 'admin',
            password: hashedPassword
        });

        console.log('First admin user created successfully!');
        console.log('Username: admin');
        console.log('Password: YourSecurePassword123');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();