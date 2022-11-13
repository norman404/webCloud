const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')

const sequelize = new Sequelize('d4dl7sd5b04fnk', 'cstlrhkxxrhjaw', '67b5a3f2503082c9a5c70a2a73b2a211b91414ae864c69c8b234fb0b92535405', {
    host: 'ec2-54-163-34-107.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
    },
})

const Todo = sequelize.define('task', {
    task: DataTypes.TEXT,
    status: DataTypes.INTEGER
}, {
    timestamps: false
})

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.use(express.static('public'))

app.get('/', async (req, res) => {
    const todos = await Todo.findAll()
    res.render('index', { todos })
})

app.post('/addTask', async (req, res) => {
    const { textTodo } = req.body
    console.log(textTodo)
    const newTask = await Todo.create({ task: textTodo })
    res.redirect('/')
})
app.put('/moveTaskDone', async (req, res) => {
    const { name, id } = req.body
    if (name === 'todo') {
        await Todo.update({status: 1}, { where: { id }})
    } else  {
        await Todo.update({status: 0}, { where: { id }})
    }
})

app.listen(8080, async () => {
    await sequelize.authenticate()
    console.log('App is running on port 8080')
})