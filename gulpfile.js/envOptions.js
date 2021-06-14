const srcPath = './source';
const distPath = './dist';
const nodePath = './node_modules';

let envOptions = {
  string: 'env',
  default: {
    env: 'develop',
  },
  copyFile: {
    src: [
      `${srcPath}/**/*`,
      `!${srcPath}/**/*.ejs`,
      `!${srcPath}/**/*.html`,
      `!${srcPath}/assets/style/**/*.scss`,
      `!${srcPath}/assets/style/**/*.sass`,
      `!${srcPath}/assets/js/**/*.js`,
    ],
    path: distPath,
  },
  html: {
    src: [
      `${srcPath}/**/*.html`,
    ],
    ejsSrc: [
      `${srcPath}/*.ejs`,
    ],
    path: distPath,
  },
  style: {
    src: [
      `${srcPath}/assets/style/**/*.scss`,
      `${srcPath}/assets/style/**/*.sass`,
    ],
    path: `${distPath}/assets/style`,
  },
  javascript: {
    src: [
      `${srcPath}/assets/js/**/*.js`,
    ],
    concat: 'all.js',
    path: `${distPath}/assets/js`,
  },
  vendors: {
    src: [
      `${nodePath}/jquery/dist/jquery.js`,
      `${nodePath}/bootstrap/dist/js/bootstrap.bundle.min.js`,
    ],
    concat: 'vendors.js',
    path: `${distPath}/assets/js`,
  },
  images: {
    src: [
      `${srcPath}/assets/images/**/*`,
    ],
    path: `${distPath}/assets/images`,
  },
  clean: {
    src: distPath
  },
  browserDir: distPath,
  deploySrc: `${distPath}/**/*`,
};

exports.envOptions = envOptions;