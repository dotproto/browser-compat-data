/* This file is a part of @mdn/browser-compat-data
 * See LICENSE file for more information. */
import yargs from 'yargs';

import { updateChromiumReleases } from './chrome.js';
import { updateEdgeReleases } from './edge.js';
import { updateFirefoxReleases } from './firefox.js';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: npm run update-browser-releases -- (flags)')
  .option('chrome', {
    describe: 'Update Google Chrome',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('webview', {
    describe: 'Update Google Webview',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('edge', {
    describe: 'Update Microsoft Edge',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('firefox', {
    describe: 'Update Mozilla Firefox',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('all', {
    describe: 'Update all browsers (default)',
    type: 'boolean',
    group: 'Engine selection:',
  })
  .option('desktop', {
    describe: 'Update desktop releases',
    type: 'boolean',
    group: 'Device selection:',
  })
  .option('mobile', {
    describe: 'Update mobile releases',
    type: 'boolean',
    group: 'Device selection:',
  })
  .option('alldevices', {
    describe: 'Update all devices (default)',
    type: 'boolean',
    group: 'Device selection:',
  })
  .help()
  .parse();

// Read arguments
const updateAllBrowsers =
  argv['all'] ||
  !(argv['chrome'] || argv['webview'] || argv['firefox'] || argv['edge']);
const updateChrome = argv['chrome'] || updateAllBrowsers;
const updateWebview = argv['webview'] || updateAllBrowsers;
const updateFirefox = argv['firefox'] || updateAllBrowsers;
const updateEdge = argv['edge'] || updateAllBrowsers;
const updateAllDevices =
  argv['alldevices'] || !(argv['mobile'] || argv['desktop']);
const updateMobile = argv['mobile'] || updateAllDevices;
const updateDesktop = argv['desktop'] || updateAllDevices;

const options = {
  chrome_desktop: {
    bcdFile: './browsers/chrome.json',
    bcdBrowserName: 'chrome',
    browserEngine: 'Blink',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'canary',
    releaseNoteCore: 'stable-channel-update-for-desktop',
    firstRelease: 1,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
  chrome_android: {
    bcdFile: './browsers/chrome_android.json',
    bcdBrowserName: 'chrome_android',
    browserEngine: 'Blink',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'canary',
    releaseNoteCore: 'chrome-for-android-update',
    firstRelease: 25,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
  webview_android: {
    bcdFile: './browsers/webview_android.json',
    bcdBrowserName: 'webview_android',
    browserEngine: 'Blink',
    releaseBranch: 'stable',
    betaBranch: 'beta',
    nightlyBranch: 'canary',
    releaseNoteCore: 'chrome-for-android-update',
    firstRelease: 37,
    skippedReleases: [82], // 82 was skipped during COVID
    chromestatusURL: 'https://chromestatus.com/api/v0/channels',
  },
  edge_desktop: {
    bcdFile: './browsers/edge.json',
    bcdBrowserName: 'edge',
    browserEngine: 'Blink',
    releaseBranch: 'Stable',
    betaBranch: 'Beta',
    nightlyBranch: 'Dev',
    firstRelease: 12,
    skippedReleases: [
      12, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35,
      36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53,
      54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
      72, 73, 74, 75, 76, 77, 78, 82,
    ],
    edgeupdatesURL:
      'https://edgeupdates.microsoft.com/api/products?view=enterprise',
    releaseScheduleURL:
      'https://raw.githubusercontent.com/MicrosoftDocs/Edge-Enterprise/public/edgeenterprise/microsoft-edge-release-schedule.md',
  },
  firefox_desktop: {
    bcdFile: './browsers/firefox.json',
    bcdBrowserName: 'firefox',
    betaBranch: 'beta',
    nightlyBranch: 'nightly',
    firstRelease: 1,
    skippedReleases: [],
    firefoxReleaseDateURL: 'https://whattrainisitnow.com/api/firefox/releases/',
    firefoxESRDateURL: 'https://whattrainisitnow.com/api/esr/releases/',
    firefoxScheduleURL:
      'https://whattrainisitnow.com/api/release/schedule/?version=',
  },
  firefox_android: {
    bcdFile: './browsers/firefox_android.json',
    bcdBrowserName: 'firefox_android',
    betaBranch: 'beta',
    nightlyBranch: 'nightly',
    firstRelease: 4,
    skippedReleases: [11, 12, 13, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78],
    firefoxReleaseDateURL: 'https://whattrainisitnow.com/api/firefox/releases/',
    firefoxESRDateURL: 'https://whattrainisitnow.com/api/esr/releases/',
    firefoxScheduleURL:
      'https://whattrainisitnow.com/api/release/schedule/?version=',
  },
};

if (updateChrome && updateDesktop) {
  console.log('### Updates for Chrome for Desktop');
  await updateChromiumReleases(options.chrome_desktop);
}

if (updateChrome && updateMobile) {
  console.log('### Updates for Chrome for Android');
  await updateChromiumReleases(options.chrome_android);
}

if (updateWebview && updateMobile) {
  console.log('### Updates for Webview for Android');
  await updateChromiumReleases(options.webview_android);
}

if (updateEdge && updateDesktop) {
  console.log('### Updates for Edge for Desktop');
  await updateEdgeReleases(options.edge_desktop);
}

if (updateFirefox && updateDesktop) {
  console.log('### Updates for Firefox for Desktop');
  await updateFirefoxReleases(options.firefox_desktop);
}

if (updateFirefox && updateMobile) {
  console.log('### Updates for Firefox for Android');
  await updateFirefoxReleases(options.firefox_android);
}
