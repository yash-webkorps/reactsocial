module.exports = {
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };
 

// module.exports = {
//   testMatch: [
//     '(/test/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
//     '**/?(*.)+(spec|test).[tj]s?(x)',
//   ],
//   transform: {
//     '^.+\\.[t|j]sx?$': 'babel-jest',
//   },
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   globals: {
//     'ts-jest': {
//       tsconfig: 'tsconfig.json',
//     },
//   },
// };