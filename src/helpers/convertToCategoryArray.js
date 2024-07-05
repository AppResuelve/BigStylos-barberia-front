const convertToCategoryArray = (obj) => {
  return Object.entries(obj).map(([category, services]) => {
    const servicesArray = Object.entries(services).map(([name, details]) => ({
      name,
      ...details,
    }));
    return {
      category,
      services: servicesArray,
    };
  });
};

export default convertToCategoryArray;
