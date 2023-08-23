import { createMemo, type Component } from "solid-js";

import TodoList from "./TodoList";
import NewTodo from "./NewTodo";

import { collection, orderBy, query } from "firebase/firestore";
import { useFirestore } from "solid-firebase";
import { db } from "./index";

const App: Component<{}> = () => {
  const todosQuery = createMemo(() =>
    query(collection(db, "todos"), orderBy("createdAt", "desc"))
  );
  const todos = useFirestore(todosQuery);

  return (
    <main>
      <h1>solid-todo</h1>
      <hr />

      <NewTodo />
      <TodoList data={todos.data} />
    </main>
  );
};

export default App;
