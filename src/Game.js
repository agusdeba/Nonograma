import React from 'react';
import PengineClient from './PengineClient';
import Board from './Board';

class Game extends React.Component {

  pengine;
  constructor(props) {
    super(props);
    this.state = {
      grid: null,
      rowClues: null,
      colClues: null,
      modoNumeral: true,
      waiting: false,
      statusText: '¡Segui jugando!',
      juegoGanado: false,
      satisfaceFila: [],
      satisfaceCol: []
    };
    this.handleClick = this.handleClick.bind(this);
    this.handlePengineCreate = this.handlePengineCreate.bind(this);
    this.pengine = new PengineClient(this.handlePengineCreate);
  }

  handlePengineCreate() {
    const queryS = 'init(PistasFilas, PistasColumns, Grilla)';
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        this.setState({
          grid: response['Grilla'],
          rowClues: response['PistasFilas'],
          colClues: response['PistasColumns'],  
          satisfaceFila: Array(response['PistasFilas'].length).fill(0),
          satisfaceCol: Array(response['PistasColumns'].length).fill(0),       
        });
      }
    });
  }

  /*
  Verifica si termino el juego.
  Retorna true en caso de que todas las pistas se satisfagan, caso contrario retorna false.
  */
  terminoJuego(){
    let cumpleF = true;
    let cumpleC = true;
    const LongitudF = this.state.satisfaceFila.length;
    const LongitudC = this.state.satisfaceCol.length;
    
    for (let i = 0; i < LongitudF && cumpleF; i++){
        if (this.state.satisfaceFila[i] === 0){
          cumpleF = false;
        }
      }
    for (let i = 0; i < LongitudC && cumpleF && cumpleC; i++){
        if (this.state.satisfaceCol[i] === 0){
          cumpleC = false;
        }
    }
    if (cumpleF && cumpleC){
      this.setState({
        statusText: '¡Ganaste!',
        juegoGanado: true 
      })
    }
  }


  handleClick(i, j) {
    // Ninguna acción al hacer clic si estamos esperando.
    if (this.state.waiting || this.state.juegoGanado) {
      return;
    }
    // Cree la consulta Prolog para realizar el movimiento, que se verá de la siguiente manera:
    // put("#",[0,1],[], [],[["X",_,_,_,_],["X",_,"X",_,_],["X",_,_,_,_],["#","#","#",_,_],[_,_,"#","#","#"]], GrillaRes, FilaSat, ColSat)
    const squaresS = JSON.stringify(this.state.grid).replaceAll('"_"', "_"); // Remove quotes for variables.
    const pistasFila = JSON.stringify(this.state.rowClues).replaceAll('"_"', "_");
    const pistasCol = JSON.stringify(this.state.colClues).replaceAll('"_"', "_");
    
    const modo =  PengineClient.stringify(this.state.modoNumeral ? '#' : 'X');
    const queryS = 'put('+ modo + ' , [' + i + ',' + j + '] , '+ pistasFila +' , '+ pistasCol +',' + squaresS + ', GrillaRes, FilaSat, ColSat)';

    this.setState({
      waiting: true
    });
    this.pengine.query(queryS, (success, response) => {
      if (success) {
        let satFila = this.state.satisfaceFila;
        let satCol = this.state.satisfaceCol;
        satFila[i] = response['FilaSat'];
        satCol[j] = response['ColSat'];
        this.setState({
          grid: response['GrillaRes'],
          satisfaceCol: satCol,
          satisfaceFila: satFila,
          waiting: false         
        });
        this.terminoJuego();
      } else {
        this.setState({
          waiting: false
        });
      }
    });
  }

  /*
  Cambia el estado del modoNumeral.
  */
  switchMode(){
    this.setState({modoNumeral : !this.state.modoNumeral})
  }

  render() {
    if (this.state.grid === null) {
      return null;
    }
    return (
      <div className="game">
        <Board
          grid={this.state.grid}
          rowClues={this.state.rowClues}
          colClues={this.state.colClues}
          onClick={(i, j) => this.handleClick(i,j)}
          satisfaceFila = {this.state.satisfaceFila}
          satisfaceCol = {this.state.satisfaceCol}
        />      
        <div className = "panelInferior">
          <div className = "toggle" >
            <input type = "checkbox" name="boton" id="boton" value = {this.state.modoNumeral} onClick={()=>this.switchMode() }/>
            <label htmlFor="boton"></label>
          </div>
          <label className="X">X</label>
          <label className="Pintar"></label>
          <div className = {this.state.juegoGanado ?"gameWin" : "gameInfo"} >
            {this.state.statusText}
          </div>
        </div>
      </div>
    );
  } 
}
export default Game;