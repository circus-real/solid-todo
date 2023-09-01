import { For, type Component } from "solid-js";

import Todo from "./Todo";
import { DocumentData } from "firebase/firestore";

const TodoList: Component<{ data: DocumentData[] }> = (props: {
  data: DocumentData[];
}) => {
  return (
    <section>
      <ul>
        <For each={props.data} fallback={<div>Empty</div>}>
          {(item) => <Todo todo={item} />}
        </For>
      </ul>
    </section>
  );
};

export default TodoList;
