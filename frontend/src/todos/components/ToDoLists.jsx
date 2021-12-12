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
import { ToDoListForm } from './ToDoListForm'
import CloudDoneIcon from '@material-ui/icons/CloudDone';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import axios from "axios";
import { ListItemSecondaryAction } from '@material-ui/core'

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
      {isSaving ? <AutorenewIcon /> : <CloudDoneIcon />}
      <span style={{padding: "0 10px", fontWeight: "bold"}}>
      {isSaving ? "Sparar..." : "Sparat"}
      </span>
    </span>
  )
}

export const ToDoLists = ({ style }) => {
  const [toDoLists, setToDoLists] = useState({})
  const [activeList, setActiveList] = useState()
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    getPersonalTodos()
    .then(setToDoLists)
  }, [])

  const saveTodoList = async (id, todos) => {
    await axios.put("/save", {
      id,
      items: todos,
    });
    setIsSaving(false)
  }

  if (!Object.keys(toDoLists).length) return null
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
          My ToDo Lists
        </Typography>
        <List>
          {Object.keys(toDoLists).map((key) => <ListItem
            key={key}
            button
            onClick={() => setActiveList(key)}
          >
            <ListItemIcon>
              <ReceiptIcon />
            </ListItemIcon>
            <ListItemText primary={toDoLists[key].title} />
          </ListItem>)}
        </List>
      </CardContent>
    </Card>
    {toDoLists[activeList] && <ToDoListForm
      key={activeList} // use key to make React recreate component to reset internal state
      toDoList={toDoLists[activeList]}
      setIsSaving={setIsSaving}
      saveToDoList={(id, { todos }) => {
        saveTodoList(id, todos)
        const listToUpdate = toDoLists[id]
        setToDoLists({
          ...toDoLists,
          [id]: { ...listToUpdate, todos }
        })
      }}
    />}
  </Fragment>
}
