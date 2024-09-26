const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();
const JWT_SECRET = 'seu-segredo-aqui';

router.post('/register', (req, res) => {
    const { username, password, confirmPassword } = req.body;
    let { role } = req.body;

    if (!role) {
        role = 'user';        
    }

    console.log('Dados recebidos:', { username, role }); 

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'As senhas não coincidem.'
        });
    }

    db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) {
            console.error('Erro ao verificar o usuário:', err);
            return res.status(500).json({ message: 'Erro ao verificar o usuário.'});
        }
        if (row) {
            return res.status(400).json({ message: 'Usuário já existe.'});
        }

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao registrar o usuário.'});
            }

        db.run('INSERT INTO users (username, password, role) VALUES (?,?,?)', [username, password, role], function (err) {
            if (err) {
                console.error('Erro ao inserir o usuário:', err);
                return res.status(500).json({ message: 'Erro ao registrar o usuário.'});
            }
            res.status(201).json({ message: 'Usuário registrado com sucesso.'});
            });
        });
    });
});

router.get('/users', (req, res) => {
    const { username, id } = req.query;

    if (username) {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
            if(err){
                console.error('Erro ao buscar usuário:', err);
                return res.status(500).json({ message: 'Erro ao buscar usuário.'});
            }
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado.'});
            }
            res.json(user);
        });
    } else if (id) {
        db.
    }
});


