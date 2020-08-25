module.exports = {
    service: {
        name: "mystartup-apollo-server",
        endpoint: {
            url: "http://localhost:8580/graphql",
            skipSSLValidation: true, // optional, disables SSL validation check
        },
    },
};
