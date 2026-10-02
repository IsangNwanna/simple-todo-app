import { useEffect, useMemo, useState } from 'react';
import AddTodo from './components/AddTodo.jsx';
import TodoList from './components/TodoList.jsx';

const API = '/api/todos';

async function request(url, options) {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Something went wrong. Please try again.');
  }
  return response.status === 204 ? null : response.json();
}

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    request(API)
      .then((items) => { if (active) setTodos(items); })
      .catch((err) => { if (active) setError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const remaining = todos.filter((todo) => !todo.completed).length;
  const visibleTodos = useMemo(() => todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  }), [todos, filter]);

  async function addTodo(title) {
    setBusy(true); setError('');
    try {
      const todo = await request(API, { method: 'POST', body: JSON.stringify({ title }) });
      setTodos((current) => [todo, ...current]);
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function toggleTodo(todo) {
    setBusy(true); setError('');
    try {
      const updated = await request(`${API}/${todo.id}`, {
        method: 'PUT', body: JSON.stringify({ completed: !todo.completed }),
      });
      setTodos((current) => current.map((item) => item.id === updated.id ? updated : item));
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  async function deleteTodo(id) {
    setBusy(true); setError('');
    try {
      await request(`${API}/${id}`, { method: 'DELETE' });
      setTodos((current) => current.filter((todo) => todo.id !== id));
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Daymark home"><span className="brand-mark">d.</span><span>daymark</span></a>
        <span className="topbar-note">A little more clarity, every day</span>
      </header>

      <section className="workspace" id="top" aria-labelledby="page-title">
        <div className="intro">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL SPACE</div>
          <h1 id="page-title">Make room for<br /><em>what matters.</em></h1>
          <p className="subtitle">One thing at a time. You’ve got this.</p>
        </div>

        <div className="todo-card">
          <div className="card-heading">
            <div><p className="section-kicker">THE LIST</p><h2>Today’s tasks</h2></div>
            <div className="count-badge" aria-label={`${remaining} tasks remaining`}><span>{String(remaining).padStart(2, '0')}</span><small>LEFT</small></div>
          </div>

          <AddTodo onAdd={addTodo} disabled={busy} />
          {error && <p className="error-message" role="alert">{error}</p>}

          <div className="list-toolbar">
            <span className="list-label">YOUR TASKS <span className="total-count">{todos.length}</span></span>
            <div className="filters" aria-label="Filter tasks">
              {['all', 'active', 'completed'].map((item) => <button key={item} type="button" className={`filter ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}</button>)}
            </div>
          </div>

          <TodoList todos={visibleTodos} loading={loading} filter={filter} onToggle={toggleTodo} onDelete={deleteTodo} />

          <footer className="card-footer"><span><span className="footer-spark">✳</span> Small steps still move you forward.</span><span className="footer-count">{remaining} {remaining === 1 ? 'task' : 'tasks'} remaining</span></footer>
        </div>

        <p className="page-note">A clear mind starts with a simple list.</p>
      </section>
    </main>
  );
}
