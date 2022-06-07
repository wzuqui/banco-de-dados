import { users } from './lib/users-database';
import { select, from, orderBy } from './lib/fake-sql';

window['database'] = { users };

function obterWhere(texto: string) {
  const regex = /where (.*)(?:order)/gm;
  const match = regex.exec(texto);
  if (!match) return undefined;
  return { where: match[1] };
}

function obterOrder(texto: string) {
  const regex = /order by (.*)/gm;
  const match = regex.exec(texto);
  if (!match) return undefined;
  const [column, order] = match[1].split(' ');
  return { column, order: order ?? 'asc' };
}

function obterFrom(texto: string) {
  const regex = /from (\w+)/gm;
  const match = regex.exec(texto);
  if (!match) return undefined;
  return match[1].trim();
}

function obterSelect(texto: string) {
  const regex = /select (.*)from/gm;
  const match = regex.exec(texto);
  if (!match) return undefined;
  return match[1]
    .split(',')
    .map((p) => p.trim())
    .join(',')
    .trim();
}

const sql = (texto: any) => {
  texto = `${texto}`.replace(/\n/gm, ' ').replace(/\s\s+/gm, ' ');
  const _order = obterOrder(texto);
  const _from = obterFrom(texto);
  const _select = obterSelect(texto);
  const _where = obterWhere(texto);

  if (!_order) {
    return select(_select, from(_from, _where));
  } else {
    const result = orderBy(
      _order.column,
      _order.order,
      select(_select, from(_from, _where))
    );
    return result;
  }
};

let dados = sql`select name
  , id
  , age
from
  users
where users.age > 25
      && users.age < 32
order by name` as any[];

$(() => {
  const dataGrid = $('#app')
    .dxDataGrid({
      dataSource: dados,
      showBorders: true,
    })
    .dxDataGrid('instance');

  const input = $('#input')
    .dxTextArea({
      height: 300,
      text: `select name
    , id
    , age
  from
    users
  where users.age > 25
        && users.age < 32
  order by name`,
    })
    .dxTextArea('instance');

  $('#executar').dxButton({
    text: 'executar',
    type: 'success',
    width: 120,
    onClick() {
      dados = sql(input.option('text'));
      dataGrid.option('dataSource', dados);
    },
  });
});
