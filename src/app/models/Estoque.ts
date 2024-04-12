import { Entity, Column, Index } from 'typeorm';

@Entity('estoque')
@Index(["account", "id"], { unique: true })
class Estoque {
    @Column('int', { nullable: false })
    account: number;

    @Column('int', { nullable: false })
    id: number;

    @Column('varchar', { length: 150, nullable: false })
    descricao: string;
}

export default Estoque;