export const convertToCategoryServiceArray = (obj) => {
  return Object.entries(obj).map(([category, services]) => {
    const servicesArray = Object.entries(services).map(([name, details]) => ({
      name,
      ...details,
      deleted: false,
    }));
    return {
      category,
      deleted: false,
      services: servicesArray,
    };
  });
};

export const convertToCategoryServiceObj = (array) => {
  const formattedData = {};

  array.forEach((category) => {
    const categoryName = category.category;
    formattedData[categoryName] = {};

    category.services.forEach((service) => {
      const serviceName = service.name;
      formattedData[categoryName][serviceName] = {
        price: service.price,
        sing: service.sing,
      };
    });
  });

  return formattedData;
};

export const filterDeletedItems = (array) => {
  return array
    .filter((category) => !category.deleted)
    .map((category) => ({
      ...category,
      services: category.services.filter((service) => !service.deleted),
    }));
};

export const convertToServicesArray = (obj) => {
  const servicesArray = [];

  for (const category in obj) {
    for (const service in obj[category]) {
      servicesArray.push({
        name: service,
        duration: null,
        available: false,
      });
    }
  }
  return servicesArray;
};

export const convertToServicesImgArray = (obj) => {
  const servicesArray = [];
  for (const category in obj) {
    for (const service in obj[category]) {
      servicesArray.push([service, obj[category][service].img]);
    }
  }
  return servicesArray;
};

export const filterImgServicesToUpdate = (array) => {
  const filteredArray = array.filter((service) => service[1] !== "");
  if (filteredArray.length < 1) return false;
  return filteredArray;
};
