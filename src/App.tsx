import { createMemo, type Component, Match, Switch } from "solid-js";

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
      <NewTodo />
      <Switch>
        <Match when={todos.loading}>
          <p>Loading...</p>
        </Match>
        <Match when={todos.error}>
          <p>An error occured: {todos.error?.message}</p>
        </Match>
        <Match when={todos.data}>
          <TodoList data={todos.data} />
        </Match>
      </Switch>
    </main>
  );
};

export default App;
