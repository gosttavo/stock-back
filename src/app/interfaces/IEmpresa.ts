export default interface IEmpresa {
    id?: number,
    descricao: string,
    cnpj: string,
    telefone: string,
    logradouro: string,
    cidade: number,
    ativo: boolean,
    createdAt?: Date,
    updatedAt?: Date
}