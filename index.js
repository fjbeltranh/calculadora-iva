import { roundTo, isNumber } from "./functions.js";

// declara constantes globales

const baseImponibleInput = document.getElementById("baseImponible");
const ivaInput = document.getElementById("iva");
const importeIvaInput = document.getElementById("importeIva");
const importeTotalInput = document.getElementById("importeTotal");
const calculadoraInputs = document.querySelectorAll(".calculadora input");
const NUM_DECIMALES = 2;
const esTeclaPermitida = (tecla) => /^([0-9.])$/.test(tecla) || tecla==='Backspace' || tecla==='Delete';
const calcularImporte = (id) => {
  let baseImponible = Number(baseImponibleInput.value);
  let iva = Number(ivaInput.value);
  let importeIva = Number(importeIvaInput.value);
  let importeTotal = Number(importeTotalInput.value);

  switch (id) {
    case "baseImponible":
      importeIva = (baseImponible * iva) / 100;
      importeTotal = baseImponible + importeIva;
      importeIvaInput.value = roundTo(importeIva, NUM_DECIMALES);
      importeTotalInput.value = roundTo(importeTotal, NUM_DECIMALES);
      break;
    case "importeIva":
      baseImponible = importeIva / (iva / 100);
      importeTotal = baseImponible + importeIva;
      baseImponibleInput.value = roundTo(baseImponible, NUM_DECIMALES);
      importeTotalInput.value = roundTo(importeTotal, NUM_DECIMALES);
      break;
    case "importeTotal":
      baseImponible = importeTotal / (1 + iva / 100);
      importeIva = (baseImponible * iva) / 100;
      baseImponibleInput.value = roundTo(baseImponible, NUM_DECIMALES);
      importeIvaInput.value = roundTo(importeIva, NUM_DECIMALES);
      break;
    case "iva":
      importeIva = (baseImponible * iva) / 100;
      importeTotal = baseImponible + importeIva;
      importeIvaInput.value = roundTo(importeIva, NUM_DECIMALES);
      importeTotalInput.value = roundTo(importeTotal, NUM_DECIMALES);
      break;
  }

  //   calculadoraInputs.forEach((inp) => {
  //     if (e.target.id != inp.id) {
  //         document.getElementById(inp.id).value=roundTo(Number(inp.value), NUM_DECIMALES);
  //     }
  //   });
};

// aplica eventos a todos los inputs

calculadoraInputs.forEach((input) => {

  // Si se PRESIONA UNA TECLA sólo deja las permitidas (el '.' sólo una vez). Si se pulsa ',' lo transforma a '.'
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
