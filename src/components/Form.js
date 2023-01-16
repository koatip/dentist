import { useState, useEffect } from 'react';
import { collection, addDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import db from "../firebase/db";
import validation from './validation';
import Input from './Input';
import Select from './Select';
import CheckBox from "../components/CheckBox";

export default function Form({ serviceList }) {
  const reportFormValidity = validation(serviceList);

  const initalValues = {
    fullName: '',
    email: '',
    service: '',
    appointment: '',
    isUrgent: false
  }

  const [formData, setFormData] = useState(initalValues);
  const [errorMessages, setErrorMessages] = useState({});
  const [wasValidated, setWasValidated] = useState(false);
  const [alert, setAlert] = useState({ text: '', type: '' });

  function handleSubmit(event) {
    event.preventDefault();
    const formIsValid = reportFormValidity(formData, setErrorMessages);
    setWasValidated(true);

    if (formIsValid) {
      const data = {
        fullName: formData.fullName,
        email: formData.email,
        service: formData.service,
        appointment: new Date(formData.appointment),
        isUrgent: formData.isUrgent,
        isDeleted: false
      }
      addDoc(collection(db, "dentist"), data);

      setFormData(initalValues);
      setErrorMessages({});
      setWasValidated(false);

      setAlert({ text: 'Sikeres mentés', type: 'success' });
    } else {
      setAlert({ text: 'Sikertelen mentés', type: 'danger' });
    }
  }

  const handleChange = ({ target: { name, value } }) => {
    setFormData(data => ({
      ...data,
      [name]: value
    }))
  }

  function handleCheckChange({ target: { name, checked } }) {
    setFormData(data => ({
      ...data,
      [name]: checked
    }))
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        label='Név'
        name='fullName'
        value={formData.fullName}
        errorMessages={errorMessages.fullName}
        handleChange={handleChange}
        wasValidated={wasValidated}
      />

      <Input
        label='Email cím'
        type='email'
        name='email'
        value={formData.email}
        errorMessages={errorMessages.email}
        handleChange={handleChange}
        wasValidated={wasValidated}
      />

      <Select
        label='Szolgáltatás'
        name='service'
        value={formData.service}
        errorMessages={errorMessages.service}
        handleChange={handleChange}
        wasValidated={wasValidated}
      >
        <option value=''>Válassz!</option>
        {serviceList.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </Select>

      <Input
        label='Időpont'
        type='datetime-local'
        name='appointment'
        value={formData.appointment}
        errorMessages={errorMessages.appointment}
        handleChange={handleChange}
        wasValidated={wasValidated}
      />

      <CheckBox
        label="Sürgős"
        name="isUrgent"
        checked={formData.isUrgent}
        handleChange={handleCheckChange}
      />

      <button className='btn btn-primary mb-3'>Mentés</button>
      {alert.text && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}
    </form>
  )
}