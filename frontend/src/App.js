import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import ListDDC    from './pages/ListDDC';
import CreateDDC  from './pages/CreateDDC';
import EditDDC    from './pages/EditDDC';
import ManageRefs from './pages/ManageRefs';

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link className="navbar-brand px-3" to="/">DDC</Link>
        <div className="navbar-nav">
          <Link className="nav-item nav-link" to="/">Записи ДДС</Link>
          <Link className="nav-item nav-link" to="/create">Создать ДДС</Link>
          <Link className="nav-item nav-link" to="/refs">Справочники</Link>
        </div>
      </nav>

      <div className="container mt-4">
        <Routes>
          <Route path="/"       element={<ListDDC />} />
          <Route path="/create" element={<CreateDDC />} />
          <Route path="/edit/:id" element={<EditDDC />} />
          <Route path="/refs" element={<ManageRefs />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
