const { join } = require("path");
const loadJson = require("load-json-file");
const writeJson = require("write-json-file");
const { getStateValues } = require("@webiny/cli/helpers");

const envMap = {
    REACT_APP_API_ENDPOINT: "${cdn.url}/graphql",
    REACT_APP_FILES_PROXY: "${cdn.url}"
};

module.exports = {
    hooks: {
        async stateChanged({ env, state }) {
            const envPath = join(__dirname, ".env.json");
            const json = await loadJson(envPath);
            if (!json[env]) {
                json[env] = {};
            }
            Object.assign(json[env], await getStateValues(state, envMap));
            await writeJson(envPath, json);
        }
    }
};
