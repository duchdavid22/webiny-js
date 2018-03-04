// @flow
import { IdentityTable } from "webiny-api-security";

class UserTable extends IdentityTable {
    constructor() {
        super();
        this.column("email")
            .char(20)
            .setNotNull();
        this.column("password")
            .char(60)
            .setNotNull();
        this.column("firstName").char(20);
        this.column("lastName").char(20);
        this.column("enabled")
            .smallInt(1)
            .setDefault(1);

        this.index().unique("email");
    }
}

UserTable.setName("Users");

export default UserTable;
