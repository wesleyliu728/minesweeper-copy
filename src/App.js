import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import bombpng from './0734feafc15377e9a59de0643b754d78.png'
import flagpng from './132-1320770_turkey-flag-flashlight-pixel-art.png'

class Square extends React.Component{
  constructor(props){
    super(props);
    this.state = {

    };
  }
  render(){
    return(
      <button className="square" onClick={this.props.handleClick} style = {{background:this.props.getBackground()}}>
        {this.props.value}
      </button>
    )
  }
}

class Board extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      board: this.props.gameboard,
      shown: Array(this.props.xval * this.props.yval).fill(false),
      flag: Array(this.props.xval * this.props.yval).fill(false),
      isFlagging: false
    };
  }
  getBackground(value){
    if(this.state.shown[value]){
      return 'yellow'
    } else{
      return 'green'
    
  }
  }
  generateSquare(value){
    return (<Square
      value = {this.state.shown[value] ? (this.props.board[value] ==  0 ? null : (this.props.board[value] !== '!!!' ? this.props.board[value] : <img className = "img"src = {bombpng}/>)): (this.state.flag[value] ? <img className = "img"src = {flagpng}/> :null)}
      handleClick = {() => this.handleClick(value)}
      getBackground = {() => this.getBackground(value)}
    />);
  }
  handleClick(val){
    var curr = this.state.shown.slice();
    if(this.state.isFlagging){
      const flag = this.state.flag.slice()
      flag[val] = !flag[val]
      this.setState({
        flag:flag,
      })
    } else{
      function recurse(props, val, arrived, state){
        if(arrived.has(val)){
          return
        }
        arrived.add(val)
        if(state.flag[val]){
          state.flag[val] = false
        }
        if(props.board[val]== 0){
          curr[val] = true
        } else{
          curr[val] = true
          return
        }
        var y = Math.floor(val/props.xval)
        var x = val - y * props.xval
        for (var i = x-1; i <= x+1; i++){
          for (var j = y-1; j <= y+1; j++){
            if(j >= 0 && j<props.yval && i>= 0 && i< props.xval){
              recurse(props, j*props.xval + i, arrived, state)
            }
          }
        }
      }
      if (this.props.board[val] == 0){
        recurse(this.props, val, new Set(), this.state)
      } else if(this.props.board[val] == '!!!'){
        curr = Array(this.props.xval*this.props.yval).fill(true)
      } else{
        curr[val] = true
      }
    }
    this.setState(
      {
        board:this.props.gameboard,
        shown: curr,
      }
    );
  }
  generate_flag_button(){
    return (<Square
      value = {<img className = "img"src = {flagpng}/>}
      handleClick = {() => this.handleFlagging()}
      getBackground = {() => {return 'purple'}}
    />);
  }
  handleFlagging(){
    this.setState({
      board:this.state.board,
      shown:this.state.shown,
      flag:this.state.flag, 
      isFlagging: !this.state.isFlagging
    })
  }
  generate_reset_button(){
    return (<Square
      value = {'re'}
      handleClick = {() => this.handleReset()}
      getBackground = {() => {return 'blue'}}
    />);
  }
  handleReset(){
    this.setState({
      board:this.props.reset(),
      shown: Array(this.props.xval * this.props.yval).fill(false),
      flag: Array(this.props.xval * this.props.yval).fill(false),
      isFlagging: false
    })

  }

  getbombs(){
    console.log(getOccurrence(this.props.board, '!!!'))
    return getOccurrence(this.props.board, '!!!') - getOccurrence(this.state.flag, true)
  }
  generateBoard(val1, val2){
    var list = [];
    for (var i = 0; i <= val1-1; i++) {
      list.push(i);
    }
    var list2 = [];
    for (var x = 0; x <= val2-1; x++){
      list2.push(x)
    }
    return(
      list2.map((m) => {return(
          <div className = "board-row">
            {list.map((n) => {return this.generateSquare(m*(val1)+n);})}
          </div>
        )}
      )
      )
  }
  render(){
    return(
      <div>
        <div>
          {this.getbombs()}<img className = "img"src = {flagpng}/>
        </div>
        <div className = "gameboard">
          {this.generateBoard(this.props.xval,this.props.yval)}
        </div>
        <div className = "flagbutton">
          {this.generate_flag_button()}
          {this.generate_reset_button()}
        </div>
      
      </div>

    );
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      xval:this.props.xval,
      yval:this.props.yval,
      gameboard: this.generateRandomBoard(),
      index:0
    };
  }
  generateRandomBoard(){
    var board = Array(this.props.xval*this.props.yval).fill(0)
    var bombs = getRandomInt(this.props.minbomb, this.props.minbomb + Math.floor((this.props.xval*this.props.yval)/5))
    while(bombs > 0){
      const cRow = getRandomInt(0, this.props.xval)
      const cCol = getRandomInt(0, this.props.yval)
      const ind = cCol*this.props.xval + cRow
      if(board[ind] !== '!!!'){
        board[ind] = '!!!'
        bombs -= 1;
      }
    }
    for (var y = 0; y <= this.props.yval-1; y++){
      for (var x = 0; x <= this.props.xval-1; x++){
        if(board[y*this.props.xval + x] == '!!!'){
          for (var i = x-1; i <= x+1; i++){
            for (var j = y-1; j <= y+1; j++){
              if(j >= 0 && j<this.props.yval && i>= 0 && i< this.props.xval && board[j*this.props.xval + i] !=='!!!'){
                board[j*this.props.xval + i] += 1
              }
            }
          }
        }
      }
    }
    console.log(board)
    return board

  }
  renderBoard(){
    return(
      <Board
        xval = {this.state.xval}
        yval = {this.state.yval}
        board = {this.state.gameboard}
        reset = {() => this.setState({gameboard:this.generateRandomBoard()})}
      />
    );
  }
  render(){
    return(
      this.renderBoard()
    );
  }
}
function App() {
  return (
    <div id = "wrapper">
      <div className="App">
        <Game
          xval = {20}
          yval = {15}
          minbomb = {5}
        />
      </div>
    </div>
  );
}

export default App;


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getOccurrence(array, value) {
  var count = 0;
  array.forEach((v) => (v === value && count++));
  return count;
}
