const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
// Parse requests with Content-Type: application/json
app.use(express.json())

const PORT = 3001

const todos = {
    1: {
        id: 1,
        title: 'First List',
        todos: [
            { content: 'First todo of first list!', complete: false },
            { content: 'Hello from backend', complete: false }
        ],
    },
    2: {
        id: 2,
        title: 'Second List',
        todos: [
            { content: 'First todo of second list!', complete: false },
        ],
    },
};

// ID generator
let nextId = Object.keys(todos).length === 0 ? 1 : Math.max(...Object.keys(todos));

app.put("/save", (req, res) => {
    console.log(req.body)
    const { id, items } = req.body;

    console.log(todos)

    if (!todos[id]) return res.sendStatus(400);

    todos[id] = {
        id,
        title: todos[id].title,
        todos: items,
    }

    return res.sendStatus(200)
})

app.post("/add", (req, res) => {
    const { todo } = req.body;

    if (!todo) {
        return res.status(400).send("No todo list provided.");
    }

    todos[nextId] = {
        id: nextId,
        ...todo
    }

    nextId++;

    res.sendStatus(201);
})

app.get("/todos", (_, res) => {
    return res.json(todos);
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
