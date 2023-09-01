import {
  Component,
  Match,
  Switch,
  createResource,
  createSignal,
  Show,
} from "solid-js";

import TodoList from "./TodoList";
import NewTodo from "./NewTodo";
import UserDisplay from "./UserDisplay";

import { collection, orderBy, query } from "firebase/firestore";
import { useFirestore } from "solid-firebase";
import { auth, db } from "./index";
import { User, onAuthStateChanged } from "firebase/auth";

const App: Component<{}> = () => {
  const [user, setUser] = createSignal<User | null>(auth.currentUser);

  const todosQuery = query(collection(db, "todos"), orderBy("createdAt"));

  const [todos, { refetch }] = createResource(
    user,
    () => useFirestore(todosQuery),
    {
      initialValue: useFirestore(todosQuery),
    }
  );

  onAuthStateChanged(auth, (u) => {
    setUser(u);
    refetch();
  });

  return (
    <main>
      <UserDisplay />

      <Show when={user()}>
        <NewTodo />
        <Switch>
          <Match when={todos.loading}>
            <p>Loading...</p>
          </Match>
          <Match when={todos.error}>
            <p>
              An error has occurred:
              <br />
              <code>{todos.error?.message}</code>
            </p>
          </Match>
          <Match when={todos.state === "ready"}>
            <TodoList data={todos().data!} />
          </Match>
        </Switch>
      </Show>
    </main>
  );
};

export default App;
