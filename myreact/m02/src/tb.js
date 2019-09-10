export class Tb extends React.Component {
  render () {
    return (
      <table className="tb">
        <caption>this is the caption of a table</caption>
        <thead>
          <tr><th>H1</th><th>H2</th></tr>
        </thead>
        <tbody>
          <Trs data={[['a', 'b'], [1, 2], ['*', '#']]} />
        </tbody>
      </table>
    )
  }
}

class Trs extends React.Component {
  render() {
    return this.props.data.map(item => this.renderRow(item))
  }

  renderRow(list) {
    return (
      <tr key={getRandom()}>
        {list.map(item => (<td key={getRandom()}>{item}</td>))}
      </tr>
    )
  }
}