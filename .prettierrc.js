module.exports = {
    tabWidth: 2,
    useTabs: false,
    singleQuote: false,
    trailingComma: "es5",
    semi: true,
    printWidth: 120,
    bracketSpacing: true,
    overrides: [
        {
            files: ["*.scss", "*.css"],
            options: {
                requirePragma: false,
                parser: "scss",
            },
        }
        // {
        //     files: "*.html",
        //     options: {
        //         requirePragma: false,
        //         parser: "html",
        //         htmlWhitespaceSensitivity: "ignore",
        //     },
        // },
        // {
        //     files: "*.hbs",
        //     options: {
        //     requirePragma: false,
        //     parser: "glimmer",
        //     singleQuote: false,
        //     htmlWhitespaceSensitivity: "ignore",
        //     }
        // }
    ],
};
