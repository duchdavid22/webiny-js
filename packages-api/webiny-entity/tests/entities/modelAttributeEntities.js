import { Entity, EntityModel } from "webiny-entity";

export class User extends Entity {
    constructor() {
        super();
        this.attr("firstName").char();
        this.attr("lastName").char();
        this.attr("verification").model(VerificationModel);
        this.attr("verifications").models(VerificationModel);
    }
}

export class Document extends Entity {
    constructor() {
        super();
        this.attr("file").char();
        this.attr("size").float();
        this.attr("type").char();
    }
}

export class VerificationModel extends EntityModel {
    constructor(params) {
        super(params);
        this.attr("status").char();
        this.attr("updatedOn").date();
        this.attr("document").entity(Document);
    }
}
