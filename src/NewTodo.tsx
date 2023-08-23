import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Component } from "solid-js";
import { db } from ".";

const NewTodo: Component<{}> = () => {
  function addTodo(data: FormData): void {
    const text: string | undefined = data.get("text")?.toString();
    console.log(text);
    if (!text) return;
    addDoc(collection(db, "todos"), {
      text: text,
      done: false,
      createdAt: serverTimestamp(),
    });
    console.log("done");
  }

  let formRef: HTMLFormElement;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (formRef) {
      const formData = new FormData(formRef);
      addTodo(formData);
    }
  };

  return (
    <form onSubmit={(e: Event) => handleSubmit(e)} ref={(el) => (formRef = el)}>
      <input type="text" name="text" placeholder="something to do..." />
      <button type="submit">Add</button>
    </form>
  );
};

export default NewTodo;
