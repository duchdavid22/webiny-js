// @flow
import React from "react";
import { Input } from "webiny-ui/Input";
import type { RenderFieldPluginType } from "webiny-app-forms/types";

export default ({
    type: "forms-field-render",
    name: "forms-field-render-firstName",
    field: {
        type: "firstName",
        render({ field }) {
            return <Input label={field.label} />;
        }
    }
}: RenderFieldPluginType);
