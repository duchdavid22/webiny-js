// @flow
import React from "react";
import { ReactComponent as PagesIcon } from "@webiny/app-page-builder/admin/assets/round-ballot-24px.svg";
import { hasRoles } from "@webiny/app-security";
import { i18n } from "@webiny/app/i18n";
const t = i18n.ns("app-forms/admin/menus");

export default [
    {
        name: "menu-app-page-builder",
        type: "menu",
        render({ Menu, Section, Item }: Object) {
            const { menus, categories, editor }: Object = (hasRoles({
                menus: ["pb-menus"],
                categories: ["pb-categories"],
                editor: ["pb-editor"]
            }): any);

            if (menus || categories || editor) {
                return (
                    <Menu name="content-2" label={t`Content`} icon={<PagesIcon />}>
                        <Section label={t`Pages`}>
                            {categories && (
                                <Item label={t`Categories`} path="/page-builder/categories" />
                            )}
                            {editor && <Item label={t`Pages`} path="/page-builder/pages" />}
                            {menus && <Item label={t`Menus`} path="/page-builder/menus" />}
                        </Section>
                    </Menu>
                );
            }

            return null;
        }
    }
];
