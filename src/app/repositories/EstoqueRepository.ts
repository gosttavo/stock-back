import { DeepPartial } from "typeorm";
import { AppDataSource } from "../../database/data-source";
import IEstoque from "../interfaces/IEstoque";
import Estoque from "../models/Estoque";

class EstoqueRepository extends Estoque {
    private estoqueRepository = AppDataSource.getRepository(Estoque);

    public getEstoques = ({empresa, params}: {empresa: any, params: { skip: number, descricao?: string }}): Promise<IEstoque[]> => {
        return this.estoqueRepository
            .createQueryBuilder('estoque')
            .select('estoque')
            .where(w => {
                w.where('estoque.empresa = :empresa', { empresa })

                if (params.descricao) {
                    w.andWhere('estoque.descricao LIKE :descricao', { descricao: `%${params.descricao}%` });
                }
            })
            .skip(params.skip)
            .take(50)
            .getMany();
    }

    public getEstoque = ({empresa, id}: {empresa: number, id: number}) => {
        const estoque = this.estoqueRepository
            .createQueryBuilder('estoque')
            .select('estoque')
            .where('estoque.empresa = :empresa', { empresa })
            .andWhere('estoque.id = :id', { id })
            .getOne();
        
        return estoque;
    }

    public createNewEstoque = (Estoque: IEstoque) => {
        const newEstoque = this.estoqueRepository.create(Estoque as DeepPartial<Estoque>);
        return this.estoqueRepository.save(newEstoque);
    }

    public updateEstoque = (Estoque: IEstoque) => {
        return this.estoqueRepository.save(Estoque as DeepPartial<Estoque>);
    }

    public deleteEstoque = (id: number) => {
        return this.estoqueRepository.delete(id);
    }
}

export default new EstoqueRepository;