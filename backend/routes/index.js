const express = require('express');
const router = express.Router();

// Importar os controladores ou funções que tratam das operações CRUD
const {
  cadastrarHotel,
  atualizarHotel,
  buscarHoteis,
  cadastrarReserva,
  atualizarReserva,
  cadastrarHospedeNaReserva,
  atualizarHospedeNaReserva,
  buscarHospedeNaReserva
} = require('../controllers/hotelController'); // Substitua pelo nome do arquivo de controladores

// Rotas
router.post('/cadastrarHotel', cadastrarHotel);
router.put('/atualizarHotel/:id', atualizarHotel);
router.get('/buscarHotel', buscarHoteis);
router.post('/cadastrarReserva', cadastrarReserva);
router.put('/atualizarReserva/:id', atualizarReserva);
router.post('/cadastrarHospedeNaReserva', cadastrarHospedeNaReserva);
router.put('/atualizarHospedeNaReserva/:id', atualizarHospedeNaReserva);
router.get('/buscarHospedeNaReserva/:id', buscarHospedeNaReserva);

module.exports = router;
