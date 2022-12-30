/**
 * Redondea un número number a tantos dígitos como los indicados por place
 */
function roundTo(number, place) {
    return +(Math.round(number + "e+" + place) + "e-" + place);
  }

  /**
   * Devuelve true si value es un número
   */
function isNumber(value) {
    return Number(value)==value;
}


export {
    roundTo, isNumber
}