var keystone = require('keystone');

keystone.init({

	'name': 'Learning Management System',
	'brand': 'LMS',

	'favicon': 'public/favicon.ico',
	'less': 'public',
	'static': 'public',

	'views': 'templates/views',
	'view engine': 'jade',

	'auto update': true,
	'mongo': process.env.MONGO_URI || process.env.MONGOLAB_URI || 'mongodb://localhost/lms',
	'cloudinary config': 'cloudinary://333779167276662:_8jbSi9FB3sWYrfimcl8VKh34rI@keystone-demo',

	'session': true, 
	'auth': true,
	'user model': 'User',
	'cookie secret': process.env.COOKIE_SECRET || 'lms',

	'ga property': process.env.GA_PROPERTY,
	'ga domain': process.env.GA_DOMAIN,

	'chartbeat property': process.env.CHARTBEAT_PROPERTY,
	'chartbeat domain': process.env.CHARTBEAT_DOMAIN,
	//'s3 config': {
	//	'bucket': 'keystonelms', 
	//	'key': 'AKIAJV4Y46NLNMWQWBXQ', 
	//	'secret': '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',
	//}

});

keystone.import('models');

keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
	ga_property: keystone.get('ga property'),
	ga_domain: keystone.get('ga domain'),
	chartbeat_property: keystone.get('chartbeat property'),
	chartbeat_domain: keystone.get('chartbeat domain')
});

keystone.set('routes', require('./routes'));

keystone.set('nav', {
	'courses': ['courses', 'course-categories', 'course-sections', 'section-lessions'],
	'users': 'users',
});

keystone.start();
