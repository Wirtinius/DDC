import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function CreateDDC() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    sum: '',
    type: '',
    category: '',
    subcategory: '',
    status: '',
    comment: '',
  });

  const [opts, setOpts] = useState({
    types: [], categories: [], subcategories: [], statuses: []
  });

  useEffect(() => {
    Promise.all([
      api.get('/api/types/'),
      api.get('/api/categories/'),
      api.get('/api/subcategories/'),
      api.get('/api/statuses/'),
    ])
    .then(([rT, rC, rSC, rS]) => {
      setOpts({
        types:        rT.data,
        categories:   rC.data,
        subcategories:rSC.data,
        statuses:     rS.data,
      });
    })
    .catch(console.error);
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => {
      const next = { ...f, [name]: value };
      if (name === 'type') {
        next.category = '';
        next.subcategory = '';
      }
      if (name === 'category') {
        next.subcategory = '';
      }
      return next;
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    api.post('/api/ddc/', {
      sum:         parseFloat(form.sum),
      type:        parseInt(form.type, 10),
      category:    parseInt(form.category, 10),
      subcategory: parseInt(form.subcategory, 10),
      status:      parseInt(form.status, 10),
      comment:     form.comment,
    })
    .then(() => navigate('/'))
    .catch(err => {
      console.error(err);
      alert('Ошибка при создании записи');
    });
  };

  const filteredCategories = opts.categories.filter(c => String(c.type) === form.type);
  const filteredSubcats    = opts.subcategories.filter(sc => String(sc.category) === form.category);

  return (
    <div className="container">
      <h2>Создать запись ДДС</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label className="form-label">Сумма</label>
          <input
            type="number" step="0.01"
            name="sum"
            className="form-control"
            value={form.sum}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Тип</label>
          <select
            name="type"
            className="form-select"
            value={form.type}
            onChange={handleChange}
            required
          >
            <option value="">— выберите тип —</option>
            {opts.types.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Категория</label>
          <select
            name="category"
            className="form-select"
            value={form.category}
            onChange={handleChange}
            required
            disabled={!form.type}
          >
            <option value="">— выберите категорию —</option>
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Подкатегория</label>
          <select
            name="subcategory"
            className="form-select"
            value={form.subcategory}
            onChange={handleChange}
            required
            disabled={!form.category}
          >
            <option value="">— выберите подкатегорию —</option>
            {filteredSubcats.map(sc => (
              <option key={sc.id} value={sc.id}>{sc.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Статус</label>
          <select
            name="status"
            className="form-select"
            value={form.status}
            onChange={handleChange}
            required
          >
            <option value="">— выберите статус —</option>
            {opts.statuses.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Комментарий</label>
          <input
            type="text" step="0.01"
            name="comment"
            className="form-control"
            value={form.comment}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-success">Создать</button>
      </form>
    </div>
  );
}
