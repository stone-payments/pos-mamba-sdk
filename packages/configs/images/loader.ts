export default {
  loader: 'url-loader',
  options: {
    fallback: 'file-loader',
    limit: 1,
    outputPath: 'assets/',
    name: './images/[name].[ext]',
  },
};
