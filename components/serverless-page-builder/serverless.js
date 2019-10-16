const { join } = require("path");
const { Component } = require("@serverless/core");
const { trackComponent } = require("@webiny/tracking");
const loadJson = require("load-json-file");

const getDeps = async deps => {
    const { dependencies } = await loadJson(join(__dirname, "package.json"));
    return deps.reduce((acc, item) => {
        acc[item] = dependencies[item];
        return acc;
    }, {});
};

class ServerlessPageBuilder extends Component {
    async default({ track, ...inputs } = {}) {
        await trackComponent({ track, context: this.context, component: __dirname });

        const { plugins = [], ...rest } = inputs;

        plugins.unshift("@webiny/api-page-builder/plugins");

        // Deploy graphql API
        const apolloService = await this.load("@webiny/serverless-apollo-service");
        const output = await apolloService({
            plugins,
            ...rest,
            track: false,
            dependencies: await getDeps(["@webiny/api-page-builder"])
        });

        this.state.output = output;
        await this.save();

        return output;
    }

    async remove({ track, ...inputs } = {}) {
        await trackComponent({
            track,
            context: this.context,
            component: __dirname,
            method: "remove"
        });

        const apolloService = await this.load("@webiny/serverless-apollo-service");
        await apolloService.remove({ ...inputs, track: false });

        this.state = {};
        await this.save();
    }

    async install({ dbName, dbServer }) {
        // Generate lambda with DB data in ENV
        // Connect to DB, configure Commodo
        // Copy
    }
}

module.exports = ServerlessPageBuilder;
