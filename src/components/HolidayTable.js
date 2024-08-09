import React, { useState } from 'react';
import moment from 'moment-timezone';

const apiUrl = 'https://v6kpgrj4f7.execute-api.us-east-1.amazonaws.com/prod/addholiday';

const HolidayTable = ({ entries, fetchEntries }) => {
  const [editingEntry, setEditingEntry] = useState(null);
  const [editForm, setEditForm] = useState({
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    eventName: '',
    timezone: 'UTC'
  });
  const [invalidFields, setInvalidFields] = useState([]);

  const handleDelete = async (startDate) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: JSON.stringify({ startDate }) })
      });

      if (response.ok) {
        alert('Holiday entry deleted successfully!');
        fetchEntries();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete entry. Check the console for more details.');
    }
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry.startDate);
    const startDateTime = moment.tz(entry.startDate, 'MM-DD-YYYY hh:mm A', entry.timezone);
    const endDateTime = moment.tz(entry.endDate, 'MM-DD-YYYY hh:mm A', entry.timezone);
    setEditForm({
      startDate: startDateTime.format('YYYY-MM-DD'),
      startTime: startDateTime.format('HH:mm'),
      endDate: endDateTime.format('YYYY-MM-DD'),
      endTime: endDateTime.format('HH:mm'),
      eventName: entry.Event,
      timezone: entry.timezone
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    const { startDate, startTime, endDate, endTime, eventName, timezone } = editForm;
    const invalids = [];
    if (!startDate) invalids.push('startDate');
    if (!startTime) invalids.push('startTime');
    if (!endDate) invalids.push('endDate');
    if (!endTime) invalids.push('endTime');
    if (!eventName) invalids.push('eventName');

    setInvalidFields(invalids);

    if (invalids.length > 0) {
      alert('Please fill in all required fields.');
      return;
    }

    const startDateTime = moment.tz(`${startDate}T${startTime}`, timezone);
    const endDateTime = moment.tz(`${endDate}T${endTime}`, timezone);

    const formattedStartDate = startDateTime.format('MM-DD-YYYY hh:mm A');
    const formattedEndDate = endDateTime.format('MM-DD-YYYY hh:mm A');

    const startTimestamp = Math.floor(startDateTime.valueOf() / 1000);
    const endTimestamp = Math.floor(endDateTime.valueOf() / 1000);

    const data = {
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      event: eventName,
      startTimestamp: startTimestamp,
      endTimestamp: endTimestamp,
      timezone: timezone
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: JSON.stringify(data) })
      });

      if (response.ok) {
        alert('Holiday entry updated successfully!');
        setEditingEntry(null);
        fetchEntries();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update entry. Check the console for more details.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const renderTableRows = () => {
    return entries.map((entry) => {
      if (entry.startDate === editingEntry) {
        return (
          <tr key={entry.startDate}>
            <td>
              <input
                type="date"
                name="startDate"
                value={editForm.startDate}
                onChange={handleChange}
                className={invalidFields.includes('startDate') ? 'invalid' : ''}
                required
              />
              <input
                type="time"
                name="startTime"
                value={editForm.startTime}
                onChange={handleChange}
                className={invalidFields.includes('startTime') ? 'invalid' : ''}
                required
              />
            </td>
            <td>
              <input
                type="date"
                name="endDate"
                value={editForm.endDate}
                onChange={handleChange}
                className={invalidFields.includes('endDate') ? 'invalid' : ''}
                required
              />
              <input
                type="time"
                name="endTime"
                value={editForm.endTime}
                onChange={handleChange}
                className={invalidFields.includes('endTime') ? 'invalid' : ''}
                required
              />
            </td>
            <td>
              <input
                type="text"
                name="eventName"
                value={editForm.eventName}
                onChange={handleChange}
                className={invalidFields.includes('eventName') ? 'invalid' : ''}
                required
              />
            </td>
            <td>{getTimezoneAbbreviation(entry.timezone)}</td>
            <td>
              <div className="action-buttons">
                <button className="save-button" onClick={handleUpdate}>Save</button>
                <button className="cancel-button" onClick={() => setEditingEntry(null)}>Cancel</button>
              </div>
            </td>
          </tr>
        );
      }

      return (
        <tr key={entry.startDate}>
          <td>
            {entry.startDate.split(' ')[0]}
            <br />
            {entry.startDate.split(' ')[1] + ' ' + entry.startDate.split(' ')[2]}
          </td>
          <td>
            {entry.endDate.split(' ')[0]}
            <br />
            {entry.endDate.split(' ')[1] + ' ' + entry.endDate.split(' ')[2]}
          </td>
          <td>{entry.Event}</td>
          <td>{getTimezoneAbbreviation(entry.timezone)}</td>
          <td>
            <div className="action-buttons">
              <button className="edit-button" onClick={() => handleEdit(entry)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(entry.startDate)}>Delete</button>
            </div>
          </td>
        </tr>
      );
    });
  };

  return (
    <div>
      <h2>Holiday Table</h2>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Event</th>
            <th>Timezone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan="5">No entries found or invalid data format.</td>
            </tr>
          ) : (
            renderTableRows()
          )}
        </tbody>
      </table>
    </div>
  );
};

function getTimezoneAbbreviation(timezone) {
  const timezoneAbbreviations = {
    'UTC': 'UTC',
    'America/New_York': 'EST',
    'America/Chicago': 'CST',
    'America/Denver': 'MST',
    'America/Los_Angeles': 'PST'
  };
  return timezoneAbbreviations[timezone] || timezone;
}

export default HolidayTable;
