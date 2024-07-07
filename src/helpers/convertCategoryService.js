export const convertToCategoryArray = (obj) => {
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

export const convertToCategoryObj = (array) => {
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