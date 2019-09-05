import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={(e) => this.props.onClick(e)}>
        {this.props.value}
      </button>
    );
  }
}

class Note extends React.Component {
  render() {
    return (
      <div>{ this.props.content || 'no content' }</div>
    )
  }
}

function WarningBanner(props) {
  if(!props.clickNum) {
    return null;
  } else if (props.clickNum === 5) {
    return (
      <audio controls></audio>
    )
  }
  return (
    <div className="displayed-num">
      Warning!
    </div>
  )
}

class Board extends React.Component {
  constructor () {
    super();
    this.state = {
      "squares": Array(9).fill(null),
      "isXNext": true,
      "clickNum": 0,
      "content": 'no one wins'
    }
    this.handleClick = this.handleClick.bind(this)
  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={(e) => this.handleClick(i,e)} />;
  }

  renderNote() {
    return <Note content={this.state.content} />
  }

  renderWarning() {
    return <WarningBanner clickNum={this.state.clickNum} />
  }

  handleClick (i,e) {
    const tmp = this.state.squares.slice();
    tmp[i] = this.state.isXNext ? 'X' : 'O';
    console.log('event', e)

    const winer = calculateWinner(this.state.squares);
    if (winer) {
      this.setState({'content': "has winner"})
      console.log('winner')
    } else {
      this.state.isXNext = ! this.state.isXNext;
      this.setState({'squares': tmp});
    }
    this.setState({clickNum: this.state.clickNum + 1})
  }

  render() {
    const winer = calculateWinner(this.state.squares);
    let status;
    if (winer) {
      status = 'Winer is ' + (this.state.isXNext ? 'O' : 'X');
    } else {
      status = 'Next player: ' + (this.state.isXNext ? 'X' : 'O');
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        {this.renderNote()}
        {this.renderWarning()}
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

class Remark extends React.Component {
  constructor () {
    super()
    this.state = {
      title: '',
      content: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  changeState(name, value) {
    this.setState({[name]: value})
  }

  handleSubmit() {
    console.log(this.state.title + '~~' + this.state.content)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          评论题目:
          <input value={this.title} placeholder="请输入题目" onChange={(e) => this.changeState('title', e.target.value)}/>
        </div>
        <div>
          评论内容：
          <textarea value={this.content} placeholder="请输入评论内容" onChange={(e) => this.changeState('content', e.target.value)}/>
        </div>
        <input type="submit" value="提交" />
      </form>
    )
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
        <div></div>
        <div>
          <Remark />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
