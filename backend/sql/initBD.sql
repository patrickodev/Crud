CREATE TABLE tb_hotel (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) UNIQUE,
    pais VARCHAR(50),
    estado VARCHAR(50),
    cidade VARCHAR(50)
);

CREATE TABLE tb_reservas (
    id SERIAL PRIMARY KEY,
    idhotel INTEGER REFERENCES tb_hotel(id),
    numeroreserva VARCHAR(50) UNIQUE,
    apartamento VARCHAR(10),
    datacheckin DATE,
    datacheckout DATE,
    ativo BOOLEAN
);

CREATE TABLE tb_hospedes (
    id SERIAL PRIMARY KEY,
    idreserva INTEGER REFERENCES tb_reservas(id),
    nome VARCHAR(100) NOT NULL,
    sobrenome VARCHAR(100) NOT NULL
);
