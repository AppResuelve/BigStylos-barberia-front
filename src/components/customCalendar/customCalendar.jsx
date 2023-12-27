import daysMonthCalendarCustom from '../../functions/daysMonthCalendarCustom';
import getToday from '../../functions/getToday';
import './customCalendar.css';

const CustomCalendar = () => {
  const daysCalendarCustom = daysMonthCalendarCustom(3, false);
  const daysOfWeek = ["lun", "mar", "mie", "jue", "vie", "sab", "dom"];
  const getDayPosition = getToday(); // devuelve número que representa qué día de la semana es (lunes, martes, etc)

  return (
    <div>
      <h1>calendario</h1>
      <div className='line7day'>
        {daysOfWeek.map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className='line7'>
        {daysCalendarCustom.month1.map((day, index) => (
          <button
            key={index}
            className='month1'
            style={{
              gridColumnStart: index === 0 ? getDayPosition : 'auto',
              ...(index === 0 ? { backgroundColor: '#e0e0e0' } : {}), // Aplicar backgroundColor solo al primer botón
            }}
          >
            {day}
          </button>
        ))}

        {daysCalendarCustom.month2.map((day, index) => (
          <button 
          key={index + 100}
          className='month2'
          >{day}</button>
        ))}
      </div>
    </div>
  );
};

export default CustomCalendar;

/* {
    "_id": "6584df2bde76b1133c244c87",
    "date": "11/08/1990" 
  } */
