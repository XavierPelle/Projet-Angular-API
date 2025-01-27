require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');
const { syncDatabase } = require('./models');

syncDatabase();

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/users', userRouter);
app.use('/post', postRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
