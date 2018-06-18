import { EntityWithLogs, EntityWithoutLogs } from "./entities/entityWithLogs";
import { DateAttribute } from "webiny-model";
import { expect } from "chai";

describe("entity with logs enabled test", () => {
    beforeEach(() => EntityWithLogs.getEntityPool().flush());

    test("should not have createdOn, savedOn and updatedOn if logging is not enabled", async () => {
        const entity = new EntityWithoutLogs();

        expect(entity.getAttribute("createdOn")).to.equal(undefined);
        expect(entity.getAttribute("updatedOn")).to.equal(undefined);
        expect(entity.getAttribute("savedOn")).to.equal(undefined);
    });

    test("it must have createdOn, savedOn and updatedOn attributes defined", async () => {
        const entity = new EntityWithLogs();

        expect(entity.getAttribute("createdOn")).to.be.instanceOf(DateAttribute);
        expect(entity.getAttribute("updatedOn")).to.be.instanceOf(DateAttribute);
        expect(entity.getAttribute("savedOn")).to.be.instanceOf(DateAttribute);

        expect(entity.createdOn).to.equal(null);
        expect(entity.updatedOn).to.equal(null);
        expect(entity.savedOn).to.equal(null);
    });

    test("it must update createdOn, updatedOn and savedOn correctly when saving entity", async () => {
        const entity = new EntityWithLogs();
        entity.name = "newOne";
        await entity.save();

        const savedOn = entity.savedOn;
        const createdOn = entity.createdOn;
        const updatedOn = entity.updatedOn;

        expect(savedOn).to.be.instanceOf(Date);
        expect(createdOn).to.be.instanceOf(Date);
        expect(updatedOn).to.equal(null);

        entity.name = "newOneUpdated";
        await entity.save();

        expect(entity.savedOn).to.be.instanceOf(Date);
        expect(entity.createdOn).to.be.instanceOf(Date);
        expect(entity.updatedOn).to.be.instanceOf(Date);

        // Check that values were updated.

        expect(entity.savedOn).to.not.be.equal(savedOn);
        expect(entity.updatedOn).to.not.be.equal(updatedOn);
        expect(entity.createdOn).to.be.equal(createdOn);
    });
});
