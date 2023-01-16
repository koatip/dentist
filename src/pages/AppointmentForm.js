import { Link } from "react-router-dom";
import Form from '../components/Form';

function AppointmentForm({ serviceList }) {
  return (
    <main className="container mt-3">
      <Link to="/" className="btn btn-outline-secondary mb-3"><i className="bi bi-caret-left-fill" /> Vissza a főoldalra</Link>
      <h1>Foglalás felvitele</h1>
      <Form serviceList={serviceList} />
    </main>
  );
}

export default AppointmentForm;
