import { roundTo, isNumber } from "./functions.js";


// define constantes
// ---------------------------------

const inputId={
  baseImponible:"baseImponible",
  iva:"iva",
  importeIva:"importeIva",
  importeTotal:"importeTotal"
};
const inputs = Object.values(inputId).map((e) => document.getElementById(e));
const NUM_DECIMALES = 2;


// define funciones
// ---------------------------------


const esTeclaPermitida = (tecla) => /^([0-9.])$/.test(tecla);

const calculaImportes = (id) => {

  // objeto con los valores numéricos de los inputs
  const val = inputs.reduce((acc, item) => ({ ...acc, [item.id]: Number(item.value) }), {});

  // dependiendo del input que se está modificando realiza los cálculos en el resto de input
  switch (id) {
    case inputId.baseImponible:
      val.importeIva = (val.baseImponible * val.iva) / 100;
      val.importeTotal = val.baseImponible + val.importeIva;
      break;
    case inputId.iva:
      val.importeIva = (val.baseImponible * val.iva) / 100;
      val.importeTotal = val.baseImponible + val.importeIva;
      break;
    case inputId.importeIva:
      val.baseImponible = val.importeIva / (val.iva / 100);
      val.importeTotal = val.baseImponible + val.importeIva;
      break;
    case inputId.importeTotal:
      val.baseImponible = val.importeTotal / (1 + val.iva / 100);
      val.importeIva = (val.baseImponible * val.iva) / 100;
      break;
  }

  // copia los valores calculados en el resto de inputs
  inputs.forEach((input) => {
    if (id != input.id) {
      input.value = roundTo(Number(val[input.id]), NUM_DECIMALES);
    }
  });

};



// aplica eventos a todos los inputs
// ---------------------------------

inputs.forEach((input) => {

  // Si se PRESIONA UNA TECLA sólo deja las permitidas (el '.' sólo una vez). Si se pulsa ',' lo transforma a '.'
  // TODO: keypress está en proceso de quedarse obsoleto. Debería cambiarse por bedoreinput o keydown
  input.addEventListener("keypress", (e) => {
    if (e.key == "," && input.value.indexOf(".") == -1) e.target.value += ".";
    if (
      !esTeclaPermitida(e.key) ||
      (e.key == "." && input.value.indexOf(".") != -1)
    )
      e.preventDefault();
  });

  // Si se SUELTA UNA TECLA (que no sea tabulación), ejecuta calcular importe
  input.addEventListener("keyup", (e) => {
    if (input.value == '.') e.target.value = '0.';
    if (e.key !== "Tab") calculaImportes(e.target.id);
  });

  // Si se PEGA un texto (que sea numérico), ejecuta calcula el importe
  input.addEventListener("paste", (e) => {
    let text = e.clipboardData.getData("text");
    if (!isNumber(text)) e.preventDefault();
    calculaImportes(e.target.id);
  });

  // Si se hace CLICK, selecciona todo el texto
  input.addEventListener("click", (e) => {
    e.target.select();
  });

  // Si se PIERDE EL FOCO, redondea los decimales
  input.addEventListener("blur", (e) => {
    e.target.value = roundTo(Number(e.target.value), NUM_DECIMALES);
  });

});