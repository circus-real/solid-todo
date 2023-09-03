import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Component, createSignal } from "solid-js";
import { auth, db } from "./index";
import { useAuth } from "solid-firebase";

const NewTodo: Component<{}> = () => {
  const [inputValue, setInputValue] = createSignal<string>("");
  const user = useAuth(auth);

  let formRef: HTMLFormElement;

  async function addTodo(data: FormData): Promise<void> {
    const text: string = data.get("text")?.toString()!;
    const docRef = await addDoc(collection(db, "todos"), {
      uid: user.data?.uid,
      uname: user.data?.displayName,
      text: text,
      done: false,
      createdAt: serverTimestamp(),
    });
    addDoc(collection(db, "todos", docRef.id, "logs"), {
      text: "todo created",
      user: auth.currentUser?.displayName,
      timestamp: serverTimestamp(),
    });
  }

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (formRef) {
      addTodo(new FormData(formRef) as FormData);
    }
    setInputValue("");
  }

  return (
    <form
      onSubmit={(e: Event) => handleSubmit(e)}
      ref={(el) => (formRef = el)}
      class="pb-1"
    >
      <input
        class="btn pr-4 md:pr-8 lg:pr-12"
        type="text"
        name="text"
        placeholder="something to do..."
        value={inputValue()}
        onInput={(e) => setInputValue(e.currentTarget.value)}
        autofocus
      />
      <button class="btn ml-2" type="submit">
        Add
      </button>
    </form>
  );
};

export default NewTodo;
