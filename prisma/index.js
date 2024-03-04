const express = require('express');
const prisma = require("./prisma/prisma.config")



const app = express();

app.use(express.json());

const userRoutes = require('./routes/user_routes');
const blogRoutes = require('./routes/blog_routes');
const commentRoutes = require('./routes/comment_routes');

app.use('/', userRoutes);
app.use('/', blogRoutes);
app.use('/', commentRoutes);
prisma.$connect()
    .then(() => {
        console.log('Connected to the database');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to the database:', error);
    });

// Close Prisma client on application exit
process.on('beforeExit', async () => {
    await prisma.$disconnect();
});
