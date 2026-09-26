const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/equipamentos', (req, res) => {
    const { nome, tipo, marca, problema, status } = req.body;

    if (!nome || !nome.trim()) {
        return res.status(400).json({ mensagem: 'O nome do equipamento é obrigatório.' });
    }

    const resultado = db.prepare(
        'INSERT INTO equipamentos (nome, tipo, marca, problema, status) VALUES (?, ?, ?, ?, ?)'
    ).run(nome, tipo, marca, problema, status);

    const equipamento = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(resultado.lastInsertRowid);

    res.status(201).json(equipamento);
});

app.get('/equipamentos', (req, res) => {
    const equipamentos = db.prepare('SELECT * FROM equipamentos').all();
    res.json(equipamentos);
});

app.get('/equipamentos/:id', (req, res) => {
    const equipamento = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);

    if (!equipamento) {
        return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
    }

    res.json(equipamento);
});

app.put('/equipamentos/:id', (req, res) => {
    const existente = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);

    if (!existente) {
        return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
    }

    const nome = req.body.nome || existente.nome;
    const tipo = req.body.tipo || existente.tipo;
    const marca = req.body.marca || existente.marca;
    const problema = req.body.problema || existente.problema;
    const status = req.body.status || existente.status;

    db.prepare(
        'UPDATE equipamentos SET nome = ?, tipo = ?, marca = ?, problema = ?, status = ? WHERE id = ?'
    ).run(nome, tipo, marca, problema, status, req.params.id);

    const atualizado = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);

    res.json(atualizado);
});

app.delete('/equipamentos/:id', (req, res) => {
    const existente = db.prepare('SELECT * FROM equipamentos WHERE id = ?').get(req.params.id);

    if (!existente) {
        return res.status(404).json({ mensagem: 'Equipamento não encontrado.' });
    }

    db.prepare('DELETE FROM equipamentos WHERE id = ?').run(req.params.id);

    res.json({ mensagem: 'Equipamento excluído com sucesso.' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
