var keystone = require('keystone');
var Types = keystone.Field.Types;

var Course = new keystone.List('Course', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
});

Course.add({
	title: { type: String, required: true },
	categories: { type: Types.Relationship, ref: 'CourseCategory', many: true },
	price: { type: Types.Number, required:true, default:'0' },
	banner: { type: Types.CloudinaryImage },
	content: {
		brief: { type: Types.Html, wysiwyg: true, height: 150 },
		extended: { type: Types.Html, wysiwyg: true, height: 400 },
	},
	
	state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
	author: { type: Types.Relationship, ref: 'User', index: true },
	publishedDate: { type: Types.Date, index: true },
});

Course.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

//Course.relationship({ path: 'sections', ref: 'CourseSection', refPath: 'course' });

Course.track = true;
Course.defaultColumns = 'title, price, state|20%, author|20%, publishedDate|20%';
Course.register();
