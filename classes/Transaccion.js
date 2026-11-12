export class Transaccion {
  static historial = [];

  constructor(descripcion, monto, tipo, categoria, fecha) {
    this.id = Date.now();
    this.descripcion = descripcion;
    this.monto = monto;
    this.tipo = tipo;
    this.categoria = categoria;
    this.fecha = fecha
  }

  static agregar(transaccion) {
    Transaccion.historial.push(transaccion);
  }

  static eliminar(id) {
    Transaccion.historial = Transaccion.historial.filter(
      (transaccion) => transaccion.id !== id,
    );
  }
}
