// src/pages/ManageRefs.js
import React, { useState, useEffect } from 'react';
import api from '../api';

export default function ManageRefs() {
  const [statuses, setStatuses]           = useState([]);
  const [types, setTypes]                 = useState([]);
  const [categories, setCategories]       = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [newStatus, setNewStatus]         = useState('');
  const [newType, setNewType]             = useState('');
  const [newCategory, setNewCategory]     = useState({ name: '', type: '' });
  const [newSubcat, setNewSubcat]         = useState({ name: '', category: '' });

  const [editStatus, setEditStatus]       = useState(null);
  const [editType, setEditType]           = useState(null);
  const [editCategory, setEditCategory]   = useState(null);
  const [editSubcat, setEditSubcat]       = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  function fetchAll() {
    Promise.all([
      api.get('/api/statuses/'),
      api.get('/api/types/'),
      api.get('/api/categories/'),
      api.get('/api/subcategories/'),
    ])
    .then(([rS, rT, rC, rSC]) => {
      setStatuses(rS.data);
      setTypes(rT.data);
      setCategories(rC.data);
      setSubcategories(rSC.data);
    })
    .catch(err => console.error('Ошибка загрузки справочников', err));
  }

  const createItem = (endpoint, payload, clearFn) =>
    api.post(endpoint, payload)
      .then(() => { fetchAll(); clearFn(); })
      .catch(e => alert('Не удалось создать: '+e));

  const updateItem = (endpoint, id, payload, clearFn) =>
    api.put(`${endpoint}${id}/`, payload)
      .then(() => { fetchAll(); clearFn(); })
      .catch(e => alert('Не удалось обновить: '+e));

  const deleteItem = (endpoint, id) => {
    if (!window.confirm('Вы уверены?')) return;
    api.delete(`${endpoint}${id}/`)
      .then(fetchAll)
      .catch(e => alert('Не удалось удалить: '+e));
  };

  return (
    <div className="container py-4">
      <h2>Управление справочниками</h2>
      <div className="accordion" id="refsAccordion">

        {/* Статусы */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingStatus">
            <button className="accordion-button" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseStatus">
              Статусы
            </button>
          </h2>
          <div id="collapseStatus"
               className="accordion-collapse collapse show"
               data-bs-parent="#refsAccordion">
            <div className="accordion-body">
              <table className="table table-sm">
                <thead>
                  <tr><th>Название</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {statuses.map(s =>
                    <tr key={s.id}>
                      <td>
                        {editStatus?.id === s.id
                          ? <input className="form-control form-control-sm"
                                   value={editStatus.name}
                                   onChange={e => setEditStatus({...editStatus, name: e.target.value})}/>
                          : s.name
                        }
                      </td>
                      <td>
                        {editStatus?.id === s.id
                          ? <>
                              <button className="btn btn-sm btn-primary me-2"
                                onClick={() => updateItem('/api/statuses/', s.id, {name: editStatus.name}, () => setEditStatus(null))}>
                                Сохранить
                              </button>
                              <button className="btn btn-sm btn-secondary"
                                onClick={() => setEditStatus(null)}>Отмена</button>
                            </>
                          : <>
                              <button className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => setEditStatus(s)}>Изменить</button>
                              <button className="btn btn-sm btn-danger"
                                onClick={() => deleteItem('/api/statuses/', s.id)}>Удалить</button>
                            </>
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="input-group">
                <input className="form-control" placeholder="Новый статус"
                       value={newStatus}
                       onChange={e => setNewStatus(e.target.value)} />
                <button className="btn btn-success"
                  onClick={() => createItem('/api/statuses/', {name: newStatus}, () => setNewStatus(''))}>
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Типы */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingType">
            <button className="accordion-button collapsed" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseType">
              Типы
            </button>
          </h2>
          <div id="collapseType" className="accordion-collapse collapse" data-bs-parent="#refsAccordion">
            <div className="accordion-body">
              <table className="table table-sm">
                <thead>
                  <tr><th>Название</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {types.map(t =>
                    <tr key={t.id}>
                      <td>
                        {editType?.id === t.id
                          ? <input className="form-control form-control-sm"
                                   value={editType.name}
                                   onChange={e => setEditType({...editType, name: e.target.value})}/>
                          : t.name
                        }
                      </td>
                      <td>
                        {editType?.id === t.id
                          ? <>
                              <button className="btn btn-sm btn-primary me-2"
                                onClick={() => updateItem('/api/types/', t.id, {name: editType.name}, () => setEditType(null))}>
                                Сохранить
                              </button>
                              <button className="btn btn-sm btn-secondary"
                                onClick={() => setEditType(null)}>Отмена</button>
                            </>
                          : <>
                              <button className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => setEditType(t)}>Изменить</button>
                              <button className="btn btn-sm btn-danger"
                                onClick={() => deleteItem('/api/types/', t.id)}>Удалить</button>
                            </>
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="input-group">
                <input className="form-control" placeholder="Новый тип"
                       value={newType}
                       onChange={e => setNewType(e.target.value)} />
                <button className="btn btn-success"
                  onClick={() => createItem('/api/types/', {name: newType}, () => setNewType(''))}>
                  Добавить
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Категории */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingCat">
            <button className="accordion-button collapsed" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseCat">
              Категории
            </button>
          </h2>
          <div id="collapseCat" className="accordion-collapse collapse" data-bs-parent="#refsAccordion">
            <div className="accordion-body">
              <table className="table table-sm">
                <thead>
                  <tr><th>Тип</th><th>Название</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {categories.map(c =>
                    <tr key={c.id}>
                      <td>{c.type.name}</td>
                      <td>
                        {editCategory?.id === c.id
                          ? <input className="form-control form-control-sm"
                                   value={editCategory.name}
                                   onChange={e => setEditCategory({...editCategory, name: e.target.value})}/>
                          : c.name
                        }
                      </td>
                      <td>
                        {editCategory?.id === c.id
                          ? <>
                              <button className="btn btn-sm btn-primary me-2"
                                onClick={() => updateItem('/api/categories/', c.id, editCategory, () => setEditCategory(null))}>
                                Сохранить
                              </button>
                              <button className="btn btn-sm btn-secondary"
                                onClick={() => setEditCategory(null)}>Отмена</button>
                            </>
                          : <>
                              <button className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => setEditCategory(c)}>Изменить</button>
                              <button className="btn btn-sm btn-danger"
                                onClick={() => deleteItem('/api/categories/', c.id)}>Удалить</button>
                            </>
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="row g-2 align-items-end">
                <div className="col">
                  <label className="form-label">Тип</label>
                  <select className="form-select"
                          value={newCategory.type}
                          onChange={e => setNewCategory({...newCategory, type: e.target.value})}>
                    <option value="">— выбрать тип —</option>
                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Название</label>
                  <input className="form-control"
                         value={newCategory.name}
                         onChange={e => setNewCategory({...newCategory, name: e.target.value})}/>
                </div>
                <div className="col-auto">
                  <button className="btn btn-success"
                    disabled={!newCategory.name || !newCategory.type}
                    onClick={() => createItem('/api/categories/', newCategory, () => setNewCategory({name:'',type:''}))}>
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Подкатегории */}
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingSubcat">
            <button className="accordion-button collapsed" type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseSubcat">
              Подкатегории
            </button>
          </h2>
          <div id="collapseSubcat"
               className="accordion-collapse collapse"
               data-bs-parent="#refsAccordion">
            <div className="accordion-body">
              <table className="table table-sm">
                <thead>
                  <tr><th>Категория</th><th>Название</th><th>Действия</th></tr>
                </thead>
                <tbody>
                  {subcategories.map(sc =>
                    <tr key={sc.id}>
                      <td>{sc.category.name}</td>
                      <td>
                        {editSubcat?.id === sc.id
                          ? <input className="form-control form-control-sm"
                                   value={editSubcat.name}
                                   onChange={e => setEditSubcat({...editSubcat, name: e.target.value})}/>
                          : sc.name
                        }
                      </td>
                      <td>
                        {editSubcat?.id === sc.id
                          ? <>
                              <button className="btn btn-sm btn-primary me-2"
                                onClick={() => updateItem('/api/subcategories/', sc.id, editSubcat, () => setEditSubcat(null))}>
                                Сохранить
                              </button>
                              <button className="btn btn-sm btn-secondary"
                                onClick={() => setEditSubcat(null)}>Отмена</button>
                            </>
                          : <>
                              <button className="btn btn-sm btn-outline-secondary me-2"
                                onClick={() => setEditSubcat(sc)}>Изменить</button>
                              <button className="btn btn-sm btn-danger"
                                onClick={() => deleteItem('/api/subcategories/', sc.id)}>Удалить</button>
                            </>
                        }
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="row g-2 align-items-end">
                <div className="col">
                  <label className="form-label">Категория</label>
                  <select className="form-select"
                          value={newSubcat.category}
                          onChange={e => setNewSubcat({...newSubcat, category: e.target.value})}>
                    <option value="">— выбрать категорию —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Название</label>
                  <input className="form-control"
                         value={newSubcat.name}
                         onChange={e => setNewSubcat({...newSubcat, name: e.target.value})}/>
                </div>
                <div className="col-auto">
                  <button className="btn btn-success"
                    disabled={!newSubcat.name || !newSubcat.category}
                    onClick={() => createItem('/api/subcategories/', newSubcat, () => setNewSubcat({name:'',category:''}))}>
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
