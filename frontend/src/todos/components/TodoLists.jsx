import React, { Fragment, useState, useEffect } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ReceiptIcon from '@material-ui/icons/Receipt'
import Typography from '@material-ui/core/Typography'
import { TodoListForm } from './TodoListForm'
import CloudDoneOutlinedIcon from '@material-ui/icons/CloudDoneOutlined';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import axios from "axios";

const getPersonalTodos = () => {
  return axios.get("/todos")
  .then(result => {
    return Promise.resolve(result.data)
  })
  .catch(err => {
    // TODO
  })
}

// Google Drive:ish save indicator
const SavingIndicator = ({ isSaving }) => {
  return (
    <span style={{display: "flex", alignItems: "center"}}>
      {isSaving ? <AutorenewIcon /> : <CloudDoneOutlinedIcon />}
      <span style={{padding: "0 10px", fontWeight: "bold"}}>
      {isSaving ? "Saving ..." : "Saved"}
      </span>
    </span>
  )
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    getPersonalTodos()
    .then(setTodoLists)
  }, [])

  const saveTodoList = async (id, todos) => {
    await axios.put("/save", {
      id,
      items: todos,
    });
    setIsSaving(false)
  }

  if (!Object.keys(todoLists).length) return null
  return <Fragment>
    <Card style={style}>
      <CardHeader
        title="My ToDo Lists"
        subheader={<SavingIndicator isSaving={isSaving} />}
      />
      <CardContent>
        <Typography
          component='h2'
        >
          My Todo Lists
        </Typography>
        <List>
          {Object.keys(todoLists).map((key) => <ListItem
            key={key}
            button
            onClick={() => setActiveList(key)}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={todoLists[key].title} />
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {todoLists[activeList] && <TodoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      todoList={todoLists[activeList]}
      setIsSaving={setIsSaving}
      saveTodoList={(id, { todos }) => {
        saveTodoList(id, todos)
        const listToUpdate = todoLists[id]
        setTodoLists({
          ...todoLists,
          [id]: { ...listToUpdate, todos }
        })
      }}
    />}
  </Fragment>
}
