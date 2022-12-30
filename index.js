import { roundTo, isNumber } from "./functions.js";

// declara constantes globales

const calculadoraInputs = Array.from(document.querySelectorAll(".calculadora input"));
const NUM_DECIMALES = 2;
const esTeclaPermitida = (tecla) => /^([0-9.])$/.test(tecla);
const calcularImporte = (id) => {

  // objeto con los valores numéricos de los inputs
  const v = calculadoraInputs.reduce((pv, cv) => ({ ...pv, [cv.id]: Number(cv.value) }), {});

  // dependiendo del input que se está modificando realiza los cálculos en el resto de input
  switch (id) {
    case "baseImponible":
      v.importeIva = (v.baseImponible * v.iva) / 100;
      v.importeTotal = v.baseImponible + v.importeIva;
      break;
    case "importeIva":
      v.baseImponible = v.importeIva / (v.iva / 100);
      v.importeTotal = v.baseImponible + v.importeIva;
      break;
    case "importeTotal":
      v.baseImponible = v.importeTotal / (1 + v.iva / 100);
      v.importeIva = (v.baseImponible * v.iva) / 100;
      break;
    case "iva":
      v.importeIva = (v.baseImponible * v.iva) / 100;
      v.importeTotal = v.baseImponible + v.importeIva;
      break;
  }

  // copia los valores calculados en el resto de inputs
  calculadoraInputs.forEach((input) => {
    if (id != input.id) {
      input.value = roundTo(Number(v[input.id]), NUM_DECIMALES);
    }
  });
};

// aplica eventos a todos los inputs

calculadoraInputs.forEach((input) => {

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
    if (e.key !== "Tab") {
      calcularImporte(e.target.id);
    }
  });

  // Si se PEGA un texto (que sea numérico), ejecuta calcula el importe
  input.addEventListener("paste", (e) => {
    let text = e.clipboardData.getData("text");
    if (!isNumber(text)) e.preventDefault();
    calcularImporte(e.target.id);
  });

  // Si RECIBE EL FOCO, selecciona todo el texto
  input.addEventListener("focus", (e) => {
    e.target.select();
  });

  // Si se PIERDE EL FOCO, redondea los decimales
  input.addEventListener("blur", (e) => {
    e.target.value = roundTo(Number(e.target.value), NUM_DECIMALES);
  });

});
