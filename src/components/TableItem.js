const TableItem = ({ fullName, service, appointment, isUrgent, id, handleDelete }) => {
  return (
    <tr>
      <td>{fullName}</td>
      <td>{service}</td>
      <td>{appointment.toDate().toLocaleString('hu-HU', { timeZone: "CET" })}</td>
      <td>{isUrgent ? 'igen' : 'nem'}</td>
      <td><button id={"delete-" + id} className="btn btn-danger btn-sm" onClick={() => handleDelete(id)}>Törlés</button></td>
    </tr>
  );
};

export default TableItem;
