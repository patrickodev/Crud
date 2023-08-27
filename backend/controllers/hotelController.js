const pool = require('../config/database'); // Importe a pool de conexão com o banco

// Controladores para operações CRUD
const cadastrarHotel = async (req, res) => {
    const { nome, cnpj, pais, estado, cidade } = req.body;
    try {
      // Verificar se já existe um hotel com o mesmo nome ou CNPJ
      const existingHotel = await pool.query('SELECT * FROM tb_hotel WHERE nome = $1 OR cnpj = $2', [nome, cnpj]);
      if (existingHotel.rows.length > 0) {
        return res.status(400).json({ error: 'Já existe um hotel com o mesmo nome ou CNPJ' });
      }
  
      // Caso não exista, cadastrar o hotel
      const result = await pool.query(
        'INSERT INTO tb_hotel (nome, cnpj, pais, estado, cidade) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [nome, cnpj, pais, estado, cidade]
      );
      const novoId = result.rows[0].id;
      res.status(201).json({ message: 'Hotel cadastrado com sucesso', id: novoId });
     } catch (error) {
      res.status(500).json({ error: 'Erro ao cadastrar hotel' });
    }
};

const atualizarHotel = async (req, res) => {
    const hotelId = req.params.id;
    const { nome, cnpj, pais, estado, cidade } = req.body;
    try {
      // Verificar se já existe um hotel com o mesmo nome ou CNPJ
      const existingHotel = await pool.query(
        'SELECT * FROM tb_hotel WHERE (nome = $1 OR cnpj = $2) AND id != $3',
        [nome, cnpj, hotelId]        
      );
      console.log(existingHotel.rows)
      if (existingHotel.rows.length > 0) {
        return res.status(400).json({ error: 'Já existe um hotel com o mesmo nome ou CNPJ' });
      }
  
      // Atualizar os dados do hotel
      await pool.query(
        'UPDATE tb_hotel SET nome = $1, cnpj = $2, pais = $3, estado = $4, cidade = $5 WHERE id = $6',
        [nome, cnpj, pais, estado, cidade, hotelId]
      );
  
      res.json({ message: 'Hotel atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar hotel' });
    }
};

const buscarHoteis = async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tb_hotel');
        
        res.json(rows);
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar hoteis' });
      }
};

const cadastrarReserva = async (req, res) => {
    const { idhotel, numeroreserva, apartamento, datacheckin, datacheckout, ativo } = req.body;

    try {
      // Verificar se o ID do hotel é válido
      const hotelCheck = await pool.query('SELECT * FROM tb_hotel WHERE id = $1', [idhotel]);
      if (hotelCheck.rows.length === 0) {
        return res.status(400).json({ error: 'ID do hotel inválido' });
      }
  
      // Verificar se já existe uma reserva com o mesmo número de reserva
      const existingReserva = await pool.query('SELECT * FROM tb_reservas WHERE numeroreserva = $1', [numeroreserva]);
      if (existingReserva.rows.length > 0) {
        return res.status(400).json({ error: 'Já existe uma reserva com o mesmo número de reserva' });
      }
  
      // Cadastrar a reserva
      const result = await pool.query(
        'INSERT INTO tb_reservas (idhotel, numeroreserva, apartamento, datacheckin, datacheckout, ativo) VALUES ($1, $2, $3, $4, $5, $6)',
        [idhotel, numeroreserva, apartamento, datacheckin, datacheckout, ativo]
      );    
      const novoId = result.rows[0].id;
      res.status(201).json({ message: 'Reserva cadastrada com sucesso', id: novoId });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cadastrar reserva' });
    }
};

const atualizarReserva = async (req, res) => {
    const reservaId = req.params.id;
    const { idhotel, numeroreserva, apartamento, datacheckin, datacheckout, ativo } = req.body;
  
    try {
      // Verificar se a reserva existe
      const reservaCheck = await pool.query('SELECT * FROM tb_reservas WHERE id = $1', [reservaId]);
      if (reservaCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Reserva não encontrada' });
      }
  
      // Verificar se já existe uma reserva com o novo número de reserva
      const existingReserva = await pool.query(
        'SELECT * FROM tb_reservas WHERE numeroreserva = $1 AND id != $2',
        [numeroreserva, reservaId]
      );
      if (existingReserva.rows.length > 0) {
        return res.status(400).json({ error: 'Já existe uma reserva com o mesmo número de reserva' });
      }
  
      // Atualizar os dados da reserva
      await pool.query(
        'UPDATE tb_reservas SET idhotel = $1, numeroreserva = $2, apartamento = $3, datacheckin = $4, datacheckout = $5, ativo = $6 WHERE id = $7',
        [idhotel, numeroreserva, apartamento, datacheckin, datacheckout, ativo, reservaId]
      );
  
      res.json({ message: 'Reserva atualizada com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar reserva' });
    }
};

const cadastrarHospedeNaReserva = async (req, res) => {
    const { idreserva, nome, sobrenome } = req.body;

    try {
      // Verificar se a reserva existe
      const reservaCheck = await pool.query('SELECT * FROM tb_reservas WHERE id = $1', [idreserva]);
      if (reservaCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Reserva não encontrada' });
      }
  
      // Verificar se já existe um hóspede com o mesmo idreserva
      const existingHospede = await pool.query(
        'SELECT * FROM tb_hospedes WHERE idreserva = $1',
        [idreserva]
      );
      if (existingHospede.rows.length > 0) {
        return res.status(400).json({ error: 'Já existe um hóspede cadastrado para essa reserva' });
      }
  
      // Cadastrar o hóspede na reserva
      await pool.query(
        'INSERT INTO tb_hospedes (idreserva, nome, sobrenome) VALUES ($1, $2, $3)',
        [idreserva, nome, sobrenome]
      );
  
      res.status(201).json({ message: 'Hóspede cadastrado na reserva com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao cadastrar hóspede na reserva' });
    }
};

const atualizarHospedeNaReserva = async (req, res) => {
    const hospedeId = req.params.id;
    const { nome, sobrenome } = req.body;
  
    try {
      // Verificar se o hóspede existe
      const hospedeCheck = await pool.query('SELECT * FROM tb_hospedes WHERE id = $1', [hospedeId]);
      if (hospedeCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Hóspede não encontrado' });
      }
  
      // Atualizar os dados do hóspede na reserva
      await pool.query(
        'UPDATE tb_hospedes SET nome = $1, sobrenome = $2 WHERE id = $3',
        [nome, sobrenome, hospedeId]
      );
  
      res.json({ message: 'Hóspede na reserva atualizado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar hóspede na reserva' });
    }
};

const buscarHospedeNaReserva = async (req, res) => {
    const reservaId = req.params.id;

    try {
      // Verificar se a reserva existe
      const reservaCheck = await pool.query('SELECT * FROM tb_reservas WHERE id = $1', [reservaId]);
      if (reservaCheck.rows.length === 0) {
        return res.status(400).json({ error: 'Reserva não encontrada' });
      }
  
      // Buscar hóspedes na reserva
      const { rows } = await pool.query('SELECT * FROM tb_hospedes WHERE idreserva = $1', [reservaId]);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar hóspedes na reserva' });
    }
};

module.exports = {
  cadastrarHotel,
  atualizarHotel,
  buscarHoteis,
  cadastrarReserva,
  atualizarReserva,
  cadastrarHospedeNaReserva,
  atualizarHospedeNaReserva,
  buscarHospedeNaReserva
};
