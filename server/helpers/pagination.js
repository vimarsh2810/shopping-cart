const pagination = (page, limit) => {
  const pageNo = parseInt(page ? page : 1);
  const size = parseInt(limit ? limit : 2);
  const offset = (pageNo - 1) * size;
  return {
    size,
    offset
  };
};

const paginationMetaData = (items, itemCount, page, size) => {
  const count = itemCount;
  const rows = items;

  const totalNoOfPages = Math.ceil(count / size);
  const currentPage = parseInt(page ? page : 1);
  return {
    count,
    rows,
    totalNoOfPages,
    currentPage
  };
};

module.exports = { pagination, paginationMetaData };