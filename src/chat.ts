import * as github from '@actions/github';
import * as axios from 'axios';
import { Status } from './status';

const statusColorPalette: { [key in Status]: string } = {
  success: "#2cbe4e",
  cancelled: "#ffc107",
  failure: "#ff0000"
};

const statusText: { [key in Status]: string } = {
  success: "Succeeded",
  cancelled: "Cancelled",
  failure: "Failed"
};

const textButton = (text: string, url: string) => ({
  textButton: {
    text,
    onClick: { openLink: { url } }
  }
});

export async function notify(url: string, headerName: string, headerIconUrl: string, status: Status, versionApp: string, releaseNote: string, urlDownload: string) {
  const { owner, repo } = github.context.repo;
  const { eventName, sha } = github.context;
  const { number } = github.context.issue;
  const repoUrl = `https://github.com/${owner}/${repo}`;
  const eventPath = eventName === 'pull_request' ? `/pull/${number}` : `/commit/${sha}`;
  const eventUrl = `${repoUrl}${eventPath}`;

  const body = {
    card: [{
      sections: [
        {
          widgets: [
            {
              keyValue: {
                topLabel: "version",
                content: `${versionApp}`,
                contentMultiline: false
              }
            },
            {
              keyValue: {
                topLabel: "Release Note",
                content: `${releaseNote}`,
                contentMultiline: true
              }
            }
          ]
        },
        {
          widgets: [
            {
              keyValue: {
                content: "Changes Code",
                button: textButton("CHECK", eventUrl)
              }
            }
          ]
        },
        {
          widgets: [{
            buttons: [textButton("DOWNLOAD APK", urlDownload)]
          }]
        }
      ],
      header: {
        title: `${headerName}`,
        subtitle: `<b><font color="${statusColorPalette[status]}">${statusText[status]}</font></b>`,
        imageUrl: `${headerIconUrl}`,
        imageStyle: "AVATAR"
      }
    }]
  };

  const body2 = {
    cards: [{
      sections: [
        {
          widgets: [
            {
              keyValue: {
                topLabel: "Version",
                content: `${versionApp}`,
                contentMultiline: false
              }
            },
            {
              keyValue: {
                topLabel: "Release Note",
                content: `${releaseNote}`,
                contentMultiline: true
              }
            }
          ]
        },
        {
          widgets: [{
            textParagraph: {
              text: `<b>${headerName} <font color="${statusColorPalette[status]}">${statusText[status]}</font></b>`
            }
          }]
        },
        {
          widgets: [
            {
              keyValue: {
                topLabel: "repository",
                content: `${owner}/${repo}`,
                contentMultiline: true,
                button: textButton("OPEN REPOSITORY", repoUrl)
              }
            },
            {
              keyValue: {
                topLabel: "event name",
                content: eventName,
                button: textButton("OPEN EVENT", eventUrl)
              }
            }
          ]
        }
      ],
      header: {
        title: `${headerName}`,
        subtitle: `<b><font color="${statusColorPalette[status]}">${statusText[status]}</font></b>`,
        imageUrl: `${headerIconUrl}`,
        imageStyle: "AVATAR"
      }
    }]
  };

  const response = await axios.default.post(url, body2);
  if (response.status !== 200) {
    throw new Error(`Google Chat notification failed. response status=${response.status}, full response=${response}`);
  }
}