export default {
  loader: 'url-loader',
  options: {
    fallback: 'file-loader',
    limit: 1, // Copy font files instead of inserting them on the css
    outputPath: 'assets/',
    name: './fonts/[name].[ext]',
  },
};
