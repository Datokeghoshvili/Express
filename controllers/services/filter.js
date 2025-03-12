const filterService = (product, reqQuery) => {
    const productQueryFilters = ['name', 'price', 'category', 'id', 'description', 'stock'];
    const filters = {};

    // Extract allowed filters
    productQueryFilters.forEach((el) => {
        if (reqQuery[el]) {
            filters[el] = reqQuery[el];
        }
    });

    // Initial query
   let query = product.find(filters);

    // Sorting
    if (reqQuery.sort) {
        query = query.sort(reqQuery.sort);
    }

    // Field Selection
    if (reqQuery.fields) {
        query = query.select(reqQuery.fields.split(',').join(' '));
    }

    // Pagination
    let page = reqQuery.page * 1 || 1;
    let limit = reqQuery.limit * 1 || 100;
    let skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    return query;
};

export default filterService;
