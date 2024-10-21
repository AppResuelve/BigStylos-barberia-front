const durationMax = (serv, time) => {
    const services = Object.keys(serv);
    let maxDurationElement = null;
  
    if (services.length > 0) {
  
        services.forEach((service) => {
        const currentDuration = serv[service].duration;
  
        if (currentDuration !== null) {
          if (maxDurationElement === null || currentDuration > maxDurationElement) {
            maxDurationElement = currentDuration;
          }
        }
      });
      const value1 = time[0][1] - time[0][0]
      const value2 = time[1][1] - time[1][0]
      if (maxDurationElement <= value1 && maxDurationElement <= value2 ) {
        return true
      }
    }
    return false;
  };

  export default durationMax;