import { Request, Response, NextFunction } from 'express';
import UsuarioRepository from '../repositories/UsuarioRepository';
import IUsuario from '../interfaces/IUsuario';
import CargoRepository from '../repositories/CargoRepository';
import utils from '../lib/utils';

class UsuarioController {
    public getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const reqEmpresa = Number(req.query.empresa);

            if (!reqEmpresa) {
                return res.status(400).json({message: 'Company not found'});
            }

            const userId = Number(req.params.id);

            if (!userId) {
                return res.status(400).json({message: 'User not informed'});
            }

            const user = await UsuarioRepository.getUser({
                empresa: reqEmpresa,
                id: userId
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).send({
                user
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Internal server error',
                error: error
            });
        }
    };

    public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const reqEmpresa = req.query.empresa;

            if (!reqEmpresa) {
                return res.status(400).json({message: 'Company not found'});
            }

            const params = {
                skip: req.query.skip ? Number(req.query.skip) : 0
            }

            const users = await UsuarioRepository.getUsers(
                { empresa: reqEmpresa, params }
            );

            return res.status(200).send({
                users
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Internal server error',
                error: error
            });
        }
    };

    public addNewUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const reqEmpresa = Number(req.query.empresa);

            if (!reqEmpresa) {
                return res.status(400).json({message: 'Company not found'});
            }

            const { cpf, cargo } = req.body;

            if (!cpf) {
                return res.status(400).json({message: 'CPF not informed'});
            }

            if (!cargo) {
                return res.status(400).json({message: 'Role not informed'});
            }

            if (!utils.cpfValidate(cpf)) {
                return res.status(400).json({message: 'Invalid CPF'});
            }

            const userExists = await UsuarioRepository.getUser({ 
                cpf
            });

            if (!userExists) {
                return res.status(404).json({ message: 'User not found' });
            }

            const cargoExists = await CargoRepository.getCargo({
                empresa: reqEmpresa,
                id: cargo
            });

            if (!cargoExists) {
                return res.status(404).json({ message: 'Role not found' });
            }

            const userToBeAdded: IUsuario = {
                ...userExists,
                empresa: reqEmpresa,
                cargo: cargoExists
            }

            const userUpdated = await UsuarioRepository.updateUser(userToBeAdded);

            if (!userUpdated) {
                return res.status(500).json({ message: 'Error while adding user on company' });
            }

            return res.status(200).json({
                message: 'User added on company successfully!',
                user: userUpdated.id
            });
        
        } catch (error) {
            return res.status(500).json({ 
                message: 'Internal server error',
                error: error
            });
        }
    };

    public storeUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const { nome, email, senha, cpf } = req.body;

            if (!nome || !email || !senha || !cpf) {
                return res.status(400).json({ message: 'Missing required fields' });
            }

            if (!utils.cpfValidate(cpf)) {
                return res.status(400).json({ message: 'Invalid CPF' });
            }

            const userExists = await UsuarioRepository.getUser({
                email
            });

            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            const formatedCpf = cpf.replace(/[^\d]/g, '');

            const userToCreate: IUsuario = await UsuarioRepository.createNewUser({ 
                nome, 
                email, 
                senha, 
                cpf: formatedCpf 
            });

            if (!userToCreate) {
                return res.status(500).json({ message: 'Error while creating user' });
            }

            return res.status(200).json({
                message: 'User created successfully',
                user: userToCreate.id
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Internal server error',
                error: error
            });
        }
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const reqEmpresa = Number(req.query.empresa);

            if (!reqEmpresa) {
                return res.status(400).json({message: 'Company not found'});
            }

            const userId = Number(req.params.id);

            if (!userId) {
                return res.status(400).json({message: 'User not found'});
            }

            const { nome, email, cpf, cargo } = req.body;

            if (
                cpf &&
                !utils.cpfValidate(cpf)
            ) {
                return res.status(400).json({message: 'Invalid CPF'});
            }
        
            if (cargo) {
                const cargoExists = await CargoRepository.getCargo({
                    empresa: reqEmpresa,
                    id: cargo
                });
    
                if (!cargoExists) {
                    return res.status(404).json({ message: 'Role not found' });
                }
            }

            const userToUpdate = await UsuarioRepository.getUser({
                empresa: reqEmpresa,
                id: userId
            });

            if (!userToUpdate) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            (typeof nome !== 'undefined') ? userToUpdate.nome = nome : null;
            (typeof email !== 'undefined') ? userToUpdate.email = email : null;
            (typeof cargo !== 'undefined') ? userToUpdate.cargo = cargo : null;

            if (typeof cpf !== 'undefined') {
                const formatedCpf = cpf.replace(/[^\d]/g, '');
                
                userToUpdate.cpf = formatedCpf;
            }

            const userUpdated = await UsuarioRepository.updateUser(userToUpdate);

            if (!userUpdated) {
                return res.status(500).json({ message: 'Error while updating user' });
            }

            return res.status(200).json({
                message: 'User updated successfully',
                user: userUpdated.id
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Internal server error',
                error: error
            });
        }
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        try {
            const reqEmpresa = Number(req.query.empresa);

            if (!reqEmpresa) {
                return res.status(400).json({message: 'Company not found'});
            }

            const userId = Number(req.params.id);

            if (!userId) {
                return res.status(400).json({message: 'User not found'});
            }

            const userToDelete = await UsuarioRepository.getUser({
                empresa: reqEmpresa,
                id: userId
            });

            if (!userToDelete) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userDeleted = await UsuarioRepository.deleteUser(userId);

            if (!userDeleted) {
                return res.status(500).json({ message: 'Error while deleting user' });
            }

            return res.status(200).json({
                message: 'User deleted successfully'
            });
        } catch (error) {
            return res.status(500).json({ 
                message: 'Internal server error',
                error: error
            });
        }
    };
}

export default new UsuarioController;