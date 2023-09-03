import {
  DocumentData,
  DocumentSnapshot,
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import {
  Accessor,
  Component,
  For,
  Match,
  Show,
  Switch,
  createResource,
  createSignal,
} from "solid-js";
import { auth, db } from "./index";
import { useAuth, useFirestore } from "solid-firebase";

const Todo: Component<{ todo: DocumentData }> = (props) => {
  const [done, setDone] = createSignal<boolean>(props.todo.done);
  const [text, setText] = createSignal<string>(done() ? "✔️" : "❌");
  const [show, setShow] = createSignal<boolean>(false);
  const bgColor: Accessor<string> = () =>
    done() ? "bg-green-800" : "bg-red-800";
  const codeBgColor: Accessor<string> = () =>
    done() ? "bg-green-900" : "bg-red-900";
  const logQuery = query(
    collection(db, "todos", props.todo.id, "logs"),
    orderBy("timestamp", "desc"),
    limit(10)
  );

  const [logs] = createResource(show, () => useFirestore(logQuery), {
    initialValue: useFirestore(logQuery),
  });

  async function toggle(): Promise<void> {
    const todoRef = doc(db, "todos", props.todo.id);
    const todoSnap: DocumentSnapshot = await getDoc(todoRef);
    const newDone: boolean = !todoSnap.get("done")!;
    await updateDoc(todoRef, {
      done: newDone,
    });
    setDone(!done());
    addDoc(collection(db, "todos", props.todo.id, "logs"), {
      text: `toggled to ${done() ? "complete" : "incomplete"}`,
      user: auth.currentUser?.displayName,
      timestamp: serverTimestamp(),
    });

    setText(done() ? "✔️" : "❌");
  }

  function remove(): void {
    const batch = writeBatch(db);

    useFirestore(collection(db, "todos", props.todo.id, "logs")).data?.forEach(
      (log: DocumentData) => {
        batch.delete(doc(db, "todos", props.todo.id, "logs", log.id));
      }
    );
    batch.commit().then(() => {
      deleteDoc(doc(db, "todos", props.todo.id));
    });
  }

  function toDate(timestamp: Timestamp): Date {
    return Timestamp.fromMillis(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    ).toDate();
  }

  function formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${month}:${day}:${hour}:${minute}`;
  }

  function getLogUser(item: DocumentData): string {
    return item.user || "anon";
  }

  return (
    <li class="mb-1 pb-2 bg-gray-700 rounded-md">
      <section class={`p-2 rounded-md ${bgColor()}`}>
        <p>
          <button onClick={toggle}>{text()}</button>
          <button class="pr-2 pl-1" onClick={remove}>
            🗑
          </button>
          {props.todo.text}
          <br />
          Added by: <code class={`${codeBgColor()}`}>{props.todo.uname}</code>
        </p>
      </section>
      <button class="pl-2 pt-2" onClick={() => setShow(!show())}>
        <span class="inline-flex items-center">
          <svg
            class="h-4"
            classList={{ "rotate-90": show() }}
            width="35"
            height="40"
            viewBox="0 0 35 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M33.5 17.4019C35.5 18.5566 35.5 21.4434 33.5 22.5981L5 39.0526C3 40.2073 0.5 38.7639 0.5 36.4545L0.5 3.54552C0.5 1.23612 3 -0.207259 5 0.947442L33.5 17.4019Z"
              fill="#6B7280"
            />
          </svg>
          <p class="btn">Show logs</p>
        </span>
      </button>
      <Show when={show()}>
        <Switch>
          <Match when={logs.loading}>
            <p>Loading...</p>
          </Match>
          <Match when={logs.error}>
            <p>
              An error has occurred:
              <br />
              <code>{logs.error?.message}</code>
            </p>
          </Match>
          <Match when={logs.state === "ready"}>
            <section class="px-2">
              <p>
                <code>mm:dd:hh:mm</code> as month, day, hour, minute:
              </p>
              <ul>
                <For each={logs().data} fallback={<p>No logs.</p>}>
                  {(item) => (
                    <li>
                      <p>
                        <code>{formatDate(toDate(item.timestamp))}</code> |{" "}
                        {item.text} by {getLogUser(item)}
                      </p>
                    </li>
                  )}
                </For>
              </ul>
            </section>
          </Match>
        </Switch>
      </Show>
    </li>
  );
};

export default Todo;
