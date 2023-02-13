import { useState, useRef } from "react";
import classes from "./auth-form.module.css";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

function AuthForm() {
  const emailInput = useRef();
  const passwordInput = useRef();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: emailInput.current.value,
        password: passwordInput.current.value,
      });
      if (!result.error) {
        router.replace("/");
      }
    } else {
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({
            email: emailInput.current.value,
            password: passwordInput.current.value,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        console.log(result);
        if (!response.ok) {
          throw new Error(result.message || "Something went wrong!");
        }
      } catch (error) {
        console.log(error.message);
      }
    }
  };
  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={formSubmitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" required ref={emailInput} />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" required ref={passwordInput} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
