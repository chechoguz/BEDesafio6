const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { email, password, rol, lenguage } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)',
            [email, hashedPassword, rol, lenguage]
        );
        res.status(201).send('Usuario registrado');
    } catch (error) {
        res.status(500).send('Error registrando usuario');
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if (result.rows.length === 0) return res.status(401).send('Credenciales inválidas');

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) return res.status(401).send('Credenciales inválidas');

        const token = jwt.sign({ email }, process.env.SECRET_KEY);
        res.json({ token });
    } catch (error) {
        res.status(500).send('Error iniciando sesión');
    }
};

const getUser = async (req, res) => {
    const { email } = req.user;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).send('Error obteniendo usuario');
    }
};

module.exports = { registerUser, loginUser, getUser };
