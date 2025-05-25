function validateClientKey(clientKey) {
    console.log("Validating client access");
    let access = false;
    const allClientKeys = process.env.CLIENT_KEYS.split(',');
    allClientKeys.includes(clientKey) && (access=true);
    return access;
}
module.exports = validateClientKey