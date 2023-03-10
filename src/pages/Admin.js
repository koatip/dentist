import { useEffect, useState } from 'react';
import TableItem from '../components/TableItem';
import { getDataByCollection } from "../firebase/utils";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import db from "../firebase/db";
import Select from "../components/Select";
import CheckBox from "../components/CheckBox";
import { Link } from "react-router-dom";

function Admin({ serviceList }) {

  const [appointmentList, setAppointmentList] = useState([]);
  const [service, setService] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [statistic, setStatistic] = useState([]);
  const [sum, setSum] = useState(0);

  async function loadData() {
    const appointments = await getDataByCollection("dentist");
    setAppointmentList(appointments);
    return appointments;
  }

  useEffect(() => {
    loadData().then(makeStatistic);
  }, []);

  const dentistRef = collection(db, "dentist");

  async function getData(queryRef = dentistRef) {
    const querySnapshot = await getDocs(queryRef);
    const appointments = querySnapshot.docs.map(doc => {
      return { ...doc.data(), id: doc.id };
    })
    setAppointmentList(appointments);
    return appointments;
  }

  function handleChange({ target: { value } }) {
    setIsUrgent(false);
    if (value) {
      setService(value);
      const queryRef = query(dentistRef, where("service", "==", value));
      getData(queryRef);
    } else {
      setService("");
      getData();
    }
  }

  function handleCheckChange({ target: { checked } }) {
    setService("")
    if (checked) {
      setIsUrgent(true);
      const queryRef = query(dentistRef, where("isUrgent", "==", true));
      getData(queryRef);
    } else {
      setIsUrgent(false);
      getData();
    }
  }

  function makeStatistic(appointmentList) {
    const stat = serviceList.map(service => ({ name: service, count: appointmentList.filter(appointment => appointment.service === service).length }));
    setStatistic(stat);
    setSum(appointmentList.length)
  }

  function handleDelete(id) {
    updateDoc(doc(db, "dentist", id), {isDeleted: true}).then(loadData).then(makeStatistic);
    setService("");
    setIsUrgent(false);

  }

  return (
    <>
      <section className={"container-md"}>
        <header className={"mt-4 mb-4"}>
          <h1>Fog??szat admin</h1>
        </header>

        <Link className="btn btn-primary mb-3" to='/appointments/add'>Foglal??s felvitele</Link>

        <Select
          name="service"
          label="Sz??r??s szolg??ltat??sra"
          handleChange={handleChange}
          value={service}>
          <option value="">V??lassz!</option>
          {serviceList.map(service => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </Select>

        <CheckBox
          name="urgent"
          label="S??rg??s esetek"
          checked={isUrgent}
          handleChange={handleCheckChange}
        />

        <table className="table table-striped">
          <thead>
            <tr>
              <th>N??v</th>
              <th>Szolg??ltat??s</th>
              <th>Foglalt id??pont</th>
              <th>S??rg??s?</th>
            </tr>
          </thead>
          <tbody>
            {appointmentList.map((appointmentItem) => (
              !appointmentItem.isDeleted &&
              <TableItem
                key={appointmentItem.id}
                fullName={appointmentItem.fullName}
                appointment={appointmentItem.appointment}
                service={appointmentItem.service}
                isUrgent={appointmentItem.isUrgent}
                id={appointmentItem.id}
                handleDelete={handleDelete}
              />
            ))}
          </tbody>
        </table>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Szolg??ltat??s</th>
              <th>Darab</th>
            </tr>
          </thead>
          <tbody>
            {statistic.map(service => (
              <tr key={service.name}>
                <td>{service.name}</td>
                <td>{service.count}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>??sszesen</th>
              <th>{sum}</th>
            </tr>
          </tfoot>
        </table>
      </section>
    </>
  );
}

export default Admin;
