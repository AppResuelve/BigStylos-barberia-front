const shouldDisableButton = (dayIsSelected, days) => {
    const firstLevelProperty = Object.keys(dayIsSelected)[0];
    
    if (!firstLevelProperty) {
      return false;
    }
  
    const secondLevelProperty = Object.keys(dayIsSelected[firstLevelProperty])[0];
  
    if (
      !days[firstLevelProperty] ||
      !days[firstLevelProperty][secondLevelProperty] ||
      days[firstLevelProperty][secondLevelProperty].turn === false
    ) {
      return false;
    }
  
    return true;
  };

  export default shouldDisableButton;