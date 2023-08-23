import {
  DocumentData,
  DocumentSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { Component, Show } from "solid-js";
import { db } from "./index";

const Todo: Component<{ todo: DocumentData }> = (props) => {
  async function toggle(): Promise<void> {
    const todoRef = doc(db, "todos", props.todo.id);
    const todoSnap: DocumentSnapshot = await getDoc(todoRef);
    const newDone: boolean | undefined = !todoSnap.get("done");

    updateDoc(todoRef, {
      done: newDone,
    });
  }

  function remove(): void {
    const todoRef = doc(db, "todos", props.todo.id);
    deleteDoc(todoRef);
  }

  const colours = {
    "bg-green-300": props.todo.done,
    "bg-red-300": !props.todo.done,
  };

  return (
    <li classList={colours}>
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
