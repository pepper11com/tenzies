import React from "react"
import Die from "./Die";
import ReactConfetti from "react-confetti";


export default function App() {

    const [dice, setDice] = React.useState(startOfGame());
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)

    const [seconds, setSeconds] = React.useState(0);
    const [isActive, setIsActive] = React.useState(false);

    const [lowest, setLowest] = React.useState(null);
    const [lowestTime, setLowestTime] = React.useState(null);


    React.useEffect(() => {
       //check if all dice are held and all dice numbers are the same
         if (dice.every(die => die.isHeld) && dice.every(die => die.value === dice[0].value)) {
            setTenzies(true)
        }
    }, [dice])

    function rollCount() {
        setRolls(rolls + 1)
    }

    function startOfGame() {
        const startingDice = []
        const randomSmiley = ["🙂", "😊", "😀", "😁", "😃", "😄", "😍", "😆", "😂", "😨"]
        for (let i = 0; i < 10; i++) {
            startingDice.push({ value: randomSmiley[i], isHeld: false, id: i })
        }
        return startingDice
    }

    function toggle() {
        setIsActive(!isActive);
        setDice(allNewDice)
    }

    function reset() {
        setSeconds(0);
        setIsActive(false);
        setDice(startOfGame())
        setTenzies(false)
        setRolls(0)
    }

    React.useEffect(() => {
        let interval = null;
        if (!tenzies) {
            if (isActive) {
                interval = setInterval(() => {
                    setSeconds(seconds => seconds + 1);
                }, 1000);
            } else if (!isActive && seconds !== 0) {
                clearInterval(interval);
            }
        }
        return () => clearInterval(interval);
    }, [isActive, seconds, tenzies]);


    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push({
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: i
            })
        }
        return newDice
    }

    function rollDice() {
        if (seconds !== 0) {
            if (tenzies) {
                setDice(allNewDice())
                setTenzies(false)
                setRolls(0)
                reset()
            } else {
                const newDice = dice.map(die => {
                    if (!die.isHeld) {
                        die.value = Math.ceil(Math.random() * 6)
                    }
                    return die
                })
                setDice(newDice)
                rollCount()
            }
        } else {
            alert("You must start the game before you roll")
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }

    const diceElements = dice.map((die) => (
        <Die
            isHeld={die.isHeld}
            key={die.id}
            value={die.value}
            id={die.id}
            holdDice={() => holdDice(die.id)}
        />
    ))


    React.useEffect(() => {
        if (tenzies) {
            if (rolls < lowest || lowest === null) {
                localStorage.setItem("tenzies", rolls + "");
            }
            localStorage.setItem("seconds", seconds + "");
        }
    } , [tenzies, rolls , lowest, seconds])


    React.useEffect(() => {
        if (localStorage.getItem("tenzies")) {
            setLowest(localStorage.getItem("tenzies"))
        }
        if (localStorage.getItem("seconds")) {
            setLowestTime(localStorage.getItem("seconds"))
        }
    } , [tenzies])


    function resetLocalStorage() {
        localStorage.removeItem("tenzies");
        localStorage.removeItem("seconds");
        setLowest(null);
        setLowestTime(null);
    }


    return (
        <main className={"d-flex mx-auto"}>
            {tenzies && <ReactConfetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="d-flex game-information">
                <p className={"me-2"}>Rolls: {rolls} </p>
                <p>Time: {seconds}</p>
            </div>
            <div className="dice-container">
                {diceElements}
            </div>
            <div className="d-flex game-controls">
                <button className="roll-dice me-2" onClick={!isActive ? toggle : reset}>{isActive ? 'Reset' : 'Start'}</button>
                <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
            </div>

            <button className="reset-roll-dice" onClick={resetLocalStorage}>Hard Reset</button>

            <div className="d-flex mt-3 ">
                <p className="me-2">Lowest Rolls: {lowest}</p>
                <p className="me-2">Lowest Time: {lowestTime}</p>
            </div>
        </main>
    )
}