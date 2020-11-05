const User = require('../models/User');

const findWithPagination = async (Model, query, page, limit) => {
  let sortValue = 'created_at',
      property = 'reviews';

  if (Model === User) {
    sortValue = 'followers';
    property = 'users'
  }

  const results = await Model.find(query)
    .populate('author', '-password -email -created_at -isAdmin -__v')
    .sort({ [sortValue]: -1 })
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

    const count = await Model.countDocuments()

    // get total amount of pages possible with the limit defined in the request
    const totalPages = Math.ceil(count / limit)

    // generate next page number if there's one
    const next = page < totalPages ? (parseInt(page) + 1) : null
    
    return { [property]: results, next };
}

exports.findWithPagination = findWithPagination;