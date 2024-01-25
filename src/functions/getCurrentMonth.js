const getCurrentMonth = () => {
    const date = new Date();
    const currentMont = date.getMonth() + 1;
    return currentMont
}

export default getCurrentMonth;