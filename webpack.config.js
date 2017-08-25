
module.exports = {
    entry: './src/js/main.ts',
    output: {
        filename: 'bundle.js'
    },
    devtool: "source-map",
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {loader: "ts-loader"}
                ]
            }
        ],
        loaders: [
            { test: /\.(glsl|frag|vert)$/, loader: 'raw-loader', exclude: /node_modules/ },
            { test: /\.(glsl|frag|vert)$/, loader: 'glslify-loader', exclude: /node_modules/ }
        ]
    }
}