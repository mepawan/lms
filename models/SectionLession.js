
var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
	Posts
	=====
 */

var SectionLession = new keystone.List('SectionLession', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	label: 'Lessions',
});


var MediaStorage = new keystone.Storage({
  adapter: keystone.Storage.Adapters.FS,
  fs: {
    path: keystone.expandPath('./uploads'),
    publicPath: '/public/uploads',
  },
});
/*
var s3Storage = new keystone.Storage({
  adapter: require('keystone-storage-adapter-s3'),
  s3: {
    key: 'AKIAJV4Y46NLNMWQWBXQ', // required; defaults to process.env.S3_KEY
    secret: '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', // required; defaults to process.env.S3_SECRET
    bucket: 'keystonelms', // required; defaults to process.env.S3_BUCKET
    path: '/courses',
    headers: {
      'x-amz-acl': 'public-read', // add default headers; see below for details
    },
  },
  schema: {
    bucket: true, // optional; store the bucket the file was uploaded to in your db
    etag: true, // optional; store the etag for the resource
    path: true, // optional; store the path of the file in your db
    url: true, // optional; generate & store a public URL
  },
});
*/

SectionLession.add({
	title: { type: String, required: true },
	section: { type: Types.Relationship, initial: true, ref: 'CourseSection', index: true },
	banner: { type: Types.CloudinaryImage },
	content:{ type: Types.Html, wysiwyg: true, height: 400 },
	videoUrl:{ type: Types.Url },
	videoFile: { type: Types.File, storage: MediaStorage },
	otherFiles: { type: Types.File, storage: MediaStorage },
	//files: { type: Types.File, storage: s3Storage },
	author: { type: Types.Relationship, initial: true, ref: 'User', index: true },
	state: { type: Types.Select, options: ['published', 'draft', 'archived'], default: 'published', index: true },
	publishedOn: { type: Types.Date, default: Date.now, noedit: true, index: true },
});


SectionLession.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	if (!this.isModified('publishedOn') && this.isModified('state') && this.state === 'published') {
		this.publishedOn = new Date();
	}
	next();
});


SectionLession.track = true;
SectionLession.defaultColumns = 'title, section, publishedOn, state';
SectionLession.register();
