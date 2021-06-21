import fs from 'fs';
import path from 'path';
import { assign } from 'lodash-es';
import stringify from 'json-stable-stringify-without-jsonify';
import { cosmiconfig, defaultLoaders } from 'cosmiconfig';
import { lightfetch } from 'lightfetch-node';
import { gqlQueryCreator } from 'gql-query-creator';

/* eslint-disable no-dupe-keys */
const initVariables = {
  username: '',
  captcha: {
    token: ''
  },
  endpoints: {
    gql: '',
    restful: '',
    login: ''
  },
  markdown: {
    length: '',
    removeMarkdown: ''
  },
  previewCount: {
    comments: ''
  },
  experimentalFeatures: '',
  createDatabaseFlag: ''
};
const moduleName = 'replapi';
const explorer = cosmiconfig(moduleName, {
  searchPlaces: ['package.json', `.${moduleName}rc`, `.${moduleName}rc.json`, `.${moduleName}rc.yaml`, `.${moduleName}rc.yml`, `.${moduleName}rc.js`, `.${moduleName}rc.cjs`, `${moduleName}.config.js`, `${moduleName}.config.cjs`, `${moduleName}.config.mjs`],
  loaders: {
    defaultLoaders,
    '.mjs': async filepath => {
      const val = await import(filepath);
      return val;
    }
  }
});
explorer.search().then(result => {
  if (result !== null) assign(initVariables, result.config);
}).catch(() => {
  throw new Error('Could not read configuration files!');
});
const constants = {
  initVariables,
  roleAttributes: {
    id: '',
    name: '',
    key: '',
    tagline: ''
  },
  languageAttributes: {
    id: '',
    displayName: '',
    key: '',
    category: '',
    tagline: '',
    icon: '',
    isNew: ''
  },
  organizationAttributes: {
    id: '',
    name: '',
    country: '',
    postalCode: '',
    state: '',
    city: '',
    googlePlaceId: '',
    timeCreated: '',
    timeUpdated: '',
    timeDeleted: '',
    time_created: ''
  },
  subscriptionAttributes: {
    id: '',
    userId: '',
    customerId: '',
    planId: '',
    timeUpdated: '',
    timeCreated: '',
    timeDeleted: ''
  },
  userAttributes: {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    bio: '',
    isVerified: '',
    displayName: '',
    fullName: '',
    url: '',
    isLoggedIn: '',
    isSubscribed: '',
    timeCreated: '',
    isBannedFromBoards: '',
    karma: '',
    isHacker: '',
    image: ''
  },
  boardAttributes: {
    id: '',
    name: '',
    description: '',
    slug: '',
    cta: '',
    titleCta: '',
    bodyCta: '',
    template: '',
    buttonCta: '',
    color: '',
    replRequired: '',
    isLocked: '',
    isAnswerable: '',
    isPrivate: '',
    timeCreated: '',
    timeUpdated: '',
    url: '',
    canPost: ''
  },
  tagAttributes: {
    id: '',
    replCount: '',
    replsTaggedTodayCount: '',
    creatorCount: '',
    isTrending: ''
  },
  replAttributes: {
    id: '',
    language: '',
    isRenamed: '',
    isProject: '',
    isPrivate: '',
    isStarred: '',
    isAlwaysOn: '',
    isBoosted: '',
    title: '',
    slug: '',
    description: '',
    timeCreated: '',
    timeUpdated: '',
    isOwner: '',
    pinnedToProfile: '',
    folderId: '',
    folder: {
      args: [],
      items: {
        id: '',
        name: ''
      }
    },
    files: '',
    size: '',
    url: '',
    url: [{
      propOverride: true,
      lite: true
    }, 'liteUrl'],
    hostedUrl: '',
    hostedUrl: [{
      propOverride: true,
      dotty: true
    }, 'dottyUrl'],
    hostedUrl: [{
      propOverride: true,
      protocol: 'WSS'
    }, 'wssUrl'],
    terminalUrl: '',
    runCount: '',
    publicForkCount: '',
    imageUrl: '',
    reactions: {
      args: [],
      items: {
        id: '',
        type: '',
        count: ''
      }
    },
    origin: {
      args: [],
      items: {
        url: ''
      }
    },
    ioTests: {
      args: [],
      items: {
        id: '',
        name: '',
        template: {
          args: [],
          items: {
            id: ''
          }
        }
      },
      hasUnitTesting: '',
      unitTests: {
        args: [],
        items: {
          tests: {
            args: [],
            items: {
              id: '',
              name: '',
              code: ''
            }
          },
          meta: {
            args: [],
            items: {
              imports: '',
              setup: '',
              tearDown: ''
            }
          }
        }
      }
    }
  },
  replCommentAttributes: {
    id: '',
    body: '',
    timeCreated: '',
    timeUpdated: '',
    canEdit: '',
    canComment: ''
  },
  commentAttributes: {
    id: '',
    body: '',
    voteCount: '',
    timeCreated: '',
    timeUpdated: '',
    url: '',
    isAuthor: '',
    canEdit: '',
    canVote: '',
    canComment: '',
    hasVoted: '',
    canReport: '',
    hasReported: '',
    isAnswer: '',
    canSelectAsAnswer: '',
    canUnselectAsAnswer: '',
    preview: [{
      propOverride: true,
      length: initVariables.markdown.length || 150,
      removeMarkdown: initVariables.markdown.removeMarkdown || true
    }]
  },
  postAttributes: {
    id: '',
    title: '',
    body: '',
    showHosted: '',
    voteCount: '',
    commentCount: '',
    isPinned: '',
    isLocked: '',
    timeCreated: '',
    timeUpdated: '',
    url: '',
    isAnnouncement: '',
    isAuthor: '',
    canEdit: '',
    canComment: '',
    canVote: '',
    canPin: '',
    canSetType: '',
    canChangeBoard: '',
    canLock: '',
    hasVoted: '',
    canReport: '',
    hasReported: '',
    isAnswerable: '',
    tutorialPages: '',
    preview: [{
      propOverride: true,
      length: initVariables.markdown.length || 150,
      removeMarkdown: initVariables.markdown.removeMarkdown || true
    }]
  },
  graphql: `${initVariables.endpoints.gql || 'https://replit.com/graphql'}`,
  login: `${initVariables.endpoints.login || 'https://replit.com/login'}`,
  restful: `${initVariables.endpoints.restful || 'https://replit.com'}`
};

const headers = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
  Connection: 'keep-alive',
  'X-Requested-With': 'the ReplAPI.it Project',
  Referrer: 'https://replit.com/',
  Origin: 'https://replit.com/'
};

async function runGraphQL({
  name,
  variables,
  items
}, options = {}) {
  const body = gqlQueryCreator(name, variables, items);

  if (options.authRequired === true) {
    if (!global.cookies) throw new Error('ReplAPI.it Error: You are not logged in! Please use the Login class to set your login.');
    if (!['RayhanADev', 'ReplAPIit'].includes(constants.initVariables.username) || !['RayhanADev', 'ReplAPIit'].includes(process.env.REPL_OWNER)) throw new Error('ReplAPI.it Error: This user is not whitelisted. To gain access to the whitelist contact RayhanADev.');
    headers.cookie = 'connect.sid=' + global.cookies;
    body.captcha = constants.initVariables.captcha.token;
    body.clientVersion = '7561851';
    body.format = 'pbuf';
    body.hCaptchaSiteKey = '473079ba-e99f-4e25-a635-e9b661c7dd3e';
  }

  const info = await lightfetch(constants.graphql, {
    body,
    headers,
    method: 'POST'
  });

  try {
    return info.toJSON();
  } catch (error) {
    throw new Error('ReplAPI.it Error: Could not parse response data. This is likely because of some Replit error, please open an issue on the main Repository to let us know!');
  }
}

class BaseClass {
  async runGraphQL(data, options) {
    const info = await runGraphQL(data, options);
    if (info.errors) throw new Error(`\nReplit GraphQL Errors:${info.errors.map(error => `\n\t- ${error.message}`)}\n`);
    return info;
  }

}

class Board extends BaseClass {
  constructor(slug) {
    super();
    this.slug = slug;
  }

  async boardData() {
    const {
      slug
    } = this;
    const items = {
      boardBySlug: {
        args: [{
          slug: 'slug'
        }],
        items: { ...constants.boardAttributes
        }
      }
    };
    const variables = {
      slug: ['String!', slug]
    };
    const info = await this.runGraphQL({
      name: 'BoardData',
      variables,
      items
    });

    if (!info.data.boardBySlug) {
      throw new Error(`${slug} is not a board. Please query boards on Replit.`);
    } else {
      return info.data.boardBySlug;
    }
  }

  async boardPosts(after = '', count = 5, order = '') {
    const {
      slug
    } = this;
    const items = {
      boardBySlug: {
        args: [{
          slug: 'slug'
        }],
        items: {
          posts: {
            args: [{
              count: 'count',
              after: 'after',
              order: 'order'
            }],
            items: {
              items: {
                args: [],
                items: {
                  id: '',
                  title: '',
                  preview: [{
                    propOverride: true,
                    length: constants.initVariables.markdown.length || 150,
                    removeMarkdown: constants.initVariables.markdown.removeMarkdown || true
                  }]
                }
              }
            }
          }
        }
      }
    };
    const variables = {
      slug: ['String!', slug],
      after: ['String!', after],
      count: ['Int!', count],
      order: ['String!', order]
    };
    const info = await this.runGraphQL({
      name: 'BoardData',
      variables,
      items
    });

    if (!info.data.boardBySlug) {
      throw new Error(`${slug} is not a board. Please query boards on Replit.`);
    } else {
      return info.data.boardBySlug.posts.items;
    }
  }

}

const classes = {
  Board
};

const defaultInitVariables = {
  username: '',
  captcha: {
    token: ''
  },
  endpoints: {
    gql: '',
    restful: '',
    login: ''
  },
  markdown: {
    length: '',
    removeMarkdown: ''
  },
  previewCount: {
    comments: ''
  },
  experimentalFeatures: '',
  createDatabaseFlag: ''
};

function sortByKey(a, b) {
  return a.key > b.key ? 1 : -1;
}

function ReplAPI(initVariables, filetype = '.json') {
  if (initVariables) assign(defaultInitVariables, initVariables);

  switch (filetype) {
    case '.json':
      fs.writeFileSync(path.join(process.cwd(), '.replapirc.json'), `${stringify(defaultInitVariables, {
        cmp: sortByKey,
        space: 4
      })}\n`, {
        encoding: 'utf8'
      });
      break;

    case '.mjs':
      fs.writeFileSync(path.join(process.cwd(), 'replapi.config.mjs'), `export default ${stringify(defaultInitVariables, {
        cmp: sortByKey,
        space: 4
      })}\n`, {
        encoding: 'utf8'
      });
      break;

    case '.cjs':
      fs.writeFileSync(path.join(process.cwd(), 'replapi.config.cjs'), `module.exports = ${stringify(defaultInitVariables, {
        cmp: sortByKey,
        space: 4
      })}\n`, {
        encoding: 'utf8'
      });
      break;

    case '.js':
      fs.writeFileSync(path.join(process.cwd(), 'replapi.config.js'), `module.exports = ${stringify(defaultInitVariables, {
        cmp: sortByKey,
        space: 4
      })}\n`, {
        encoding: 'utf8'
      });
      break;

    default:
      console.warn(`Invalid file type '${filetype}'`);
      fs.writeFileSync(path.join(process.cwd(), '.replapirc.json'), `${stringify(defaultInitVariables, {
        cmp: sortByKey,
        space: 4
      })}\n`, {
        encoding: 'utf8'
      });
      break;
  }

  return {
    defaults: defaultInitVariables,
    Board: classes.Board
  };
}

export default ReplAPI;
