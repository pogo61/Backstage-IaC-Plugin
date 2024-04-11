module.exports = {
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: 'ts-loader', // This specifies that we want to use ts-loader
                exclude: /node_modules/, // We don't want to apply the loader to node_modules
            },
        ],
    },
    // plugins: [new HtmlWebpackPlugin({ template: './src/components/HasSubcomponentsCard.ts' })],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
};
