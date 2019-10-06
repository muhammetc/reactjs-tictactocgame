import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {

    return (
        <button className="square"
            onClick={props.onClick} style={{backgroundColor:props.color}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {


    renderSquare(i) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        let winBackgroundColor=Array(9).fill(null);
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (this.props.squares[a] && this.props.squares[a] === this.props.squares[b] && this.props.squares[a] === this.props.squares[c]) {
                winBackgroundColor[a]="red";
                winBackgroundColor[b]="red";
                winBackgroundColor[c]="red";
            }
        }
        return <Square
            value={this.props.squares[i]}
            color={winBackgroundColor[i]}
            onClick={() => this.props.onClick(i)} />;
    }
    createSquare = () => {
      
        let mainDiv = []
        
        let sayac = 0;
        for (let i = 0; i < 3; i++) {
            let childDiv = [];

            for (let j = 0; j < 3; j++) {
                childDiv.push(this.renderSquare(sayac));
                sayac++;

            }
            mainDiv.push(<div className="board-row">{childDiv}</div>);

        }

        return mainDiv
    }
    render() {

        return (
            <div>
                {this.createSquare()}
            </div>

        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            xIsClick: false,
            ascedingSort: true,
        }
        this.xWinCount=0;
        this.oWinCount=0;
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            xIsClick: !this.state.xIsClick

        })
    }
    changeButtonColor(buttonId) {
        if (buttonId == this.state.stepNumber) {
            return "#62848d"
        }
        else {
            return ''
        }
    }
    createHistoryButton=()=>
    {
        let liArray=[];
        if (!this.state.ascedingSort) {
            let desc = 'Go to game start';       
            for (let i = this.state.history.length - 1; i >= 0; i--) {
                if(i===0){
                    desc = 'Go to game start';
                }else{
                    desc = 'Go to move # : ' + i;
                }
               
                liArray.push( <li key={i}>
                <button onClick={() => this.jumpTo(i)} style={{ backgroundColor: this.changeButtonColor(i) }} className="button">{desc}</button>
            </li>);
            }
           
        }
        else {
            let desc = 'Go to game start'
            for (let i = 0; i < this.state.history.length ; i++) {
                if(i===0){
                    desc = 'Go to game start';
                }else{
                    desc = 'Go to move # : ' + i;
                }          
                liArray.push( <li key={i}>
                    <button onClick={() => this.jumpTo(i)} style={{ backgroundColor: this.changeButtonColor(i) }} className="button">{desc}</button>
                </li>);
            }
        }
        return liArray;
    }
    sortHistory() {
        this.setState({
            ascedingSort: !this.state.ascedingSort,
            //history: deneme
        })
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        
       const eqControl=current.squares.filter((index,value)=>{
           if(index===null){
               return value;
           }
       })

        
        let status;
        if (winner) {
          status = "Winner: " + winner;
          if(winner==="X"){
              this.xWinCount +=1;
          }
          else{
            this.oWinCount +=1;
          }
        }
        else if(!winner&&eqControl.length===0){
            status="No Winner";
        } 
        else {
          status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}

                    />
                </div>
                <div className="game-info">
                    <div className="dvStatus">{status}</div>
                    <ol>{this.createHistoryButton()}</ol>
                   <br />
               <button onClick={() => this.sortHistory()} className="button" style={{marginLeft:"32px",backgroundColor:"chocolate"}}>{this.state.ascedingSort ? 'Desceding Sort' : 'Asceding Sort'}</button>
                    
                </div>

                <div style={{marginLeft:"50px"}} className="dvStatus">
                <div>X Win Count : {this.xWinCount}</div>
                <div>O Win Count : {this.oWinCount}</div>
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

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}