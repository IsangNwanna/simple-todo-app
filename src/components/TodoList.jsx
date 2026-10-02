import TodoItem from './TodoItem.jsx';

export default function TodoList({ todos, loading, filter, onToggle, onDelete }) {
  if (loading) return <div className="list-state" role="status"><span className="loader" />Gathering your tasks…</div>;
  if (todos.length === 0) {
    const message = filter === 'active' ? 'All caught up. Nothing left to do.' : filter === 'completed' ? 'Completed tasks will show up here.' : 'A fresh start. Add your first task above.';
    return <div className="empty-state"><span className="empty-icon" aria-hidden="true">✳</span><p>{message}</p><small>Keep it simple. One step at a time.</small></div>;
  }
  return <ul className="todo-list">{todos.map((todo) => <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />)}</ul>;
}
