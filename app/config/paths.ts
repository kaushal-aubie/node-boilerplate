import path from 'path';

const root = path.resolve(__dirname, '../../');
const paths = {
  templatePath: path.resolve(root, './src/views'),
  publicPath: path.resolve(root, 'public'),
  pemPath: path.resolve(root, './private.pem'),
  envPath: path.resolve(root, './env'),
};

export { paths };
