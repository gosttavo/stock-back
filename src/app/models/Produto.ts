import { Entity, Column, Index, CreateDateColumn, ManyToOne } from 'typeorm';
import Empresa from './Empresa';

@Entity('produto')
@Index(["empresa", "id"], { unique: true })
class Produto {
    @ManyToOne(() => Empresa, (empresa) => empresa.produto)
    empresa: number;

    @Column('int', { nullable: false })
    id: number;

    @Column('varchar', { length: 150, nullable: false })
    descricao: string;

    @Column('int', { nullable: false })
    categoria: number;	

    @Column('int', { nullable: false })
    custo: number;

    @Column('float', { nullable: false })
    preco: number;

    @Column('int', { nullable: false })
    quantidadeMinima: number;

    @Column('int', { nullable: false })
    quantidadeMaxima: number;

    @Column('date', { nullable: false })
    validade: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

export default Produto;