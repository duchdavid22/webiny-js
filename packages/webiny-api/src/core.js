// @flow
import type Schema from "./graphql/Schema";
import { SecurityService } from "./services";
import { GraphQLUnionType } from "graphql";
import createLoginQueries from "./security/graphql/createLoginQueries";
import createListEntitiesQueries from "./security/graphql/createListEntitiesQueries";
import convertToGraphQL from "./attributes/convertToGraphQL";
import {
    ApiToken,
    Entity,
    File,
    Image,
    Group,
    Groups2Entities,
    Policy,
    Policies2Entities,
    User
} from "./index";

// Attributes registration functions
import registerBufferAttribute from "./attributes/registerBufferAttribute";
import registerPasswordAttribute from "./attributes/registerPasswordAttribute";
import registerIdentityAttribute from "./attributes/registerIdentityAttribute";
import registerFileAttributes from "./attributes/registerFileAttributes";
import registerImageAttributes from "./attributes/registerImageAttributes";

export default () => {
    return {
        async init(params: Object, next: Function) {
            const { app } = params;

            // Configure Entity layer
            if (app.config.entity) {
                // Register Entity driver
                Entity.driver = app.config.entity.driver;
                // Register attributes
                app.config.entity.attributes &&
                    app.config.entity.attributes({
                        bufferAttribute: registerBufferAttribute,
                        passwordAttribute: registerPasswordAttribute,
                        identityAttribute: registerIdentityAttribute,
                        fileAttributes: registerFileAttributes,
                        imageAttributes: registerImageAttributes
                    });
            }

            app.services.register("security", () => {
                return new SecurityService(app.config.security);
            });

            await app.services.get("security").init();

            app.graphql.schema((schema: Schema) => {
                schema.addAttributeConverter(convertToGraphQL);
                schema.addEntity(ApiToken);
                schema.addEntity(File);
                schema.addEntity(Image);
                schema.addEntity(Group);
                schema.addEntity(Groups2Entities);
                schema.addEntity(Policy);
                schema.addEntity(Policies2Entities);
                schema.addEntity(User);

                schema.addType({
                    meta: {
                        type: "union"
                    },
                    type: new GraphQLUnionType({
                        name: "IdentityType",
                        types: () =>
                            app.config.security.identities.map(({ identity: Identity }) => {
                                return schema.getType(Identity.classId);
                            }),
                        resolveType(identity) {
                            return schema.getType(identity.classId);
                        }
                    })
                });

                schema.addAttributeConverter(convertToGraphQL);

                // Create login queries
                createLoginQueries(app, app.config, schema);
                createListEntitiesQueries(app, app.config, schema);
            });

            app.entities.addEntityClass(ApiToken);
            app.entities.addEntityClass(File);
            app.entities.addEntityClass(Image);
            app.entities.addEntityClass(Group);
            app.entities.addEntityClass(Groups2Entities);
            app.entities.addEntityClass(Policy);
            app.entities.addEntityClass(Policies2Entities);
            app.entities.addEntityClass(User);

            next();
        },

        async install(params: Object, next: Function) {
            const { default: install } = await import("./install");
            await install();

            next();
        }
    };
};
