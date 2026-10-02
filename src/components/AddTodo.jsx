import { useState } from 'react';

export default function AddTodo({ onAdd, disabled }) {
  const [title, setTitle] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const value = title.trim();
    if (!value || disabled) return;
    await onAdd(value);
    setTitle('');
  }

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <span className="input-plus" aria-hidden="true">＋</span>
      <label className="sr-only" htmlFor="new-task">Add a new task</label>
      <input id="new-task" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What needs your attention?" maxLength={120} />
      <button className="add-button" type="submit" disabled={disabled || !title.trim()}>Add task <span aria-hidden="true">↗</span></button>
    </form>
  );
}
