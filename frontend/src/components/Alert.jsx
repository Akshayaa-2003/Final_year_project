import "./Alert.css";

export default function Alert({ type = "success", message }) {
  if (!message) return null;

  return (
    <div className={`alert ${type}`}>
      {message}
    </div>
  );
}
