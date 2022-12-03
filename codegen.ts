// import type { CodegenConfig } from '@graphql-codegen/cli'

// const config: CodegenConfig = {
//     // ...
//     generates: {
//         'path/to/file.ts': {
//             plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
//             config: {
//                 reactApolloVersion: 3
//             }
//         }
//     }
// }
// export default config

import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:3000/api',
    documents: ['app/**/*.tsx', '!pages/api/index.ts'],
    generates: {
        './src/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            }
        }
    },
    ignoreNoDocuments: true,
};

export default config;