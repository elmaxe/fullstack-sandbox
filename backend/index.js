const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()

app.use(cors())
// Parse requests with Content-Type: application/json
app.use(express.json())
// Logging
app.use(morgan("dev"))

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

// TODO: validate request body
app.put("/save", (req, res) => {
    const { id, items } = req.body;

    if (!todos[id]) return res.sendStatus(400);

    todos[id] = {
        id,
        title: todos[id].title,
        todos: items,
    }

    return res.sendStatus(200)
})

app.get("/todos", (_, res) => {
    return res.json(todos);
})

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
