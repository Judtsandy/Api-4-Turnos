const express = require("express");
const router = express.Router();
const controller = require("../controller/turnoController");
const { apiAuth } = require("../middleware/authMiddleware");

// Health check específico del módulo
router.get("/health", (req, res) => {
  res.json({ status: "OK", module: "turnos" });
});

// Todas las rutas requieren autenticación
router.use(apiAuth);

// Endpoints principales
router.post("/turnos", controller.createTurno);
router.put("/turnos/:id/cancelar", controller.cancelTurno);
router.get("/turnos", controller.listTurnos);
router.get("/turnos/disponibilidad", controller.getAvailableTurnos);

module.exports = router;
