import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { readReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
function TableSeating() {
  const history = useHistory();
  const { reservation_id } = useParams();

  const [formData, setFormData] = useState({ table_id: "" });
  const [reservation, setReservation] = useState({});
  const [table, setTable] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadTables() {
      const abortController = new AbortController();
      setError(null);
      readReservation(reservation_id, abortController.signal)
        .then(setReservation)
        .catch(setError);
      listTables(abortController.signal).then(setTable).catch(setError);
      return () => abortController.abort();
    }
    loadTables();
  }, [reservation_id]);

  const openTables = table.filter(
    (table) =>
      table.reservation_id === null && table.capacity >= reservation.people
  );

  const listOptionForOpenTables = openTables.map((table) => {
    return (
      <option key={table.table_id} value={table.table_id}>
        {table.table_name} - {table.capacity}
      </option>
    );
  });

  function handleChange({ target: { name, value } }) {
    setFormData({ [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (formData.table_id !== "x") {
      const abortController = new AbortController();
      updateTable(
        formData.table_id,
        reservation.reservation_id,
        abortController.signal
      ).then(() => {
        history.push("/dashboard");
      });
    }
  }

  function cancel() {
    history.goBack();
  }
  return (
    <div>
      <ErrorAlert error={error} />
      <div className="card mt-3">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-input-group">
              <label className="input-group-text" htmlFor="table_id">
                Open tables
              </label>
              <select
                className="custom-select"
                id="table_id"
                name="table_id"
                onChange={handleChange}
              >
                <option value="x">Choose a table...</option>
                {listOptionForOpenTables}
              </select>
            </div>
            {/* Form Group */}
            <div className="d-flex">
              <button type="submit" className="btn btn-primary ml-1 mt-2">
                Submit
              </button>
              <button
                type="submit"
                className="btn btn-danger ml-1 mt-2"
                onClick={cancel}
              >
                Cancel
              </button>
            </div>
            {/* Button Group */}
          </form>
        </div>
        {/* Card Body */}
      </div>
      {/* Card */}
    </div>
  );
}
export default TableSeating;
