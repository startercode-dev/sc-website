const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
    console.log(err.name, '|', err.message);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// const DB = process.env.DATABASE_LOCAL;
const DB = process.env.DATABASE.replace(
    '<password>',
    process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', true);
const connectDB = async () => {
    try {
        mongoose.connect(DB, {
            useNewUrlParser: true,
        });
        console.log('Connected to DB');
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};

const port = process.env.PORT;
const server = connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Running at port ${port} ...`);
    });
});

process.on('unhandledRejection', (err) => {
    console.log(err.name, '|', err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down.');
    server.close(() => {
        console.log('Process terminated.');
    });
});
