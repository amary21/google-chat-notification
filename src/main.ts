import * as core from '@actions/core';
import * as JobStatus from './status';
import * as GoogleChat from './chat';

async function run() {
  try {
    const url = core.getInput('url', { required: true });
    const headerName = core.getInput('header_name', { required: true });
    const headerIconUrl = core.getInput('header_icon_url', { required: true });
    const status = JobStatus.parse(core.getInput('status', { required: true }));
    const versionApp = JobStatus.parse(core.getInput('version_app', { required: true }));
    const releaseNote = JobStatus.parse(core.getInput('release_note', { required: true }));
    const urlDownload = core.getInput('url_download', { required: true });

    core.debug(`input params: url=${url}, header_name=${headerName}, header_icon_url=${headerIconUrl}, status=${status}, version_app=${versionApp}, release_note=${releaseNote} url_download=${urlDownload}`);

    await GoogleChat.notify(name, url, status, openCheckUrl);
    console.info('Sent message.')
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else if (typeof error === 'string') {
      core.setFailed(error);
    } else {
      core.setFailed('unexpected error');
    }
  }
}

run();
