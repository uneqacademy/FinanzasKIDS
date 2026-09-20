// motor.js
// Funciones compartidas para generar y leer la curva de "valor de cuota"

// Genera un factor diario distinto para cada día del período, con altibajos
// aleatorios, pero corregidos matemáticamente para que el producto de todos
// ellos dé exactamente la tasa objetivo que definiste.
export function generarFactoresDiarios(tasaObjetivo, dias, volMax = 0.012) {
  const factorObjetivo = 1 + tasaObjetivo;
  const ruido = Array.from(
    { length: dias },
    () => 1 + (Math.random() * 2 - 1) * volMax
  );
  const productoRuido = ruido.reduce((acc, f) => acc * f, 1);
  const correccion = Math.pow(factorObjetivo / productoRuido, 1 / dias);
  return ruido.map((f) => f * correccion);
}

// Dado un período ya guardado (con fecha_inicio, valor_inicial y su arreglo
// de factores), calcula cuánto vale la cuota en una fecha específica.
export function valorCuotaEnFecha(periodo, fecha = new Date()) {
  const inicio = new Date(periodo.fecha_inicio);
  const diasTranscurridos = Math.floor(
    (fecha - inicio) / (1000 * 60 * 60 * 24)
  );
  const dia = Math.min(
    Math.max(diasTranscurridos, 0),
    periodo.factores.length - 1
  );

  let valor = periodo.valor_inicial;
  for (let i = 0; i <= dia; i++) {
    valor *= periodo.factores[i];
  }
  return valor;
}

// Busca, entre varios períodos guardados, cuál corresponde a una fecha dada.
export function periodoParaFecha(periodos, fecha = new Date()) {
  return periodos.find((p) => {
    const inicio = new Date(p.fecha_inicio);
    const fin = new Date(p.fecha_fin);
    return fecha >= inicio && fecha <= fin;
  });
}
