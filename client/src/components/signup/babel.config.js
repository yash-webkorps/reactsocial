// module.exports = {
//     presets: [
//       '@babel/preset-env',
//       '@babel/preset-react',
//       '@babel/preset-typescript', // If using TypeScript
//     ],
//   };

module.exports = {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
    ],
  };
  