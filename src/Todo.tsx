import {
  DocumentData,
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Accessor, Component, Show, createSignal } from "solid-js";
import { db } from "./index";

const Todo: Component<{ todo: DocumentData }> = (props) => {
  const [done, setDone] = createSignal<boolean>(props.todo.done);
  const bgColor: Accessor<string> = () =>
    done() ? "bg-green-300" : "bg-red-300";

  async function toggle(): Promise<void> {
    const todoRef = doc(db, "todos", props.todo.id);
    const todoSnap: DocumentSnapshot = await getDoc(todoRef);
    const newDone: boolean | undefined = !todoSnap.get("done");
    updateDoc(todoRef, {
      done: newDone,
    });

    setDone(!done());
  }

  function remove(): void {
    const todoRef = doc(db, "todos", props.todo.id);
    deleteDoc(todoRef);
  }

  return (
    <li class={bgColor()}>
      <div class="p-2">
        <p>{props.todo.text}</p>
        <button onClick={toggle}>
          <Show when={props.todo.done} fallback="❌">
            ✔️
          </Show>
        </button>
        <button onClick={remove}>🗑</button>
      </div>
    </li>
  );
};

export default Todo;
