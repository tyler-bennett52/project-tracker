'use strict';

// THIS IS THE STRETCH GOAL ...
// It takes in a schema in the constructor and uses that instead of every collection
// being the same and requiring their own schema. That's not very DRY!

class DataCollection {

  constructor(model) {
    this.model = model;
  }

  get(user, id) {
    if (id) {
      return this.model.findOne({where: { id }});
    } else if(user.role === 'admin') {
      return(this.model.findAll());
    }
    else {
      return this.model.findAll({where: { username: user.username }});
    }
  }

  create(record) {
    try {
      return this.model.create(record);
    } catch (error) {
      return(error.message);
    }
 
  }

  update(id, data) {
    return this.model.findOne({ where: { id } })
      .then(record => record.update(data));
  }

  delete(id) {
    return this.model.destroy({ where: { id }});
  }

}

module.exports = DataCollection;
