import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function ListDDC() {
  const [items, setItems] = useState([]);
  const [dicts, setDicts] = useState({
    types: [], categories: [], subcategories: [], statuses: []
  });
  const [filters, setFilters] = useState({
    type: null,
    category: null,
    subcategory: null,
    status: null,
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    api.get('/api/ddc/')
      .then(({ data }) => setItems(data))
      .catch(console.error);

    Promise.all([
      api.get('/api/types/'),
      api.get('/api/categories/'),
      api.get('/api/subcategories/'),
      api.get('/api/statuses/'),
    ])
      .then(([rT, rC, rSC, rS]) => {
        setDicts({
          types:        rT.data,
          categories:   rC.data,
          subcategories:rSC.data,
          statuses:     rS.data,
        });
      })
      .catch(console.error);
  }, []);

  const typeMap   = useMemo(() => Object.fromEntries(dicts.types.map(t => [t.id, t.name])), [dicts.types]);
  const catMap    = useMemo(() => Object.fromEntries(dicts.categories.map(c => [c.id, c.name])), [dicts.categories]);
  const subcatMap = useMemo(() => Object.fromEntries(dicts.subcategories.map(s => [s.id, s.name])), [dicts.subcategories]);
  const statusMap = useMemo(() => Object.fromEntries(dicts.statuses.map(s => [s.id, s.name])), [dicts.statuses]);

  const toggleFilter = (field, value) =>
    setFilters(f => ({ ...f, [field]: f[field] === value ? null : value }));

  const filteredItems = useMemo(() => {
    return items.filter(d => {
      if (filters.type && d.type !== filters.type) return false;
      if (filters.category && d.category !== filters.category) return false;
      if (filters.subcategory && d.subcategory !== filters.subcategory) return false;
      if (filters.status && d.status !== filters.status) return false;

      if (filters.startDate) {
        const start = new Date(filters.startDate);
        if (new Date(d.date) < start) return false;
      }
      if (filters.endDate) {
        const end = new Date(filters.endDate + 'T23:59:59');
        if (new Date(d.date) > end) return false;
      }
      return true;
    });
  }, [items, filters]);

  const handleDelete = id => {
    if (!window.confirm('Удалить запись?')) return;
    api.delete(`/api/ddc/${id}/`)
      .then(() => setItems(prev => prev.filter(x => x.id !== id)))
      .catch(console.error);
  };

  const handleShowComment = comment => {
    window.alert(comment);
  };

  return (
    <div className="container mt-4">
      <h2>Все записи ДДС</h2>

      <div className="mb-3">
        <strong>Тип:</strong>{' '}
        {dicts.types.map(t => (
          <button key={t.id}
            className={`btn btn-sm me-1 ${
              filters.type === t.id ? 'btn-primary' : 'btn-outline-primary'
            }`}
            onClick={() => toggleFilter('type', t.id)}>
            {t.name}
          </button>
        ))}
        <button className="btn btn-sm btn-outline-secondary"
          onClick={() => setFilters(f => ({ ...f, type: null }))}>
          Сбросить
        </button>
      </div>

      <div className="mb-3">
        <strong>Категория:</strong>{' '}
        {dicts.categories.map(c => (
          <button key={c.id}
            className={`btn btn-sm me-1 ${
              filters.category === c.id ? 'btn-success' : 'btn-outline-success'
            }`}
            onClick={() => toggleFilter('category', c.id)}>
            {c.name}
          </button>
        ))}
        <button className="btn btn-sm btn-outline-secondary"
          onClick={() => setFilters(f => ({ ...f, category: null }))}>
          Сбросить
        </button>
      </div>

      <div className="mb-3">
        <strong>Подкатегория:</strong>{' '}
        {dicts.subcategories.map(sc => (
          <button key={sc.id}
            className={`btn btn-sm me-1 ${
              filters.subcategory === sc.id ? 'btn-warning' : 'btn-outline-warning'
            }`}
            onClick={() => toggleFilter('subcategory', sc.id)}>
            {sc.name}
          </button>
        ))}
        <button className="btn btn-sm btn-outline-secondary"
          onClick={() => setFilters(f => ({ ...f, subcategory: null }))}>
          Сбросить
        </button>
      </div>

      <div className="mb-3">
        <strong>Статус:</strong>{' '}
        {dicts.statuses.map(s => (
          <button key={s.id}
            className={`btn btn-sm me-1 ${
              filters.status === s.id ? 'btn-danger' : 'btn-outline-danger'
            }`}
            onClick={() => toggleFilter('status', s.id)}>
            {s.name}
          </button>
        ))}
        <button className="btn btn-sm btn-outline-secondary"
          onClick={() => setFilters(f => ({ ...f, status: null }))}>
          Сбросить
        </button>
      </div>

      <div className="mb-4 row g-2">
        <div className="col-auto">
          <label className="form-label">С</label>
          <input
            type="date"
            className="form-control"
            value={filters.startDate}
            onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
          />
        </div>
        <div className="col-auto">
          <label className="form-label">По</label>
          <input
            type="date"
            className="form-control"
            value={filters.endDate}
            onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
          />
        </div>
        <div className="col-auto align-self-end">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => setFilters(f => ({ ...f, startDate: '', endDate: '' }))}
          >
            Сбросить даты
          </button>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Сумма</th>
            <th>Тип</th>
            <th>Категория</th>
            <th>Подкатегория</th>
            <th>Статус</th>
            <th>Дата</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(d => (
            <tr key={d.id}>
              <td>{d.sum}</td>
              <td>{typeMap[d.type] ?? d.type}</td>
              <td>{catMap[d.category] ?? d.category}</td>
              <td>{subcatMap[d.subcategory] ?? d.subcategory}</td>
              <td>{statusMap[d.status] ?? d.status}</td>
              <td>{new Date(d.date).toLocaleString()}</td>
              <td>
                <Link to={`/edit/${d.id}`} className="btn btn-sm btn-primary me-1">
                  Изм.
                </Link>
                <button
                  onClick={() => handleDelete(d.id)}
                  className="btn btn-sm btn-danger me-1"
                >
                  Уд.
                </button>
                {d.comment && d.comment.trim() !== '' && (
                  <button
                    onClick={() => handleShowComment(d.comment)}
                    className="btn btn-sm btn-info"
                  >
                    Посм. ком
                  </button>
                )}
              </td>
            </tr>
          ))}

          {filteredItems.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                Нет записей, соответствующих фильтрам.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
