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
      board: this.props.g37F03Dameboard,
      shown: Array(this.props.xval * this.props.yval).fill(false),
      flag: Array(this.props.xval * this.props.yval).fill(false),
      isFlagging: false
    };
  }
  getBackground(value){
    if(this.state.shown[value]){
      return '#24DF2A'
    } else{
      return '#46BD39'
    
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
      if (this.state.shown[val] != true){
        flag[val] = !flag[val]
        this.setState({
          flag:flag,
        })
      }

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
      if(this.state.flag[val]){
        return
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
    return (<button classname = "button-4" onClick = {() => this.handleFlagging()} style = {{marginTop: 4, marginBottom: 8, background: (!this.state.isFlagging ? "white":"#FC583F")}} >
      {<img className = "img"src = {flagpng}/>}
    </button>);
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
    return (<button className="button-4" onClick = {() => this.handleReset()} style = {{background:"#FF8181", }}>
      reset
      </button>
    );
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
  generate_difficulty_button(xval, yval, bombcount,diffname){
    return(
    <button className="button-4" onClick={() => {this.props.diff_change(xval, yval, bombcount);this.handleReset()}} style = {{background:"#81FFFC",}}>
      {diffname}
    </button>
    )
  }
  render(){
    return(
      <div>
        <div>
        {this.generate_flag_button()}
        </div>
        <div>
          {this.getbombs()}<img className = "img"src = {flagpng}/>
          
        </div>
        <div className = "gameboard" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}> 
          <div>
            {this.generateBoard(this.props.xval,this.props.yval)}
          </div>
        </div>
        <div style = {{marginTop: 8}}>
          {this.generate_reset_button()}
          {this.generate_difficulty_button(10,8,10,"easy")}
          {this.generate_difficulty_button(18,14,40,"medium")}
          {this.generate_difficulty_button(24,20,100,"hard")}
        </div>
      
      </div>

    );
  }
}

class Game extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      xval: 20,
      yval:15,
      bombs: 40,
      gameboard: null,
      index:0
    };
  }

  handle_difficulty_change(xval, yval, bombcount){
    this.setState({
      xval:xval,
      yval:yval,
      bombs:bombcount
    })
  }


  generateRandomBoard(){
    var board = Array(this.state.xval*this.state.yval).fill(0)
    var bombs = this.state.bombs
    while(bombs > 0){
      const cRow = getRandomInt(0, this.state.xval)
      const cCol = getRandomInt(0, this.state.yval)
      const ind = cCol*this.state.xval + cRow
      if(board[ind] !== '!!!'){
        board[ind] = '!!!'
        bombs -= 1;
      }
    }
    for (var y = 0; y <= this.state.yval-1; y++){
      for (var x = 0; x <= this.state.xval-1; x++){
        if(board[y*this.state.xval + x] == '!!!'){
          for (var i = x-1; i <= x+1; i++){
            for (var j = y-1; j <= y+1; j++){
              if(j >= 0 && j<this.state.yval && i>= 0 && i< this.state.xval && board[j*this.state.xval + i] !=='!!!'){
                board[j*this.state.xval + i] += 1
              }
            }
          }
        }
      }
    }
    return board

  }
  renderBoard(){
    this.generateRandomBoard()
    return(
      <div>
        <div>
          <Board
            xval = {this.state.xval}
            yval = {this.state.yval}
            board = {this.generateRandomBoard()}
            reset = {() => this.setState({gameboard:this.generateRandomBoard()})}
            diff_change = {(x,y,z) => this.handle_difficulty_change(x,y,z)}
          />
        </div>
      </div>
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
    <div className = "wrap">
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
