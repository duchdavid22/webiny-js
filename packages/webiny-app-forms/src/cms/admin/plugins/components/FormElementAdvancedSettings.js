// @flow
import * as React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { get } from "lodash";
import { Grid, Cell } from "webiny-ui/Grid";
import { AutoComplete } from "webiny-ui/AutoComplete";
import styled from "react-emotion";

const FormOptionsWrapper = styled("div")({
    minHeight: 250
});

const getOptions = ({ gqlResponse, data }): Object => {
    const output: Object = {
        parents: {
            options: [],
            value: null
        },
        publishedRevisions: {
            options: [],
            value: null
        }
    };

    const selected = {
        parent: get(data, "settings.form.parent"),
        revision: get(data, "settings.form.revision")
    };

    const parentsList = get(gqlResponse, "data.forms.listForms.data") || [];

    output.parents.options = parentsList.map(({ id, name }) => ({ id, name }));
    output.parents.value = output.parents.options.find(item => item.id === selected.parent) || null;

    const parent = parentsList.find(item => item.id === selected.parent);
    if (parent) {
        output.publishedRevisions.options = parent.publishedRevisions.map(({ id, name }) => ({
            id,
            name
        }));
        output.publishedRevisions.value =
            output.publishedRevisions.options.find(item => item.id === selected.revision) || null;
    }

    return output;
};

const FormElementAdvancedSettings = ({ Bind, data }: Object) => {
    return (
        <FormOptionsWrapper>
            <Query
                query={gql`
                    {
                        forms {
                            listForms {
                                data {
                                    id
                                    name
                                    publishedRevisions {
                                        id
                                        name
                                        published
                                    }
                                }
                            }
                        }
                    }
                `}
            >
                {gqlResponse => {
                    const options = getOptions({ gqlResponse, data });
                    return (
                        <Grid>
                            <Cell span={12}>
                                <Bind name={"settings.form.parent"} validators={["required"]}>
                                    {({ onChange }) => {
                                        return (
                                            <AutoComplete
                                                options={options.parents.options}
                                                value={options.parents.value}
                                                onChange={onChange}
                                                label={"Form"}
                                                description="Type to search for the form you wish to insert."
                                            />
                                        );
                                    }}
                                </Bind>
                                <Bind name={"settings.form.revision"} validators={["required"]}>
                                    {({ onChange }) => {
                                        return (
                                            <AutoComplete
                                                options={options.publishedRevisions.options}
                                                value={options.publishedRevisions.value}
                                                onChange={onChange}
                                                label={"Form"}
                                                description="Type to search for the form you wish to insert."
                                            />
                                        );
                                    }}
                                </Bind>
                            </Cell>
                        </Grid>
                    );
                }}
            </Query>
        </FormOptionsWrapper>
    );
};

export default FormElementAdvancedSettings;
