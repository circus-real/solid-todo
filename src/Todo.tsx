import {
  DocumentData,
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Accessor, Component, createSignal } from "solid-js";
import { db } from "./index";

const Todo: Component<{ todo: DocumentData }> = (props) => {
  const [done, setDone] = createSignal<boolean>(props.todo.done);
  const [text, setText] = createSignal<string>(`${done() ? "✔️" : "❌"}`);
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
    setText(done() ? "✔️" : "❌");
  }

  function remove(): void {
    const todoRef = doc(db, "todos", props.todo.id);
    deleteDoc(todoRef);
  }

  return (
    <li class={`${bgColor()} p-2 rounded-md mb-1`}>
      <div>
        <p>
          <button onClick={toggle}>{text()}</button>
          <button class="pr-2 pl-1" onClick={remove}>
            🗑
          </button>
          {props.todo.text}
        </p>
      </div>
    </li>
  );
};

export default Todo;
