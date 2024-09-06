//* Functionality: Handle user registration and login

import { Scrypt } from "../Auth/Scrypt.js";
import { User } from "../models/User.js";
import validator from 'email-validator';
import jwt from 'jsonwebtoken';

export default {
    async register (req, res) {
        try { 
            const {
                role,
                lastname, 
                firstname, 
                adress, 
                email,
                password,
                confirmation: confirmationPassword
            } = req.body;

            console.log("Données reçues:", { lastname, firstname, adress, email, role, password });
            
            // Est-ce que les champs sont bien présents ? Si non : message d'erreur
            if (!lastname || !firstname || !adress || !email || !password || !role) {
                return res.render('register', { errorMessage: 'Veuillez remplir tous les champs'});
            }
            
            //On vérifie ici la validité de l'email
            if (!validator.validate(email)) {
                return res.render('register', {
                    errorMessage: "Email invalide",
                });
            }

            //On vérifie si les MP correspondent
            if (password !== confirmationPassword) {
                return res.render('register', {
                    errorMessage: 'Les mots de passe ne correspondent pas'
                });
            }

            //On vérifie que l'adresse email n'existe pas déjà dans la BDD
            const existingEmail = await User.findOne({
                where: { email },
            });

            if (existingEmail) {
                return res.render('register', {
                    errorMessage: "Une erreur s'est produite",
                });
            }

            //On hash le MP
            const hashPassword = Scrypt.hash(password);

            //On stock l'utilisateur en BDD
            await User.create({
                role,
                lastname, 
                firstname, 
                adress, 
                email,
                password: hashPassword,
            });

            res.redirect('connection');

        } catch (error) {
            console.error(error);
            res.status(500).render('500');
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.render('login', { errorMessage: 'Veuillez remplir tous les champs' });
            }

            if (!validator.validate(email)) {
                return res.render('login', {
                    errorMessage: "Email invalide",
                });
            }

            const user = await User.findOne({
                where: { email },
            });

            if (!user || !Scrypt.compare(password, user.password)) {
                return res.render('login', {
                    errorMessage: "Email ou mot de passe incorrect",
                });
            }

            //On génère le token JWT
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.cookie('token', token, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production' 
            });

            res.redirect('/homePage');

        } catch (error) {
            console.error(error);
            res.status(500).render('500');
        }
    }
};

/*

const newUsers = await User.findAll({
    order: [['id', 'DESC']], // Trie par date de création, du plus récent au plus ancien
    limit: 10 // Limite le nombre de résultats à 10 (ou le nombre que vous souhaitez)
});

console.log(newUsers);
*/