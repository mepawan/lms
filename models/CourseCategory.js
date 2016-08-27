var keystone = require('keystone');
var Types = keystone.Field.Types;

var CourseCategory = new keystone.List('CourseCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
	label: 'Categories',
});

CourseCategory.add({
	name: { type: String, required: true },
	banner: { type: Types.CloudinaryImage },
	description:{ type: Types.Html, wysiwyg: true, height: 400 }
});

CourseCategory.relationship({ ref: 'Course', refPath: 'categories' });

CourseCategory.track = true;
CourseCategory.register();
