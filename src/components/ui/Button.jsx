import './Button.css';

export default function Button({ children, variant = 'primary', onClick, type = 'button', disabled = false, fullWidth = false }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
