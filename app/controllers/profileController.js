//* Functionnality : user profile infos and track orders
import { User } from '../models/index.js'
import { Scrypt } from "../Auth/Scrypt.js";
import Joi from 'joi';

export default { 
    async show(req, res, next) {
        // Vérifier si l'utilisateur est connecté
        if (!req.session.user) {
            req.session.message = {
                text: 'Vous devez être connecté pour accéder à cette page',
                type: 'is-warning'
            };
            return res.redirect('/connexion'); // Rediriger vers la page de connexion
        }
    
        const message = req.session.message || null;
        req.session.message = null;
    
        const id = req.session.user.id;
    
        // Vérifier si l'utilisateur essaie d'accéder à son propre profil
        if (req.session.user.id != id) {
            req.session.message = {
                text: 'Vous n\'êtes pas autorisé à accéder à ce profil',
                type: 'is-danger'
            };
            return res.redirect('/'); // Rediriger vers la page d'accueil ou une autre page appropriée
        }
    
        const user = await User.findByPk(id);
        if (!user) {
            req.session.message = {
                text: 'Utilisateur non trouvé',
                type: 'is-danger'
            };
            return res.redirect('/');
        }
    
        res.render('profil', { 
            user, 
            message, 
            title: "GreenRoots - Mon profil", 
            cssFile: "profil.css" 
        });
    },

    async update(req, res, next) {
        const id = Number(req.session.user.id);
        const {lastname, firstname, adress, email, password} = req.body;

        const schema = Joi.object({
            lastname: Joi.string().min(1).max(255),
            firstname: Joi.string().min(1).max(255),
            adress: Joi.string().min(1).max(255),
            email: Joi.string().email().min(5).max(255),
            password: Joi.string().min(6).max(255),
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return next(error);
        }
        
        const user = await User.findByPk(id);
        if (!user) {
            req.session.message = {
                text: 'Utilisateur non trouvé',
                type: 'is-danger'
            };
            return res.redirect('back');
        }
        const hashPassword = Scrypt.hash(password);
        
        const updateUser = await user.update({
            lastname, 
            firstname, 
            adress, 
            email, 
            password: hashPassword
        });

        req.session.message = {
            text: 'Modification effectuée avec succès',
            type: 'is-success'
        };

        return res.redirect('back');
     },

    async delete(req, res) {
        const id = Number(req.session.user.id);
        const result = await User.destroy({where: {id: id}});

        if(result === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
       
            
        }




        req.session.destroy((err) => {
            if (err) {
                console.error("Erreur lors de la destruction de la session:", err);
            }
            console.log("Session détruite, redirection vers la page d'accueil");
            res.redirect('/');

        });
    }
 };        
        
        
        



        
       
    
 
   
