import React, { useState } from 'react';
import moment from 'moment-timezone';

const apiUrl = 'https://v6kpgrj4f7.execute-api.us-east-1.amazonaws.com/prod/addholiday';

const HolidayForm = ({ fetchEntries }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [eventName, setEventName] = useState('');
  const [timezone, setTimezone] = useState('UTC');
  const [invalidFields, setInvalidFields] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
        alert('Holiday entry added successfully!');
        fetchEntries();
        clearForm();
      } else {
        const responseData = await response.json();
        alert(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch. Check the console for more details.');
    }
  };

  const clearForm = () => {
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setEventName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Timezone:
        <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={invalidFields.includes('timezone') ? 'invalid' : ''}>
          <option value="UTC">UTC</option>
          <option value="America/New_York">EST (Eastern Standard Time)</option>
          <option value="America/Chicago">CST (Central Standard Time)</option>
          <option value="America/Denver">MST (Mountain Standard Time)</option>
          <option value="America/Los_Angeles">PST (Pacific Standard Time)</option>
        </select>
      </label>
      <br /><br />

      <label>
        Start Date:
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={invalidFields.includes('startDate') ? 'invalid' : ''} required />
      </label>
      <br /><br />

      <label>
        Start Time:
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className={invalidFields.includes('startTime') ? 'invalid' : ''} required />
      </label>
      <br /><br />

      <label>
        End Date:
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={invalidFields.includes('endDate') ? 'invalid' : ''} required />
      </label>
      <br /><br />

      <label>
        End Time:
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={invalidFields.includes('endTime') ? 'invalid' : ''} required />
      </label>
      <br /><br />

      <label>
        Event:
        <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className={invalidFields.includes('eventName') ? 'invalid' : ''} required />
      </label>
      <br /><br />

      <button type="submit">Add Holiday</button>
    </form>
  );
};

export default HolidayForm;
