import './EmptyState.css';

function EmptyState({ title = "No items found", message = "We couldn't find anything matching your criteria.", actionText, onAction }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">📂</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionText && onAction && (
        <button className="btn btn-secondary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
