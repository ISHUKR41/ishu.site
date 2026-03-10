/**
 * mongodb.js — MongoDB Connection Utility
 * 
 * Establishes and manages the MongoDB connection using Mongoose.
 * Reads MONGODB_URI from environment variables.
 * Implements connection caching to avoid multiple connections in development.
 */

const mongoose = require('mongoose');

// Cache the connection to avoid reconnecting on every request
let isConnected = false;

/**
 * connectDB - Connect to MongoDB Atlas (or local MongoDB)
 * Call this once at server startup.
 */
const connectDB = async () => {
    if (isConnected) {
        console.log('📊 MongoDB: Using existing connection');
        return;
    }

    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        console.warn('⚠️  MongoDB: MONGODB_URI not set in .env — user features will be disabled');
        return;
    }

    try {
        const conn = await mongoose.connect(MONGODB_URI, {
            // Modern Mongoose 8.x doesn't need these options, but they're safe to include
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        isConnected = true;
        console.log(`✅ MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // Don't crash the server — PDF tools can still work without MongoDB
        console.warn('⚠️  Server will continue without MongoDB — user features disabled');
    }
};

module.exports = { connectDB };
