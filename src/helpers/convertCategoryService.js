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

export const filterImgServicesToUpdate = (newArray,originalArray) => {
  const modifiedArray = newArray.filter((newItem) => {
    const originalItem = originalArray.find(
      (origItem) => origItem[0] === newItem[0]
    );

    // Si no se encuentra el servicio en el array original, se ignora
    if (!originalItem) return false;

    // Si la URL está vacía o la URL es igual que en el array original, no lo incluimos
    if (newItem[1] === "" || newItem[1] === originalItem[1]) {
      return false;
    }

    return true;
  });

  // Si no hay elementos modificados, retornar false
  if (modifiedArray.length === 0) {
    return false;
  }

  return modifiedArray;
};
