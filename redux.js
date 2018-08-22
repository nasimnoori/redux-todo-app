//this helper function generates ids
function generateId () {
  return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

/* The redux createStore function works the same as our function

function createStore (reducer) {
  // The store should have four parts
  // 1. The state
  // 2. Get the state.
  // 3. Listen to changes on the state.
  // 4. Update the state

  let state
  let listeners = []

  const getState = () => state

  const subscribe = (listener) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    }
  }

  const dispatch = (action) => {
    state = reducer(state, action);
    listeners.forEach((listener) => listener());
  }

  return {
    getState,
    subscribe,
    dispatch,
  }
}
*/

// App Code
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'
const RECEIVE_DATA = 'RECEIVE_DATA'

function addTodoAction (todo) {
  return {
    type: ADD_TODO,
    todo,
  }
}

function removeTodoAction (id) {
  return {
    type: REMOVE_TODO,
    id,
  }
}

function toggleTodoAction (id) {
  return {
    type: TOGGLE_TODO,
    id,
  }
}

function addGoalAction (goal) {
  return {
    type: ADD_GOAL,
    goal,
  }
}

function removeGoalAction (id) {
  return {
    type: REMOVE_GOAL,
    id,
  }
}

function receiveDataAction (todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals,
  }
}

function handleDeleteTodo (todo) {
  return (dispatch) => {
    dispatch(removeTodoAction(todo.id))

    return API.deleteTodo(todo.id)
      .catch(() => {
        dispatch(addTodoAction(todo))
        alert('An error occurred. Try again.')
      })
  }
}

function handleAddGoal (name, cb) {
  return (dispatch) => {
    return API.saveGoal(name).then((goal) => {
      dispatch(addGoalAction(goal))
      cb()
    })
    .catch(() => {
      alert('An error occurred. Try again.')
    })
  }
}

function handleDeleteGoal (goal) {
  return (dispatch) => {
    dispatch(removeGoalAction(goal.id))

    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoalAction(goal))
      alert('An error occurred. Try again.')
    })
  }
}

function handleAddTodo (name, cb) {
  return (dispatch) => {
    return API.saveTodo(name).then((todo) => {
      dispatch(addTodoAction(todo))
      cb()
    })
    .catch(() => {
      alert('An error occurred. Try again.')
    })
  }
}

function handleToggle (id) {
  return (dispatch) => {
    dispatch(toggleTodoAction(id))
    return API.saveTodoToggle(id).catch(() => {
      dispatch(toggleTodoAction(id))
      alert('An error occurred. Try again.')
    })
  }
}

function handleInitialData () {
  return (dispatch) => {
    return Promise.all([
      API.fetchTodos(),
      API.fetchGoals()
    ]).then(([ todos, goals ]) => {
      dispatch(receiveDataAction(todos, goals))
    })
  }
}

//todo Reducer
function todos (state = [], action) {
  switch(action.type) {
    case ADD_TODO :
      return state.concat([action.todo])
    case REMOVE_TODO :
      return state.filter((todo) => todo.id !== action.id)
    case TOGGLE_TODO :
      return state.map((todo) => todo.id !== action.id ? todo :
        Object.assign({}, todo, { complete: !todo.complete }))
    case RECEIVE_DATA :
      return action.todos
    default :
      return state
  }
}

//goals reducer
function goals (state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal])
    case REMOVE_GOAL:
      return state.filter((goal) => goal.id !== action.id)
    case RECEIVE_DATA :
      return action.goals
    default:
      return state
  }
}

function loading (state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA :
      return false
    default :
      return state
  }
}

/*when using the redux library we do not to create this combining function
we can use redux's combineReducers function which works the same\

function app (state = {}, action) {
  return {
    todos: todos(state.todos, action),
    goals: goals(state.goals, action),
  }
}
*/
//this function validate data and is passed as argument to the middleware
//which it self is a second arguemtn to createStore
const checker = (store) => (next) => (action) => {
  if (
    action.type === ADD_TODO &&
    action.todo.name.toLowerCase().includes('bitcoin')
  ) {
    return alert('Nope!! that is a bad idea')
  }

  if (
    action.type === ADD_GOAL &&
    action.goal.name.toLowerCase().includes('bitcoin')
  ) {
    return alert('Nope!! that is a bad idea')
  }

  return next(action)
}

const logger = (store) => (next) => (action) => {
  console.group(action.type)
    console.log('the action is: ', action)
    const result = next(action)
    console.log('the new state: ', store.getState())
  console.groupEnd()
  return result
}

const store = Redux.createStore(Redux.combineReducers({
  todos,
  goals,
  loading,
}), Redux.applyMiddleware(ReduxThunk.default, checker, logger));



/*
store.subscribe(() => {
  const { goals, todos } = store.getState();
  //console.log('The new state is: ', store.getState())

  //restore DOM after each click, this will prevent items from adding again
  document.getElementById('todos').innerHTML = '';
  document.getElementById('goals').innerHTML = '';

  goals.forEach(addGoalToDOM);
  todos.forEach(addTodoToDOM);
})
*/

/* This commented code manually adds todos and goals
store.dispatch(addTodoAction({
  id: 0,
  name: 'Walk the dog',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 1,
  name: 'Wash the car',
  complete: false,
}))

store.dispatch(addTodoAction({
  id: 2,
  name: 'Go to the gym',
  complete: true,
}))

store.dispatch(removeTodoAction(1))

store.dispatch(toggleTodoAction(0))

store.dispatch(addGoalAction({
  id: 0,
  name: 'Learn Redux'
}))

store.dispatch(addGoalAction({
  id: 1,
  name: 'Lose 20 pounds'
}))

store.dispatch(removeGoalAction(0))

*/
/*
//this function adds todo from the UI
function addTodo () {
  const input = document.getElementById('todo')
  const name = input.value
  input.value = ''

  store.dispatch(addTodoAction({
    name,
    complete: false,
    id: generateId()
  }))
}

//this function adds goals from the UI
function addGoal () {
  const input = document.getElementById('goal')
  const name = input.value
  input.value = ''

  store.dispatch(addGoalAction({
    id: generateId(),
    name
  }))
}

//when todo btn clicked run the function
document.getElementById('todoBtn').addEventListener('click', addTodo)

//when todo btn clicked the the function
document.getElementById('goalBtn').addEventListener('click', addGoal)

//creats button
function createRemoveButton (onClick) {
      const removeBtn = document.createElement('button')
      removeBtn.innerHTML = 'X'
      removeBtn.addEventListener('click', onClick)
      return removeBtn
    }

//adds a new todo to DOM, we will call this function up in the subscribe function
function addTodoToDOM (todo) {
  const node = document.createElement('li')
  const text = document.createTextNode(todo.name)

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeTodoAction(todo.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  node.style.textDecoration = todo.complete ? 'line-through' : 'none'
  node.addEventListener('click', () => {
    store.dispatch(toggleTodoAction(todo.id))
  })

  document.getElementById('todos').appendChild(node)
}

//add new goal to DOM
function addGoalToDOM (goal) {
  const node = document.createElement('li')
  const text = document.createTextNode(goal.name)

  const removeBtn = createRemoveButton(() => {
    store.dispatch(removeGoalAction(goal.id))
  })

  node.appendChild(text)
  node.appendChild(removeBtn)

  document.getElementById('goals').appendChild(node)
}
*/
