const testDir = './tests';
const testResults = `${testDir}/results`;

module.exports = {
  testDir,
  testResults,
  testCoverageDir: `${testResults}/coverage`,
  testArtifactsDir: `${testResults}/artifacts`,
  testWebReportDir: `${testResults}/web-report`,
};
