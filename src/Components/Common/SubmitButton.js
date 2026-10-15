import styles from "./submitButton.module.css";

function SubmitButton({ submitform, disabled, text, buttonStyle }) {
  const submitForm = (e) => {
    e.preventDefault();
    if (!disabled) {
      submitform();
    }
  };
  return (
    <button
      type="submit"
      onClick={submitForm}
      name={text}
      value={text}
      className={buttonStyle}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default SubmitButton;
