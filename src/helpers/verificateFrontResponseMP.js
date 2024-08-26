const verificateFrontResponse = (urlParams, preferenceIdToMatch) => {
  // Parse the URL parameters into an object

  const params = new URLSearchParams(urlParams);

  // Extract the parameters as an object
  const paramObj = {};
  params.forEach((value, key) => {
    paramObj[key] = value;
  });

  if (
    paramObj.collection_id === "null" &&
    paramObj.collection_status === "null" &&
    paramObj.external_reference === "null" &&
    paramObj.merchant_account_id === "null" &&
    paramObj.merchant_order_id === "null" &&
    paramObj.payment_id === "null" &&
    paramObj.payment_type === "null" &&
    paramObj.preference_id === preferenceIdToMatch &&
    paramObj.processing_mode === "aggregator" &&
    paramObj.site_id === "MLA" &&
    paramObj.status === "null"
  ) {
    return true;
  } else {
    return false;
  }
};

export { verificateFrontResponse };
