import _ from 'lodash';
import { cosmiconfig, defaultLoaders } from 'cosmiconfig';

const initVariables = {
	username: '',
	captcha: {
		token: '',
	},
	endpoints: {
		gql: '',
		restful: '',
		login: '',
	},
	markdown: {
		length: '',
		removeMarkdown: '',
	},
	previewCount: {
		comments: '',
	},
	experimentalFeatures: '',
	createDatabaseFlag: '',
};

const moduleName = 'replapi';

const explorer = cosmiconfig(moduleName, {
	searchPlaces: [
		'package.json',
		`.${moduleName}rc`,
		`.${moduleName}rc.json`,
		`.${moduleName}rc.yaml`,
		`.${moduleName}rc.yml`,
		`.${moduleName}rc.js`,
		`.${moduleName}rc.cjs`,
		`${moduleName}.config.js`,
		`${moduleName}.config.cjs`,
		`${moduleName}.config.mjs`,
	],
	loaders: {
		defaultLoaders,
		'.mjs': async (filepath) => {
			const val = await import(filepath);
			return val;
		},
	},
});

explorer
	.search()
	.then((result) => {
		if (result !== null) _.assign(initVariables, result.config);
	})
	.catch(() => {
		throw new Error('Could not read configuration files!');
	});

export default {
	initVariables,
	roleAttributes: 'id, name, key, tagline',
	languageAttributes: 'id, displayName, key, category, tagline, icon, isNew',
	organizationAttributes:
		'id, name, country, postalCode, state, city, googlePlaceId, timeCreated, timeUpdated, timeDeleted, time_created',
	subscriptionAttributes:
		'id, userId, customerId, planId, timeUpdated, timeCreated, timeDeleted',
	userAttributes:
		'id, username, firstName, lastName, bio, isVerified, displayName, fullName, url, isLoggedIn, isSubscribed, timeCreated, isBannedFromBoards, karma, isHacker, image',
	boardAttributes:
		'id, name, description, slug, cta, titleCta, bodyCta, template, buttonCta, color, replRequired, isLocked, isAnswerable, isPrivate, timeCreated, timeUpdated, url, canPost',
	tagAttributes:
		'id, replCount, replsTaggedTodayCount, creatorCount, isTrending',
	replAttributes:
		'id, language, isRenamed, isProject, isPrivate, isStarred, isAlwaysOn, isBoosted, title, slug, description, timeCreated, timeUpdated, isOwner, pinnedToProfile, folderId, folder { id, name }, files, size, url, liteUrl: url(lite: true), hostedUrl, dottyUrl: hostedUrl(dotty: true), wssUrl: hostedUrl(protocol: WSS), terminalUrl, runCount, publicForkCount, imageUrl, reactions { id, type, count }, origin { url }, ioTests { id, name, template { id } }, hasUnitTesting, unitTests { tests { id, name, code } meta { imports, setup, tearDown } }',
	replCommentAttributes:
		'id, body, timeCreated, timeUpdated, canEdit, canComment',
	commentAttributes: `id, body, voteCount, timeCreated, timeUpdated, url, isAuthor, canEdit, canVote, canComment, hasVoted, canReport, hasReported, isAnswer, canSelectAsAnswer, canUnselectAsAnswer, preview(length: ${
		initVariables.markdown.length || 150
	}, removeMarkdown: ${initVariables.markdown.removeMarkdown || true})`,
	postAttributes: `id, title, body, showHosted, voteCount, commentCount, isPinned, isLocked, timeCreated, timeUpdated, url, isAnnouncement, isAuthor, canEdit, canComment, canVote, canPin, canSetType, canChangeBoard, canLock, hasVoted, canReport, hasReported, isAnswerable, tutorialPages, preview(length: ${
		initVariables.markdown.length || 150
	}, removeMarkdown: ${initVariables.markdown.removeMarkdown || true})`,
	graphql: `${
		initVariables.endpoints.gql || 'https://staging.replit.com/graphql'
	}`,
	login: `${
		initVariables.endpoints.login || 'https://staging.replit.com/login'
	}`,
	restful: `${initVariables.endpoints.restful || 'https://staging.replit.com'}`,
};
