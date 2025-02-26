// Para que expo pueda leer las variables de entorno
const { getDefaultConfig } = require("expo/metro-config");

module.exports = getDefaultConfig(__dirname);
