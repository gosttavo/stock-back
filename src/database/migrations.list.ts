import { CreateUsuarioTable1711801468579 } from "./migrations/1711801468579-CreateUsuarioTable";
import { CreateEmpresaTable1712972515016 } from "./migrations/1712972515016-CreateEmpresaTable";
import { AddForeignKeyEmpresaForUsuario1713040028097 } from "./migrations/1713040028097-AddForeignKeyEmpresaForUsuario";

export const migrations = [
    CreateEmpresaTable1712972515016,
    CreateUsuarioTable1711801468579,
    AddForeignKeyEmpresaForUsuario1713040028097
]