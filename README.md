# redux-todo-app
This simple app shows how the redux createStore() function was created, and how we will use it.
in the madeup-redux.js file we created our own createStore() function which works exactly the same as the redux createStore function. then in the Redux.js file we are using Redux's createStore function. in both cases our app's functionality is the same.
notice that when using redux library we have to download the library in the head section of our html document (index.html)
and when using the createStore function we have to call Redux.createStore() and so on.
also notice that we are no longer using our created app function which combines both of our reducers instead we use redux combineReducers() function and pass it our tow reducers that we want to combine.
