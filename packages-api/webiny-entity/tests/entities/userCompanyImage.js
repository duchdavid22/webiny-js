const {Entity} = require('./../../src');

class Image extends Entity {
	constructor() {
		super();
		this.attr('filename').char().setValidators('required');
		this.attr('size').float();
		this.attr('createdBy').entity(User);
		this.attr('markedAsCannotDelete').boolean();
	}

	canDelete() {
		if (this.markedAsCannotDelete) {
			throw Error('Cannot delete Image entity');
		}
	}
}

Image.classId = 'Image';

class Company extends Entity {
	constructor() {
		super();
		this.attr('name').char().setValidators('required');
		this.attr('image').entity(Image);
		this.attr('markedAsCannotDelete').boolean();
	}

	canDelete() {
		if (this.markedAsCannotDelete) {
			throw Error('Cannot delete Company entity');
		}
	}
}

Company.classId = 'Company';

class User extends Entity {
	constructor() {
		super();
		this.attr('firstName').char().setValidators('required');
		this.attr('lastName').char().setValidators('required');
		this.attr('company').entity(Company);
		this.attr('markedAsCannotDelete').boolean();
	}

	canDelete() {
		if (this.markedAsCannotDelete) {
			throw Error('Cannot delete User entity');
		}
	}
}

User.classId = 'User';

module.exports = {User, Company, Image};