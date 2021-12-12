/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { TextField, Card, CardContent, CardActions, Button, Typography} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import AddIcon from '@material-ui/icons/Add'
import useIsMount from '../../hooks/useIsMount';

const useStyles = makeStyles({
  card: {
    margin: '1rem'
  },
  todoLine: {
    display: 'flex',
    alignItems: 'center'
  },
  textField: {
    flexGrow: 1
  },
  standardSpace: {
    margin: '8px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
})

export const TodoListForm = ({ todoList, saveTodoList, setIsSaving }) => {
  const classes = useStyles()
  const [todos, setTodos] = useState(todoList.todos)

  const isMount = useIsMount();

  const handleSubmit = event => {
    event.preventDefault()
    submit()
  }

  const submit = () => {
    saveTodoList(todoList.id, { todos })
  }

  // Autosave
  // Doesn't work if you for example switch list too fast
  // Could be fixed by autosaving all todo lists and not just the one you are at.
  useEffect(() => {
    // Do not save when mounting
    if (isMount) return;

    setIsSaving(true)

    const timeout = setTimeout(() => {
      submit()
    }, 1000)

    return () => clearTimeout(timeout)
  }, [todos])

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography component='h2'>
          {todoList.title}
        </Typography>
        <form onSubmit={handleSubmit} className={classes.form}>
          {todos.map((todo, index) => (
            <div key={index} className={classes.todoLine}>
              <Typography className={classes.standardSpace} variant='h6'>
                {index + 1}
              </Typography>
              <TextField
                label='What to do?'
                value={todo.content}
                disabled={todo.complete}
                onChange={event => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    { content: event.target.value, complete: todos[index].complete ?? false },
                    ...todos.slice(index + 1)
                  ])
                }}
                className={classes.textField}
              />
              <Button
                size='small'
                color='primary'
                className={classes.standardSpace}
                onClick={() => {
                  setTodos([ // immutable update
                    ...todos.slice(0, index),
                    { ...todos[index], complete: !todos[index].complete },
                    ...todos.slice(index + 1)
                  ])
                }}
              >
                {todos[index].complete ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
              </Button>
              <Button
                size='small'
                color='secondary'
                className={classes.standardSpace}
                onClick={() => {
                  setTodos([ // immutable delete
                    ...todos.slice(0, index),
                    ...todos.slice(index + 1)
                  ])
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          ))}
          <CardActions>
            <Button
              type='button'
              color='primary'
              onClick={() => {
                setTodos([...todos, ''])
              }}
            >
              Add Todo <AddIcon />
            </Button>
            <Button type='submit' variant='contained' color='primary'>
              Save
            </Button>
          </CardActions>
        </form>
      </CardContent>
    </Card>
  )
}
