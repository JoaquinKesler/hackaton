import { Transaccion } from "./classes/Transaccion.js";

const formulario = document.getElementById("formulario");
const inputDescripcion = document.getElementById("descripcion");
const inputMonto = document.getElementById("monto");
const selectTipo = document.getElementById("tipo");
const selectCategoria = document.getElementById("categoria");
const historial = document.getElementById("historial");
const inputFecha = document.getElementById("fecha")
const canvas = document.getElementById("grafico-barras");
const canvasLineas = document.getElementById("grafico-lineas")

const ingresosTotal = document.getElementById("ingresos-totales");
const gastosTotal = document.getElementById("gastos-totales");
const balanceNeto = document.getElementById("balance-neto");

let graficoBarras
let graficoLineas

formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

  const descripcion = inputDescripcion.value;
  const monto = parseFloat(inputMonto.value);
  const tipo = selectTipo.value;
  const categoria = selectCategoria.value;
  const fecha = inputFecha.value

  const nueva = new Transaccion(descripcion, monto, tipo, categoria, fecha);
  Transaccion.agregar(nueva);

  mostrarHistorial();
  calcularBalance();
  calcularResumen();
  lineas()
});

historial.addEventListener("click", (e) => {
  const id = Number(e.target.dataset.id); 

  if (!id) return;

  Transaccion.eliminar(id);

  mostrarHistorial();
  calcularBalance();
  calcularResumen();
  lineas()
});

function mostrarHistorial() {
  historial.innerHTML = "";

  for (const transaccion of Transaccion.historial) {
    let color;

    if (transaccion.tipo === "ingreso") {
      color = "text-green-600";
    } else {
      color = "text-red-600";
    }

    historial.innerHTML += `
        <tr>
            <td>${transaccion.descripcion}</td>
            <td>${transaccion.categoria}</td>
            <td class="${color}">${transaccion.monto}</td>
            <td>${transaccion.fecha}</td>
            <td><button data-id="${transaccion.id}">Eliminar</button></td>
        </tr>
        `;
  }
}

function calcularBalance() {
  let ingreso = 0;
  let gasto = 0;

  for (const transaccion of Transaccion.historial) {
    if (transaccion.tipo === "ingreso") {
      ingreso += transaccion.monto;
    } else {
      gasto += transaccion.monto;
    }
  }
  let balance = ingreso - gasto;

  ingresosTotal.innerText = "$" + ingreso;
  gastosTotal.innerText = "$" + gasto;
  balanceNeto.innerText = "$" + balance;
}

function calcularResumen() {
  let sueldo = 0;
  let comida = 0;
  let transporte = 0;
  let otros = 0;

  for (const transaccion of Transaccion.historial) {
    if (transaccion.categoria === "sueldo") {
      sueldo += transaccion.monto;
    } else if (transaccion.categoria === "comida") {
      comida += transaccion.monto;
    } else if (transaccion.categoria === "transporte") {
      transporte += transaccion.monto;
    } else {
      otros += transaccion.monto;
    }
  }
if (graficoBarras) {
  graficoBarras.destroy();
}

graficoBarras = new Chart(canvas, {
  type: "bar",
  data: {
    labels: ["sueldo", "comida", "transporte", "otros"],
    datasets: [{ label: "Total por categoría", data: [sueldo, comida, transporte, otros] }],
  },
});
}

function lineas() {
  Transaccion.historial.sort((a, b) => (a.fecha > b.fecha ? 1 : -1));

  const fechas = [];
  const ingresos = [];
  const gastos = [];
  const balance = [];
  let ingreso = 0;
  let gasto = 0;

  for (const t of Transaccion.historial) {
    if (t.tipo === "ingreso") {
      ingreso += t.monto;
    } else {
      gasto += t.monto;
    }

    fechas.push(t.fecha);
    ingresos.push(ingreso);
    gastos.push(gasto);
    balance.push(ingreso - gasto);
  }

  if (graficoLineas) graficoLineas.destroy();

  graficoLineas = new Chart(canvasLineas, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        { label: "Ingresos", data: ingresos },
        { label: "Egresos", data: gastos },
        { label: "Balance neto", data: balance },
      ],
    },
  });
}

mostrarHistorial();
calcularBalance();
calcularResumen();
lineas();

