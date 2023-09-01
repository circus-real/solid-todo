import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Component } from "solid-js";
import { auth } from "./index";

const Login: Component<{}> = () => {
  return (
    <div class="mb-2">
      <button
        class="btn"
        onClick={() => signInWithPopup(auth, new GoogleAuthProvider())}
      >
        Sign in with Google
      </button>
    </div>
  );
};

export default Login;
