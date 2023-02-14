import classes from "./profile-form.module.css";
import { useRef } from "react";

function ProfileForm() {
  const newPasswordInput = useRef();
  const oldPasswordInput = useRef();

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify({
        newPassword: newPasswordInput.current.value,
        oldPassword: oldPasswordInput.current.value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <form className={classes.form} onSubmit={formSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={newPasswordInput} />
      </div>
      <div className={classes.control}>
        <label htmlFor="old-password">Old Password</label>
        <input type="password" id="old-password" ref={oldPasswordInput} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
