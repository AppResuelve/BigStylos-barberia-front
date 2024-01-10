import formatHour from "../../functions/formatHour";

const SelectedDay = ({ firstMonth, firstDay, days }) => {
  const newTime = Array(1441).fill(null);
  const open = {
    first: {
      open: 480,
      close: 720,
    },
    second: {
      open: 900,
      close: 1200,
    },
  };

  return (
    <div>
      <h2>Esto es SelectedDay</h2>
      {days[firstMonth][firstDay] ? (
        <h2>Existe</h2>
      ) : (
        (() => {
          let counter = 0;
          return newTime.map((element, index) => {
            if (
              (index > open.first.open && index < open.first.close) ||
              (index > open.second.open && open.second.close)
            )
              if (counter === 30) {
                counter = 0; // Reiniciar el contador si llega a 30
                return <div key={index}>{index}</div>;
              } else {
                counter++;
                return null; // Renderizar null en este caso
              }
          });
        })()
      )}
    </div>
  );
};

export default SelectedDay;
