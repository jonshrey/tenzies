import { useState,useRef, useEffect} from 'react';
import './App.css';
import Die from './components/Die';
import { nanoid } from 'nanoid';
import ReactConfetti from 'react-confetti';

export default function App() {
  const [dice, setDice] = useState(generateAllNewDice());

  const gameWon = dice.every(die => die.isHeld && die.value === dice[0].value);

  function generateAllNewDice() {
    return Array.from({ length: 10 }, () => ({
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid(),
    }));
  }
   
  const inputRef = useRef(null);

  
  function resetGame() {
    setDice(generateAllNewDice());
  }

  function rollDice() {
    if (!gameWon) {
      setDice(oldDice =>
        oldDice.map(die =>
          die.isHeld ? die : { ...die, value: Math.floor(Math.random() * 6) + 1 }
        )
      );
    } else {
      resetGame();
    }
  }

  function hold(id) {
    setDice(oldDice =>
      oldDice.map(die =>
        die.id === id ? { ...die, isHeld: !die.isHeld } : die
      )
    );
  }

  useEffect(()=>{
    if(gameWon){
      inputRef.current.focus()    
    }
  },[gameWon])

  const diceElements = dice.map(dieObj => (
    <Die
      key={dieObj.id}
      value={dieObj.value}
      isHeld={dieObj.isHeld}
      hold={() => hold(dieObj.id)}
    />
  ));

  return (
    <main>
      {gameWon && <ReactConfetti />}
      <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">{diceElements}</div>
      <button ref={inputRef} className="generate" onClick={rollDice} aria-label={gameWon ? "Start New Game" : "Roll Dice"}>
        {gameWon ? "New Game" : "Roll"}
      </button>
    </main>
  );
}