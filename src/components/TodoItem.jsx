export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className={`todo-item ${todo.completed ? 'is-complete' : ''}`}>
      <button className="check-button" type="button" onClick={() => onToggle(todo)} aria-label={todo.completed ? `Mark ${todo.title} as active` : `Mark ${todo.title} as complete`} aria-pressed={todo.completed}>
        {todo.completed && <span aria-hidden="true">✓</span>}
      </button>
      <span className="todo-title">{todo.title}</span>
      <button className="delete-button" type="button" onClick={() => onDelete(todo.id)} aria-label={`Delete ${todo.title}`} title="Delete task">×</button>
    </li>
  );
}
