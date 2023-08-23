import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Component, createSignal } from "solid-js";
import { db } from ".";

const NewTodo: Component<{}> = () => {
  const [inputValue, setInputValue] = createSignal<string>("");

  let formRef: HTMLFormElement;

  function addTodo(data: FormData): void {
    const text: string | undefined = data.get("text")?.toString();
    if (!text) return;
    addDoc(collection(db, "todos"), {
      text: text,
      done: false,
      createdAt: serverTimestamp(),
    });
    console.log("done");
  }

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (formRef) {
      const formData = new FormData(formRef);
      addTodo(formData);
    }
    setInputValue("");
  };

  return (
    <form
      onSubmit={(e: Event) => handleSubmit(e)}
      ref={(el) => (formRef = el)}
      class="pb-3"
    >
      <input
        class="border-2 rounded-lg border-gray-400"
        type="text"
        name="text"
        placeholder="something to do..."
        value={inputValue()}
        onInput={(e) => setInputValue(e.currentTarget.value)}
        autofocus
      />
      <button class="pl-4" type="submit">
        Add
      </button>
    </form>
  );
};

export default NewTodo;
