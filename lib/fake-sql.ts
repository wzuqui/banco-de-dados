export const select = (columns, result) => {
  switch (columns) {
    case '*':
      columns = Object.keys(result[0]);
      break;
    case 'count':
      return result.length;
    default:
      columns = columns.split(',');
  }
  if (result === undefined) return [];
  return result.map((row) =>
    columns
      .map((column) => {
        if (row[column] === undefined) {
          return null;
        } else {
          return row[column];
        }
      })
      .reduce((a, v, i) => ({ ...a, [columns[i]]: v }), {})
  );
};

export const from = (table, conditions?) => {
  const database = window['database'];
  if (conditions === undefined) {
    if (database[table]) {
      return database[table];
    }
    throw new Error('Table or view not exists');
  } else {
    const result = eval(`window['database'].${table}.filter((${table}) => {
        return ${conditions.where}
    })`);
    return result;
  }
};

export const orderBy = (column, order, result) => {
  return result.sort((a, b) => {
    let compare = 0;
    if (a[column] < b[column]) {
      compare = -1;
    } else if (a[column] > b[column]) {
      compare = 1;
    }
    return order === 'asc' ? compare : -compare;
  });
};
