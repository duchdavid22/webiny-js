// @flow

import { Attribute } from "webiny-model";
import _ from "lodash";
import EntityAttributeValue from "./entityAttributeValue";
import type { EntityAttributesContainer } from "./..";
import EntityError from "./../entityError";
import { EntityAttributeOptions } from "./../../types";
import { Entity } from "..";
import ModelError from "../../../webiny-model/src/modelError";

declare type EntityClass = Class<Entity> | Array<Class<Entity>>;

class EntityAttribute extends Attribute {
    value: EntityAttributeValue;
    classes: { entity: { class: Class<Entity> | Array<Class<Entity>> } };
    auto: { save: boolean, delete: boolean };
    options: EntityAttributeOptions;

    constructor(
        name: string,
        attributesContainer: EntityAttributesContainer,
        entity: EntityClass,
        options: EntityAttributeOptions = {}
    ) {
        super(name, attributesContainer);

        // This attribute is async because we need to load entities both on set and get calls.
        this.async = true;

        this.options = options;

        this.classes = {
            entity: { class: entity }
        };

        /**
         * Auto save is always enabled, but delete not. This is because users will more often create many to one relationship than
         * one to one. If user wants a strict one to one relationship, then delete flag must be set to true. In other words, it would
         * be correct to say that if auto delete is enabled, we are dealing with one to one relationship.
         * @type {{save: boolean, delete: boolean}}
         */
        this.auto = { save: true, delete: false };

        /**
         * Before save, let's validate and save linked entity.
         *
         * This ensures that parent entity has a valid ID which can be stored and also that all nested data is valid since
         * validation will be called internally in the save method. Save operations will be executed starting from bottom
         * nested entities, ending with the main parent entity.
         */
        const parentEntity = this.getParentModel().getParentEntity();
        parentEntity.on("beforeSave", async () => {
            // At this point current value is an instance or is not instance. It cannot be in the 'loading' state, because that was
            // already checked in the validate method - if in that step entity was in 'loading' state, it will be waited before proceeding.
            if (this.getAutoSave() && this.value.getCurrent() instanceof Entity) {
                // We don't need to validate here because validate method was called on the parent entity, which caused
                // the validation of data to be executed recursively on all attribute values.
                await this.value.getCurrent().save({ validation: false });

                // If initially we had a different entity linked, we must delete it.
                // If initial is empty, that means nothing was ever loaded (attribute was not accessed) and there is nothing to do.
                // Otherwise, deleteInitial method will internally delete only entities that are not needed anymore.
                if (this.getAutoSave() && this.getAutoDelete()) {
                    await this.value.deleteInitial();
                }
            }

            // Set current entities as new initial values.
            this.value.syncInitial();
        });

        /**
         * Once parent entity starts the delete process, we must also make the same on all linked entities.
         * The deletes are done on initial storage entities, not on entities stored as current value.
         */
        parentEntity.on("delete", async () => {
            if (this.getAutoDelete()) {
                await this.value.load();
                const entity = this.value.getInitial();
                if (entity instanceof this.getEntityClass()) {
                    await entity.emit("delete");
                }
            }
        });

        parentEntity.on("beforeDelete", async () => {
            if (this.getAutoDelete()) {
                await this.value.load();
                const entity = this.value.getInitial();
                if (entity instanceof this.getEntityClass()) {
                    // We don't want to fire the "delete" event because its handlers were already executed by upper 'delete' listener.
                    // That listener ensured that all callbacks that might've had blocked the deleted process were executed.
                    await entity.delete({ validation: false, events: { delete: false } });
                }
            }
        });
    }

    /**
     * Returns AttributeValue class to be used on construct.
     * @returns {AttributeValue}
     */
    getAttributeValueClass() {
        return EntityAttributeValue;
    }

    /**
     * Should linked entity be automatically saved once parent entity is saved? By default, linked entities will be automatically saved,
     * after main entity was saved. Can be disabled, although not recommended since manual saving needs to be done in that case.
     * @param autoSave
     * @returns {EntityAttribute}
     */
    setAutoSave(autoSave: boolean = true): EntityAttribute {
        this.auto.save = autoSave;
        return this;
    }

    /**
     * Returns true if auto save is enabled, otherwise false.
     * @returns {boolean}
     */
    getAutoSave(): boolean {
        return this.auto.save;
    }

    /**
     * Should linked entity be automatically deleted once parent entity is deleted? By default, linked entities will be automatically
     * deleted, before main entity was deleted. Can be disabled, although not recommended since manual deletion needs to be done in that case.
     * @param autoDelete
     * @returns {EntityAttribute}
     */
    setAutoDelete(autoDelete: boolean = true): EntityAttribute {
        this.auto.delete = autoDelete;
        return this;
    }

    /**
     * Returns true if auto delete is enabled, otherwise false.
     * @returns {boolean}
     */
    getAutoDelete(): boolean {
        return this.auto.delete;
    }

    getEntityClass(): ?Class<Entity> {
        if (Array.isArray(this.classes.entity.class)) {
            let classIdAttribute = this.getParentModel().getAttribute(
                this.options.classIdAttribute
            );
            if (classIdAttribute) {
                const classId = classIdAttribute.getValue();
                for (let i = 0; i < this.classes.entity.class.length; i++) {
                    let current = this.classes.entity.class[i];
                    if (current.classId === classId) {
                        return current;
                    }
                }
            }

            return undefined;
        }

        return this.classes.entity.class;
    }

    getClassIdAttribute(): ?Attribute {
        return this.getParentModel().getAttribute(this.options.classIdAttribute);
    }

    hasMultipleEntityClasses(): boolean {
        return Array.isArray(this.classes.entity.class);
    }

    canAcceptAnyEntityClass(): boolean {
        return this.hasMultipleEntityClasses() && this.classes.entity.class.length === 0;
    }

    setEntityClass(entity: Class<Entity>) {
        this.classes.entity.class = entity;
        return this;
    }

    /**
     * @param value
     * @returns {Promise<any>}
     */
    setValue(value: mixed) {
        if (!this.canSetValue()) {
            return;
        }

        const finalValue = this.onSetCallback(value);

        // If we are dealing with multiple Entity classes, we must assign received classId into
        // attribute specified by the "classIdAttribute" option (passed on attribute construction).
        const multipleClasses = this.hasMultipleEntityClasses();

        if (finalValue instanceof Entity) {
            this.value.setCurrent(finalValue);
            if (multipleClasses) {
                const classIdAttribute = this.getClassIdAttribute();
                if (classIdAttribute) {
                    classIdAttribute.setValue(finalValue.classId);
                }
            }
            return;
        }

        if (finalValue instanceof Object) {
            // We only populate if value does not have an ID, otherwise we save ID as a value.
            if (
                this.getParentModel()
                    .getParentEntity()
                    .isId(finalValue.id)
            ) {
                this.value.setCurrent(finalValue);
                return;
            }

            let entityClass = this.getEntityClass();
            if (entityClass) {
                this.value.setCurrent(new entityClass().populate(finalValue));
                return;
            }
        }

        this.value.setCurrent(finalValue);
    }

    /**
     * Loads current entity if needed and returns it.
     * @returns {Promise<void>}
     */
    async getValue(): Promise<mixed> {
        if (this.value.isClean()) {
            await this.value.load();
            return this.value.getCurrent();
        }

        // "Instance of Entity" check is enough at this point.
        if (this.value.getCurrent() instanceof Entity) {
            return this.value.getCurrent();
        }

        const id = _.get(this.value.getCurrent(), "id", this.value.getCurrent());
        if (
            this.getParentModel()
                .getParentEntity()
                .isId(id)
        ) {
            const entityClass = this.getEntityClass();
            if (entityClass) {
                const entity = await entityClass.findById(id);
                if (entity) {
                    // If we initially had object with other data set, we must populate entity with it, otherwise
                    // just set loaded entity (because only an ID was received, without additional data).
                    if (typeof this.value.getCurrent() === "object") {
                        entity.populate(this.value.getCurrent());
                    }
                    this.value.setCurrent(entity);
                }
            }
        }

        // If valid value was not returned until this point, we return recently set value.
        // The reason is, if the entity is about to be saved, validation must be executed and error must be thrown,
        // warning users that passed value is invalid / entity was not found.
        return this.value.getCurrent();
    }

    /**
     * Returns storage value (entity ID or null).
     * @returns {Promise<*>}
     */
    async getStorageValue() {
        // Not using getValue method because it would load the entity without need.
        let current = this.value.getCurrent();

        // But still, if the value is loading currently, let's wait for it to load completely, and then use that value.
        if (this.value.isLoading()) {
            current = await this.value.load();
        }

        const id = _.get(current, "id", current);
        return this.getParentModel()
            .getParentEntity()
            .isId(id)
            ? id
            : null;
    }

    /**
     * Sets value received from storage.
     * @param value
     * @returns {EntityAttribute}
     */
    setStorageValue(value: mixed) {
        this.value.setCurrent(value, { skipDifferenceCheck: true });
        this.value.setInitial(value);
        return this;
    }

    async getJSONValue() {
        const value = await this.getValue();
        if (value instanceof Entity) {
            return await value.toJSON();
        }
        return value;
    }

    /**
     * Validates on attribute level and then on entity level (its attributes recursively).
     * If attribute has validators, we must unfortunately always load the attribute value. For example, if we had a 'required'
     * validator, and entity not loaded, we cannot know if there is a value or not, and thus if the validator should fail.
     * @returns {Promise<void>}
     */
    async validate() {
        // If attribute is dirty, has validators or loading is in progress, wait until loaded.
        if (this.value.isDirty() || this.hasValidators() || this.value.isLoading()) {
            await this.value.load();
        }

        if (!this.value.isLoaded()) {
            return;
        }

        const value = await this.getValidationValue();

        if (this.hasMultipleEntityClasses()) {
            if (!this.options.classIdAttribute) {
                throw new ModelError(
                    `Entity attribute "${
                        this.name
                    }" accepts multiple Entity classes but does not have "classIdAttribute" option defined.`,
                    ModelError.INVALID_ATTRIBUTE
                );
            }

            let classIdAttribute = this.getClassIdAttribute();
            if (!classIdAttribute) {
                throw new ModelError(
                    `Entity attribute "${
                        this.name
                    }" accepts multiple Entity classes but classId attribute is missing.`,
                    ModelError.INVALID_ATTRIBUTE
                );
            }

            // We only do class validation if list of classes has been provided. Otherwise, we don't do the check.
            // This is because in certain cases, a list of classes cannot be defined, and in other words, any
            // class of entity can be assigned. One example is the File entity, which has an "ref" attribute, which
            // can actually link to any type of entity.
            if (!this.canAcceptAnyEntityClass()) {
                if (!this.getEntityClass()) {
                    throw new EntityError(
                        `Entity attribute "${
                            this.name
                        }" accepts multiple Entity classes but it was not found (classId attribute holds value "${classIdAttribute.getValue()}").`,
                        ModelError.INVALID_ATTRIBUTE
                    );
                }
            }
        }

        const valueValidation = this.isSet() && !Attribute.isEmptyValue(value);

        valueValidation && (await this.validateType(value));
        await this.validateAttribute(value);
        valueValidation && (await this.validateValue(value));
    }

    /**
     * Validates current value - if it's not a valid ID or an instance of Entity class, an error will be thrown.
     */
    async validateType(value: mixed) {
        if (this.isValidInstance(value)) {
            return;
        }

        this.expected("instance of Entity class", typeof value);
    }

    async validateValue(value: mixed) {
        // This validates on the entity level.
        value instanceof Entity && (await value.validate());
    }

    isValidInstance(instance: ?Entity) {
        if (this.hasMultipleEntityClasses()) {
            return instance instanceof Entity;
        }
        return instance instanceof this.getEntityClass();
    }
}

export default EntityAttribute;
