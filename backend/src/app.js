require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');
const cookieParser = require('cookie-parser');
const { syncDatabase } = require('./models');
const authMiddleware = require('../middleware/authMiddleware');

syncDatabase();

const app = express();
const port = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use(authMiddleware);
app.use('/users', userRouter);
app.use('/post', postRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
