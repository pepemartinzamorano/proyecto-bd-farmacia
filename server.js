import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import { MongoClient, ObjectId } from "mongodb";

// Middlewares
const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);
const dbName = "farmacia";
let db;
async function connectDB() {
  try {
    await client.connect();
    console.log("Conectado con éxito a MongoDB");
    db = client.db(dbName);
  } catch (error) {
    console.error("Error de conexión:", error);
  }
}
connectDB();

// Funcionalidades con MongoDB:

// Obtener todos los datos de los productos, según el buscador y los checkboxes
app.get("/api/productos", async (req, res) => {
  const { cadena, categoria } = req.query;
  let filtro = {};
  // Vemos si hay alguna restricción sobre el nombre del producto y la aplicamos en caso necesario
  if (cadena) {
    filtro.nombre = { $regex: cadena };
  }
  // Vemos si hay restricciones sobre la categoría del producto y las aplicamos en caso necesario
  if (categoria == "medicamentos") {
    filtro._id = { $regex: "^MED" };
  } else if (categoria == "parafarmacia") {
    filtro._id = { $regex: "^PAR" };
  } else if (categoria == "otros") {
    filtro._id = { $regex: "^PR" };
  } else if (categoria == "meds_y_para") {
    filtro._id = { $regex: "^(MED|PAR)" };
  } else if (categoria == "meds_y_otros") {
    filtro._id = { $regex: "^(MED|PR)" };
  } else if (categoria == "para_y_otros") {
    filtro._id = { $regex: "^(PAR|PR)" };
  }
  // Si es "todos", no entra en ninguno y se queda vacío por lo que devuelve todo el catálogo
  // Una vez construido el filtro realizamos la consulta correspondiente
  const resultado = await db.collection("producto").find(filtro).toArray();
  res.json(resultado);
});

// Obtener los nombres de las distintas familias farmacológicas:
app.get("/api/familias", async (req, res) => {
  const resultado = await db.collection("principio").distinct("familias");
  res.json(resultado);
});

// Conexión a MySQL
const db_mysql = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "farmacia",
  waitForConnections: true,
  connectionLimit: 10,
});

// Funcionalidades con MySQL:

// Obtener los nombres de los laboratorios registrados en la base de datos:
app.get("/api/laboratorios", async (req, res) => {
  const [resultado] = await db_mysql.query("SELECT nombre FROM laboratorio");
  res.json(resultado);
});

// Obtener los datos de un laboratorio concreto:
app.get("/api/laboratorios/:nombre", async (req, res) => {
  const { nombre } = req.params;
  const [resultado] = await db_mysql.query(
    "SELECT * FROM laboratorio where nombre = ?",
    nombre,
  );
  res.json(resultado);
});

// Obtener estadísticas de los productos de un laboratorio en concreto:
app.get("/api/laboratorios/:nombre/estadisticas", async (req, res) => {
  const { nombre } = req.params;
  const sql = `SELECT 
                COUNT(codigo) AS total_medicamentos,
                ROUND(AVG(precio),2) AS precio_medio
              FROM producto p INNER JOIN medicamento m on p.codigo = m.codigo_medicamento
              WHERE m.nombre_laboratorio = ?`;

  // Obtener los 3 medicamentos más vendidos del laboratorio
  const sqlTop3 = `SELECT 
                    p.codigo, p.nombre, m.cantidad, m.forma,
                    SUM(i.cantidad) AS unidades_vendidas
                  FROM incluye i INNER JOIN producto p on i.codigo_producto = p.codigo
                  INNER JOIN MEDICAMENTO m on m.codigo_medicamento = p.codigo
                  WHERE m.nombre_laboratorio = ? 
                  GROUP BY p.codigo 
                  ORDER BY unidades_vendidas DESC
                  LIMIT 3
                  `;

  const [estadisticasGlobales] = await db_mysql.query(sql, [nombre]);
  const [top3] = await db_mysql.query(sqlTop3, [nombre]);

  res.json({
    total_productos: estadisticasGlobales[0].total_medicamentos,
    precio_medio: estadisticasGlobales[0].precio_medio,
    top3: top3,
  });
});

// Obtener los principios pertenecientes a una familia concreta:
app.get("/api/familias/:familia/principios", async (req, res) => {
  const { familia } = req.params;
  const sql = `
    SELECT p.id, p.nombre 
    FROM CLASIFICADO c INNER JOIN PRINCIPIO p ON c.id_principio = p.id
    WHERE c.nombre_familia = ?
  `;

  const [resultado] = await db_mysql.query(sql, [familia]);
  res.json(resultado);
});

// Obtener todos los medicamentos basados en un principio concreto:
app.get("/api/principios/:principio/medicamentos", async (req, res) => {
  const { principio } = req.params;
  const sql = `
  SELECT DISTINCT p.nombre 
  FROM BASADO b INNER JOIN PRODUCTO p ON b.codigo_medicamento = p.codigo
  WHERE b.id_principio = ?
  `;

  const [resultado] = await db_mysql.query(sql, [principio]);
  const principios = resultado.map((medicamento) => medicamento.nombre);
  res.json(principios);
});

// Obtener todas las incompatibilidades de un principio concreto:
app.get("/api/principios/:principio/incompatibilidades", async (req, res) => {
  const { principio } = req.params;
  const sql = `SELECT pr2.nombre AS nombre_incompatible
                FROM incompatible i
                INNER JOIN principio pr2 ON i.id_principio_contraindicado = pr2.id
                WHERE i.id_principio = ?;`;
  const [resultado] = await db_mysql.query(sql, principio);
  res.json(resultado);
});

// Obtener el nombre completo y número de la seguridad social de los empleados EN PLANTILLA:
app.get("/api/trabajadores", async (req, res) => {
  const [resultado] = await db_mysql.query(
    "SELECT nombre, apellidos, num_ss FROM trabajador WHERE fecha_desvinculacion IS NULL",
  );
  res.json(resultado);
});

// Datos académicos (titulaciones) de un empleado en concreto
app.get("/api/trabajadores/titulaciones", async (req, res) => {
  // El formato del número de la seguridad social da problemas (contiene una /), así que lo pasamos como query
  const { num_ss } = req.query;
  const sql = `
  SELECT nombre_titulacion, institucion 
  FROM obtuvo 
  WHERE num_ss_trabajador = ?
  `;
  const [resultado] = await db_mysql.query(sql, [num_ss]);
  res.json(resultado);
});

// Obtener el stock del lote de un producto concreto:
app.get("/api/productos/stock/:codigo/:lote", async (req, res) => {
  const { codigo, lote } = req.params;
  const sql = `SELECT 
      (SELECT IFNULL(SUM(c.cantidad), 0) FROM contiene c WHERE c.codigo_producto = ? AND c.num_lote = ?) -
      (SELECT IFNULL(SUM(i.cantidad), 0) FROM incluye i WHERE i.codigo_producto = ? AND i.num_lote = ?) AS stock_lote
  `;
  const [resultado] = await db_mysql.query(sql, [codigo, lote, codigo, lote]);
  res.json(resultado);
});

// Obtener el precio de un producto a partir de su código:
app.get("/api/productos/precio/:codigo_producto", async (req, res) => {
  const { codigo_producto } = req.params;
  const [resultado] = await db_mysql.query(
    "SELECT precio FROM producto WHERE codigo = ?",
    codigo_producto,
  );
  res.json(resultado);
});

// Avisar de posibles incompatibilidades entre medicamentos:
app.post("/api/incompatibilidades/comprobar", async (req, res) => {
  const { codigos } = req.body;

  const sql = `SELECT 
        p1.nombre AS medicamento1, 
        p2.nombre AS medicamento2, 
        pr1.nombre AS principio_activo, 
        pr2.nombre AS principio_incompatible
    FROM producto p1
        INNER JOIN basado b1 ON p1.codigo = b1.codigo_medicamento
        INNER JOIN principio pr1 ON pr1.id = b1.id_principio
        INNER JOIN incompatible i ON b1.id_principio = i.id_principio 
        INNER JOIN principio pr2 ON pr2.id = i.id_principio_contraindicado
        INNER JOIN basado b2 ON pr2.id = b2.id_principio
        INNER JOIN producto p2 ON p2.codigo = b2.codigo_medicamento
    WHERE 
        p1.codigo IN (?) AND p2.codigo IN (?) 
        AND p1.codigo < p2.codigo;`;

  try {
    const [resultado] = await db_mysql.query(sql, [codigos, codigos]);
    if (resultado.length > 0) {
      const alerta = resultado[0];
      const mensaje = `El medicamento ${alerta.medicamento1} (Principio: ${alerta.principio_activo}) presenta incompatibilidades con ${alerta.medicamento2} (Principio: ${alerta.principio_incompatible})`;
      res.json({ incompatibilidad: true, mensaje: mensaje });
    } else {
      res.json({ incompatibilidad: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error en el servidor al intentar registrar incompatibilidades",
    });
  }
});

// Verificar si un médico está registrado:
app.get("/api/medicos/:num_colegiado", async (req, res) => {
  const { num_colegiado } = req.params;
  const sql = `SELECT * FROM medico WHERE num_colegiado = ?`;
  const [resultado] = await db_mysql.query(sql, [num_colegiado]);
  let medico = false;
  if (resultado.length > 0) {
    medico = true;
  }
  res.json(medico);
});

// Registrar un nuevo médico:
app.post("/api/medicos/registrar", async (req, res) => {
  const { num_colegiado, nombre, apellidos, hospital, especialidad } = req.body;
  const sql = `INSERT INTO medico (num_colegiado, nombre, apellidos, hospital, especialidad) VALUES (?,?,?,?,?)`;
  try {
    const [resultado] = await db_mysql.query(sql, [
      num_colegiado,
      nombre,
      apellidos,
      hospital,
      especialidad,
    ]);
    res.status(201).json({
      mensaje: "Médico registrado con éxito",
    });
  } catch (error) {
    console.error(errror);
    res.status(500).json({ error: "Error al insertar" });
  }
});

// Insertar una nueva receta:
app.post("/api/recetas", async (req, res) => {
  const { fecha_emision, num_colegiado, fecha_caducidad } = req.body;
  const sql =
    "INSERT INTO receta (fecha_emision,num_colegiado_medico,fecha_caducidad) VALUES (?,?,?)";
  try {
    const [resultado] = await db_mysql.query(sql, [
      fecha_emision,
      num_colegiado,
      fecha_caducidad,
    ]);
    res.status(201).json({
      mensaje: "Receta insertada con éxito",
      id_receta: resultado.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al insertar" });
  }
});

app.get("/api/productos/:nif", async (req, res) => {
  const { nif } = req.params;
  const sql = `SELECT codigo_producto FROM contiene WHERE nif_almacen =?`;
  const [resultado] = await db_mysql.query(sql, [nif]);
  res.json(resultado);
});

// Insertar una nueva compra:
app.post("/api/compras", async (req, res) => {
  const { num_ss, fecha, id_receta } = req.body;
  const sql =
    "INSERT INTO compra (num_ss_vendedor,fecha,id_receta) VALUES (?,?,?)";
  try {
    const [resultado] = await db_mysql.query(sql, [num_ss, fecha, id_receta]);
    res.status(201).json({
      mensaje: "Compra registrada con éxito",
      id_compra: resultado.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: "Error al insertar en la base de datos" });
  }
});

// Insertar "filas de ticket" (tabla 'incluye'):
app.post("/api/compras/detalles", async (req, res) => {
  const { id_compra, detalles } = req.body;
  const sql =
    "INSERT INTO incluye (id_compra,codigo_producto,num_lote,cantidad,precio_venta) VALUES (?,?,?,?,?)";
  try {
    let totalCompra = 0;
    for (const detalle of detalles) {
      await db_mysql.query(sql, [
        id_compra,
        detalle.codigo_producto,
        detalle.num_lote,
        detalle.cantidad,
        detalle.precio,
      ]);
      totalCompra += parseFloat(detalle.precio) * parseInt(detalle.cantidad);
    }
    res.status(201).json({
      mensaje: `Detalle de la compra ${id_compra} insertados con éxito`,
      importe: totalCompra.toFixed(2),
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error al insertar los detalles de la compra" });
  }
});

// Añadir los medicamentos de una receta (tabla 'aparece'):
app.post("/api/receta/detalles", async (req, res) => {
  const { id_receta, detalles } = req.body;
  const sql =
    "INSERT INTO aparece (codigo_medicamento,id_receta,instrucciones) VALUES (?,?,?)";
  try {
    for (const detalle of detalles) {
      await db_mysql.query(sql, [
        detalle.codigo_producto,
        id_receta,
        detalle.instrucciones,
      ]);
    }
    res.status(201).json({
      mensaje: `Medicamentos asociados a la receta ${id_receta} con éxito`,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al registrar los medicamentos de la receta" });
  }
});

// Eliminar una compra:
app.delete("/api/compras/eliminar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await db_mysql.query(
      "DELETE FROM compra WHERE id = ?",
      [id],
    );
    res.status(200).json("Compra eliminada con éxito");
  } catch (error) {
    console.error(error);
    res.status(500).json("Error al intentar eliminar la compra");
  }
});

// Eliminar una receta:
app.delete("/api/recetas/eliminar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [resultado] = await db_mysql.query(
      "DELETE FROM receta WHERE id = ?",
      [id],
    );
    res.status(200).json("Receta eliminada con éxito");
  } catch (error) {
    res.status(500).json("Error al intentar eliminar la receta");
  }
});

// Obtener los datos de los proveedores con los que trabajamos actualmente y el total de pedidos realizados a cada uno:
app.get("/api/proveedores", async (req, res) => {
  const [resultado] = await db_mysql.query(
    `SELECT a.*, COUNT(p.num_albaran) AS total_pedidos FROM almacen a LEFT JOIN pedido p on a.nif = p.nif_almacen GROUP BY a.nif`,
  );
  res.json(resultado);
});

// Obtener los 3 productos con menor stock en la farmacia:
app.get("/api/productos/stock/top5", async (req, res) => {
  const sql = `SELECT p.codigo, p.nombre, 
    (SELECT IFNULL(SUM(c.cantidad), 0) FROM contiene c WHERE c.codigo_producto = m.codigo_medicamento) -
    (SELECT IFNULL(SUM(i.cantidad), 0) FROM incluye i WHERE i.codigo_producto = m.codigo_medicamento) AS stock
  FROM medicamento m 
  INNER JOIN producto p ON m.codigo_medicamento = p.codigo
  ORDER BY stock ASC
  LIMIT 5;`;
  const [resultado] = await db_mysql.query(sql);
  res.json(resultado);
});

// Dejar de colaborar con un proveedor:
app.put("/api/proveedores/dejarDeColaborar/:nif", async (req, res) => {
  const { nif } = req.params;
  try {
    const [resultado] = await db_mysql.query(
      "UPDATE almacen SET activo = FALSE where nif = ?",
      [nif],
    );
    if (resultado.affectedRows > 0) {
      res.status(200).json("Estado actualizado correctamente");
    } else {
      res.status(404).json("Error: Almacén no encontrado");
    }
  } catch (error) {
    res.status(500).json("Error al intentar actualizar en la base de datos");
  }
});

// Volver a colaborar con un proveedor:
app.put("/api/proveedores/volverAColaborar/:nif", async (req, res) => {
  const { nif } = req.params;
  try {
    const [resultado] = await db_mysql.query(
      "UPDATE almacen SET activo = TRUE where nif = ?",
      [nif],
    );
    if (resultado.affectedRows > 0) {
      res.status(200).json("Estado actualizado correctamente");
    } else {
      res.status(404).json("Error: Almacén no encontrado");
    }
  } catch (error) {
    res.status(500).json("Error al intentar actualizar en la base de datos");
  }
});

// Número de albarán del último pedido realizado en el mes actual (y año) a un proveedor:
app.get("/api/albaran/:mes/:ano/:almacen", async (req, res) => {
  const { mes, ano, almacen } = req.params;
  const sql = `
  SELECT num_albaran 
  FROM pedido 
  WHERE nif_almacen = ? 
  AND num_albaran LIKE ? 
  ORDER BY num_albaran DESC 
  LIMIT 1
  `;

  const [resultado] = await db_mysql.query(sql, [
    almacen,
    `ALB-${ano}-${mes}-%`,
  ]);

  const albaran = resultado.map((albaran) => albaran.num_albaran);
  res.json(albaran);
});

// Registrar un pedido:
app.post("/api/pedidos", async (req, res) => {
  const { num_albaran, nif_almacen, num_ss_trabajador, fecha_emision } =
    req.body;
  const sql =
    "INSERT INTO pedido (num_albaran,nif_almacen,num_ss_trabajador,fecha_emision) VALUES (?,?,?,?)";
  try {
    const [resultado] = await db_mysql.query(sql, [
      num_albaran,
      nif_almacen,
      num_ss_trabajador,
      fecha_emision,
    ]);
    res.status(201).json({ mensaje: "Pedido registrado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al insertar en la base de datos" });
  }
});

// Insertar detalles del pedido (tabla 'contiene'):
app.post("/api/pedidos/detalles", async (req, res) => {
  const { num_albaran, nif_almacen, detalles } = req.body;
  const sql =
    "INSERT INTO contiene (num_albaran,nif_almacen,codigo_producto,num_lote,cantidad,coste_unitario) VALUES (?,?,?,?,?,?)";
  try {
    let totalPedido = 0;
    for (const detalle of detalles) {
      const coste = detalle.precio / 1.7;
      await db_mysql.query(sql, [
        num_albaran,
        nif_almacen,
        detalle.codigo_producto,
        detalle.num_lote,
        detalle.cantidad,
        parseFloat(coste.toFixed(2)), // Para que conserve el tipo numérico
      ]);
      totalPedido += coste * parseInt(detalle.cantidad);
    }
    res.status(201).json({
      mensaje: `Detalles del pedido insertados con éxito`,
      importe: totalPedido.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al insertar los detalles del pedido" });
  }
});

// Eliminar un pedido:
app.delete("/api/pedidos/eliminar/:albaran/:nif", async (req, res) => {
  const { albaran, nif } = req.params;
  try {
    await db_mysql.query(
      "DELETE FROM pedido WHERE num_albaran = ? AND nif_almacen = ?",
      [albaran, nif],
    );
    res.status(200).json({ mensaje: "Pedido cancelado con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "No se pudo cancelar el pedido" });
  }
});

// Devolver el total de empleados en plantilla
app.get("/api/trabajadores/total", async (req, res) => {
  const [resultado] = await db_mysql.query(
    "SELECT COUNT(num_ss) AS total_trabajadores FROM trabajador WHERE fecha_desvinculacion IS NULL",
  );
  res.json(resultado[0].total_trabajadores);
});

// Masa salarial (suma de los sueldos)
app.get("/api/trabajadores/sueldos/total", async (req, res) => {
  const [resultado] = await db_mysql.query(
    "SELECT SUM(sueldo) AS masa_salarial FROM trabajador WHERE fecha_desvinculacion IS NULL",
  );
  res.json(resultado[0].masa_salarial);
});

// Total en ventas en el mes actual:
app.get("/api/compras/total_mensual", async (req, res) => {
  const [resultado] = await db_mysql.query(`
      SELECT IFNULL(SUM(i.cantidad * i.precio_venta),0) AS beneficio_total 
      FROM COMPRA c
      INNER JOIN INCLUYE i ON c.id = i.id_compra
      WHERE MONTH(c.fecha) = MONTH(CURDATE()) AND 
      YEAR(c.fecha) = YEAR(CURDATE())
    `);

  res.json(resultado[0].beneficio_total);
});

// Obtener los 3 empleados con más ventas en el mes actual (y dicho número):
app.get("/api/compras/lideres", async (req, res) => {
  const [resultado] = await db_mysql.query(`
    SELECT t.nombre, t.apellidos, COUNT(c.id) AS num_ventas
      FROM trabajador t
      INNER JOIN compra c ON t.num_ss = c.num_ss_vendedor
      WHERE MONTH(c.fecha) = MONTH(CURRENT_DATE()) 
        AND YEAR(c.fecha) = YEAR(CURRENT_DATE())
      GROUP BY t.num_ss
      ORDER BY num_ventas DESC
      LIMIT 3`);
  res.json(resultado);
});

// Obtener los datos de los últimos 3 pedidos realizados en el mes actual:
app.get("/api/pedidos/ultimos_tres", async (req, res) => {
  const [resultado] = await db_mysql.query(`
      SELECT p.num_albaran, 
        a.nombre AS nombre_almacen, 
        t.nombre AS nombre_trabajador, 
        t.apellidos AS apellidos_trabajador, 
        DATE_FORMAT(p.fecha_emision, '%d/%m/%Y') AS fecha_emision
      FROM pedido p
      INNER JOIN almacen a ON p.nif_almacen = a.nif
      INNER JOIN trabajador t ON p.num_ss_trabajador = t.num_ss
      ORDER BY p.fecha_emision DESC
      LIMIT 3`);
  res.json(resultado);
});

// Insertar un nuevo empleado:
app.post("/api/trabajadores/nuevo", async (req, res) => {
  const {
    num_ss,
    nombre,
    apellidos,
    telefono,
    fecha_incorporacion,
    fecha_desvinculacion,
    sueldo,
  } = req.body;
  const sql = `INSERT INTO trabajador (num_ss,nombre,apellidos,telefono,fecha_incorporacion,fecha_desvinculacion,sueldo) 
  VALUES (?,?,?,?,?,?,?)`;

  try {
    const [resultado] = await db_mysql.query(sql, [
      num_ss,
      nombre,
      apellidos,
      telefono,
      fecha_incorporacion,
      fecha_desvinculacion,
      sueldo,
    ]);
    res
      .status(201)
      .json({ mensaje: "Datos del trabajador registrados con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al insertar los datos del trabajador" });
  }
});

// Comprobar que una titulación está en la base de datos
app.post("/api/titulaciones/nueva", async (req, res) => {
  const { nombre, institucion } = req.body;

  try {
    // Vemos si la titulación ya está registrada en la base de datos
    const [filas] = await db_mysql.query(
      "SELECT * FROM TITULACION WHERE nombre = ? AND institucion = ?",
      [nombre, institucion],
    );

    // Si el array está vacío (titulación no registrada), insertamos la titulación
    if (filas.length == 0) {
      await db_mysql.query(
        "INSERT INTO TITULACION (nombre, institucion) VALUES (?, ?)",
        [nombre, institucion],
      );
      return res
        .status(201)
        .json({ mensaje: "Titulación registrada con éxito" });
    }
    // En caso contrario seguimos adelante
    res.status(200).json("Titulación ya existente en la base de datos");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar la titulación" });
  }
});

// Enlazar un trabajador con sus titulaciones:
// Insertar la relación entre trabajador y titulación en la tabla intermedia
app.post("/api/obtuvo", async (req, res) => {
  const { num_ss_trabajador, nombre_titulacion, institucion, fecha_obtencion } =
    req.body;

  const sql = `INSERT INTO obtuvo (num_ss_trabajador, nombre_titulacion, institucion, fecha_obtencion) VALUES (?, ?, ?, ?)`;

  try {
    await db_mysql.query(sql, [
      num_ss_trabajador,
      nombre_titulacion,
      institucion,
      fecha_obtencion,
    ]);

    res
      .status(201)
      .json({ mensaje: "Titulación enlazada al trabajador con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Error al registrar la titulación del trabajador" });
  }
});

// Dar de baja un empleado:
app.put("/api/trabajadores/baja/:num_ss", async (req, res) => {
  const { num_ss } = req.params;
  const sql =
    "UPDATE trabajador SET fecha_desvinculacion = CURDATE() WHERE num_ss = ?";
  try {
    const [resultado] = await db_mysql.query(sql, num_ss);
    if (resultado.affectedRows > 0) {
      res.status(200).json("Empleado dado de baja con éxito");
    } else {
      res.status(404).json("Empleado no encontrado");
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la base de datos" });
  }
});

// Actualizar el sueldo de un trabajador:
app.put("/api/trabajadores/sueldo/modificar", async (req, res) => {
  const { num_ss, sueldo } = req.body;
  const sql =
    "UPDATE trabajador SET sueldo = ? WHERE num_ss = ? AND fecha_desvinculacion IS NULL";
  try {
    const [resultado] = await db_mysql.query(sql, [sueldo, num_ss]);
    if (resultado.affectedRows > 0) {
      res.status(200).json("Salario actualizado con éxito");
    } else {
      res.status(404).json("Empleado no encontrado");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el salario" });
  }
});

// Actualizar el teléfono de un trabajador:
app.put("/api/trabajadores/telefono/modificar", async (req, res) => {
  const { num_ss, telefono } = req.body;
  const sql =
    "UPDATE trabajador SET telefono = ? WHERE num_ss = ? AND fecha_desvinculacion IS NULL";
  try {
    const [resultado] = await db_mysql.query(sql, [telefono, num_ss]);
    if (resultado.affectedRows > 0) {
      res.status(200).json("Teléfono actualizado con éxito");
    } else {
      res.status(404).json("El empleado no existe o ya está dado de baja");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error interno al actualizar el teléfono" });
  }
});

app.listen(3000, () => {
  console.log("Servidor escuchando en http://localhost:3000");
});
