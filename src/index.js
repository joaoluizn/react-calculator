import $ from "jquery";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { faReact } from '@fortawesome/free-brands-svg-icons'

import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

const isOperator = /[x/+‑]/,
      endsWithOperator = /[x+‑/]$/,
      isDigit = /[0-9]/,
      containsDecimal = /[.]/,
      hasEquals = /[=]/,
      operatorPink = {
        background: '#F1396D',
        borderColor: '#F1396D',
      },
      clearPink = {
         background: '#ec6480',
         borderColor: '#ec6480',
      },
      equalPink = {
         background: '#ec6480',
         borderColor: '#ec6480',
      },
      digitPink = {
         background: '#f9e1e9',
         borderColor: '#f9e1e9',
         color: '#F1396D'
      },
      mainPink = {
         background: '#ed6480'
      } 

class Display extends React.Component{
   render(){
      return(
         <div id="display-container">
            <p id="output" className="text-warning">{this.props.formula}</p>
            <p id="display">{this.props.mainValue}</p>
         </div>
      );
   }
}

class NumPad extends React.Component{
   constructor(props){
      super(props);
      this.handleEvent = this.handleEvent.bind(this);
   }

   handleEvent(e){
      if(e.target.value.match(isOperator)){
         this.props.operatorHandler(e.target.value);

      }else if(e.target.value.match(isDigit)){
         this.props.digitHandler(e.target.value);

      }else if(e.target.value === '.'){
         this.props.decimalHandler(e.target.value);
      }
   }

   render(){
      console.log(this.props.pink);
      return(
         <div id="pad">
              <button id="clear" style={this.props.pinkState ? clearPink : {}} onClick={this.props.resetHandler} value='AC' className='big-pad btn btn-danger'>AC</button>
              <button id="divide" style={this.props.pinkState ? operatorPink : {}} className="btn btn-primary" onClick={this.handleEvent} value='/'>/</button>
              <button id="multiply" style={this.props.pinkState ? operatorPink : {}} className="btn btn-primary" onClick={this.handleEvent} value='x'>x</button>
              <button id="seven" style={this.props.pinkState ? digitPink : {}} className="btn btn-dark" onClick={this.handleEvent}  value='7'>7</button>
              <button id="eight" style={this.props.pinkState ? digitPink : {}} className="btn btn-dark" onClick={this.handleEvent}  value='8'>8</button>
              <button id="nine"  style={this.props.pinkState ? digitPink : {}} className="btn btn-dark" onClick={this.handleEvent}  value='9'>9</button>
              <button id="subtract" style={this.props.pinkState ? operatorPink : {}} className="btn btn-primary" onClick={this.handleEvent} value='‑'>-</button>
              <button id="four"  style={this.props.pinkState ? digitPink : {}} className="btn btn-dark" onClick={this.handleEvent}  value='4'>4</button>
              <button id="five" style={this.props.pinkState ? digitPink : {}} className="btn btn-dark" onClick={this.handleEvent}  value='5'>5</button>
              <button id="six"  style={this.props.pinkState ? digitPink : {}} className="btn btn-dark"  onClick={this.handleEvent}  value='6'>6</button>
              <button id="add"  style={this.props.pinkState ? operatorPink : {}}  className="btn btn-primary" onClick={this.handleEvent}  value='+'>+</button>
              <button id="one" style={this.props.pinkState ? digitPink : {}} className="btn btn-dark"  onClick={this.handleEvent}  value='1'>1</button>
              <button id="two" style={this.props.pinkState ? digitPink : {}} className="btn btn-dark"  onClick={this.handleEvent}  value='2'>2</button>
              <button id="three" style={this.props.pinkState ? digitPink : {}} className="btn btn-dark" onClick={this.handleEvent}  value='3'>3</button>
              <button id="equals" style={this.props.pinkState ? equalPink : {}} onClick={this.props.equalHandler} className='equal btn btn-success' value='='>=</button>
              <button id="zero" style={this.props.pinkState ? digitPink : {}} onClick={this.handleEvent} value='0'  className='big-pad btn btn-dark'>0</button>
              <button id="decimal" style={this.props.pinkState ? digitPink : {}} className="btn btn-dark" onClick={this.props.decimalHandler} value='.'>.</button>
         </div>
      );
   }
}

class Calculator extends React.Component{
   constructor(props){
      super(props);
      this.state = {
         prev: '',
         formula: '',
         currentVal: '0',
         result: '',
         evaluated: false,
         egg: false
      }
      
      this.updateDisplay = this.updateDisplay.bind(this);
      this.reset = this.reset.bind(this);
      this.handleDigit = this.handleDigit.bind(this);
      this.handleOperator = this.handleOperator.bind(this);
      this.evaluate = this.evaluate.bind(this);
      this.handleDecimal = this.handleDecimal.bind(this);
   }
   
   reset(){
      this.setState({prev: '', formula: '', currentVal: '0', evaluated: false});
   }
   
   evaluate(){
      // Easter Egg Code :)
      if(this.state.currentVal === '7465'){
         this.setState({egg: true});
         $('body').css(mainPink);
         $('html').css(mainPink);
         $('#output').removeClass("text-warning").addClass('egg');
         $('#code-icon').css({color: "pink"})
         $('footer a').css({color: "pink"})
      }

      if(!this.state.evaluated){
         let expression = this.state.formula;
         if (endsWithOperator.test(expression)){
            expression = expression.slice(0, -1);  
         }
         expression = expression.replace(/x/g, "*").replace(/‑/g, "-");
         let answer = Math.round(1000000000000 * eval(expression)) / 1000000000000;
         this.setState({currentVal: answer, 
                        formula: expression + " = " + answer,
                       evaluated: true,
                       result: answer});
      }
   }

   handleDigit(newDigit){
      if(hasEquals.test(this.state.formula)){
         this.setState({evaluated: false,
                        formula: newDigit,
                       currentVal: newDigit});
      }else if(!isNaN(this.state.currentVal)){
         if(this.state.currentVal === '0'){
            this.setState({currentVal: newDigit, formula: newDigit});
         }else{
            this.setState({currentVal: this.state.currentVal + newDigit, 
               formula: this.state.formula + newDigit});
         }
      }else{
         this.setState({formula: this.state.formula + newDigit,
            currentVal: newDigit});
      }
   }

   handleDecimal(e){
      if(hasEquals.test(this.state.formula)){
         this.setState({evaluated: false,
                        formula: "0" + e.target.value, currentVal: "0" + e.target.value});

      }else if(!containsDecimal.test(this.state.currentVal)){
         if(!isNaN(this.state.currentVal)){
            if(this.state.currentVal === '0'){
               this.setState({currentVal: this.state.currentVal + e.target.value,
                           formula: this.state.formula + this.state.currentVal + e.target.value})
            }else{
               this.setState({currentVal: this.state.currentVal + e.target.value,
                           formula: this.state.formula + e.target.value})
            }
         }
      }
   }
   
   handleOperator(newOperator){
      if(hasEquals.test(this.state.formula)){
         this.setState({evaluated: false,
                        formula: this.state.result + newOperator, currentVal: newOperator});

      }else if(!isNaN(this.state.currentVal)){
         this.setState({formula: this.state.formula + newOperator, currentVal: newOperator});

      }else{
         if(this.state.formula.match(endsWithOperator)){
            this.setState({formula: this.state.formula.slice(0, -1) + newOperator, currentVal: newOperator})
         }
      }
   }
   
   updateDisplay(newVal){
      this.setState({currentVal: newVal});
   }
   
   render(){
      return(
         <div id="calculator">
            <Display formula={this.state.formula} 
                     mainValue={this.state.currentVal}/>
            <NumPad  displayHandler={this.updateDisplay}
                     resetHandler={this.reset}
                     digitHandler={this.handleDigit}
                     operatorHandler={this.handleOperator}
                     equalHandler={this.evaluate}
                     decimalHandler={this.handleDecimal}
                     pinkState={this.state.egg}/>
         </div>
      );
   }
}

class Footer extends React.Component{
   render(){
      return (
         <div id={"credits"}>
            <div id={"phantom-footer"}/>
            <div id={"footer"}>
                  Created with <FontAwesomeIcon id={"code-icon"} icon={faReact} spin/> and
                  &nbsp; <FontAwesomeIcon id={"heart-icon"} icon={faHeart}/>  &nbsp;by <a href="https://codepen.io/joaoluizn/" target="_blank" rel="noopener noreferrer">JoaoLuizn</a>
            </div>
         </div>
      );
   }
}

class Wrapper extends React.Component{
   render(){
      return(
         <div id="app-container">
            <div id="calculator-container">
               <Calculator/>
            </div>
            <Footer/>
         </div>
      );
   }
}

ReactDOM.render(<Wrapper/>, document.getElementById('app'));
