var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
	Posts
	=====
 */

var CourseSection = new keystone.List('CourseSection', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true },
	label: 'Sections',
});

CourseSection.add({
	title: { type: String, required: true },
	course: { type: Types.Relationship, initial: true, ref: 'Course', index: true },
	banner: { type: Types.CloudinaryImage },
	description:{ type: Types.Html, wysiwyg: true, height: 400 },
	author: { type: Types.Relationship, initial: true, ref: 'User', index: true },
	state: { type: Types.Select, options: ['published', 'draft', 'archived'], default: 'published', index: true },
	publishedOn: { type: Types.Date, default: Date.now, noedit: true, index: true },
});

CourseSection.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	if (!this.isModified('publishedOn') && this.isModified('state') && this.state === 'published') {
		this.publishedOn = new Date();
	}
	next();
});

CourseSection.schema.post('save', function () {
	if (!this.wasNew) return;
	if (this.author) {
		keystone.list('User').model.findById(this.author).exec(function (err, user) {
			if (user) {
				user.wasActive().save();
			}
		});
	}
});

//CourseSection.relationship({ path: 'lessions', ref: 'SectionLession', refPath: 'course-section' });

CourseSection.track = true;
CourseSection.defaultColumns = 'title, course, publishedOn, state';
CourseSection.register();
