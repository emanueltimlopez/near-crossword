import './App.css';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import Crossword from 'react-crossword-near';
import { parseSolutionSeedPhrase } from './utils';
import { createGridData, loadGuesses } from "react-crossword-near/dist/es/util";
import sha256 from 'js-sha256';
import confetti from 'canvas-confetti';

const App = ({ data, solutionHash }) => {
  const crossword = useRef();
  const [solutionFound, setSolutionFound] = useState(false);

  useEffect(()=> {
    if (solutionFound) {
      confetti({
        particleCount: 700,
        angle: 60,
        spread: 200,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 700,
        angle: 120,
        spread: 200,
        origin: { x: 1 }
      });
    }
  }, [solutionFound])

  const onCrosswordComplete = useCallback(
    async (completeCount) => {
      if (completeCount !== false) {
        let gridData = createGridData(data).gridData;
        loadGuesses(gridData, 'guesses');
        await checkSolution(gridData);
      }
    },
    [checkSolution, data]
  );

  async function checkSolution(gridData) {
    let seedPhrase = parseSolutionSeedPhrase(data, gridData);
    let answerHash = sha256.sha256(seedPhrase);
    if (answerHash === solutionHash) {
      setSolutionFound(true);
    } else {
      setSolutionFound(false);
    }
  }

  return (
    <div id="page">
      <h1>Coin Crossword</h1>
      <div id="crossword-wrapper">
        <Crossword
          data={data}
          ref={crossword}
          onCrosswordComplete={onCrosswordComplete}
        />
      </div>
    </div>
  );
}

export default App;
