import { signOut } from "firebase/auth";
import { useAuth } from "solid-firebase";
import { Component, Match, Switch } from "solid-js";

import Login from "./Login";
import { auth } from "./index";

const UserDisplay: Component<{}> = () => {
  const state = useAuth(auth);

  return (
    <Switch fallback={<Login />}>
      <Match when={state.loading}>
        <p>Loading...</p>
      </Match>
      <Match when={state.error}>
        <Login />
      </Match>
      <Match when={state.data}>
        <section class="pb-2">
          <p>
            Logged in as: <code>{state.data?.displayName}</code>
          </p>
          <p>
            uid: <code>{state.data?.uid}</code>
          </p>
          <button class="mt-1 btn" onClick={() => signOut(auth)}>
            Sign Out
          </button>
        </section>
      </Match>
    </Switch>
  );
};

export default UserDisplay;
