import { useState } from "react";
import { compose } from "./utils/compose";
import Stack from "./utils/stack";
import BigNumber from "bignumber.js";

type Leksema = {
  type: string;
  value: number;
}

function App() {
  const [input, setInput] = useState<string>('')

  const tokenize = (line: string): string[] => {
    var results = [];
    var tokenRegExp = /\s*([A-Za-z]+|([0-9|.])+|\S)\s*/g;

    var m;
    while ((m = tokenRegExp.exec(line)) !== null)
      results.push(m[1]);
    console.log(results);

    return results;
  }

  const getPriority = (op: string): number => {
    if ('+-'.includes(op)) return 1
    else if ('*/'.includes(op)) return 2
    return -1
  }

  const isNumber = (str: string): boolean => {
    if (str.length > 1) {
      return str.split('').reduce((prev, curr) => {
        return prev && '1234567890.'.includes(curr)
      }, true)
    }
    return '1234567890.'.includes(str)
  }

  const isOperand = (str: string): boolean => {
    if (str.length === 1) {
      return ('+-/*'.includes(str))
    }
    return false
  }

  const parser = (str: string): string[] => {
    return tokenize(str)
  }

  const calculate = (numbers: Stack<Leksema>, operators: Stack<Leksema>): boolean => {

    let a = numbers?.pop()?.value as number
    let b = numbers?.pop()?.value as number
    let op = operators?.pop()?.type as string

    let c;
    if (op === '+') {
      c = a + b
      numbers.push({ type: '0', value: c })
    }
    else if (op === '-') {
      c = b - a
      numbers.push({ type: '0', value: c })
    }
    else if (op === '*') {
      c = a * b
      numbers.push({ type: '0', value: c })
    }
    else if (op === '/') {
      if (b === 0) {
        c = 0
      }
      if (a === 0) {
        console.log('Zero division');
        setInput('Zero division')
        return false
      }
      c = b / a
      numbers.push({ type: '0', value: c })
    }
    else {
      console.log('Error in calculator module: operand');
      return false
    }

    return true
  }

  const generator = (arr: string[]): Stack<Leksema>[] | number => {
    const numbers = new Stack<Leksema>()
    const operators = new Stack<Leksema>()

    for (let i = 0; i < arr.length; i++) {
      let item: Leksema = { type: 'none', value: 0 };
      if (arr[i].length > 1 && arr[i][0] === '-') {
        let tmp = ''
        for (let j = 1; j < arr[i].length; j++) {
          if (isNumber(arr[i].split('')[j])) {
            tmp += arr[i].split('')[j]
          }
          else {
            return 0
          }
        }
        item.type = '0'
        item.value = -1 * Number(tmp)
        numbers.push(item)
      }
      if (isNumber(arr[i])) {
        item.type = '0'
        item.value = Number(arr[i])
        numbers.push(item)
      }
      else if (isOperand(arr[i])) {
        if (operators.size() === 0) {
          item.type = arr[i]
          item.value = 0
          operators.push(item)
        }
        else if (operators.size() !== 0 && getPriority(arr[i]) > getPriority(operators.peek()?.type)) {
          item.type = arr[i]
          item.value = 0
          operators.push(item)
        }
        else if (operators.size() !== 0 && getPriority(arr[i]) <= getPriority(operators.peek()?.type)) {
          calculate(numbers, operators)
          item.type = arr[i]
          item.value = 0
          operators.push(item)
        }
      }
    }

    return [numbers, operators]
  }

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const main = (arr: Stack<Leksema>[]) => {
    while (arr[1].size() !== 0) {
      if (calculate(arr[0], arr[1]) === false) {
        return 0
      }
    }

    setInput(String(arr[0].pop()?.value))
  }

  const buttonClickHandler = (e: any) => {
    compose<any>(
      parser,
      generator,
      main
    )(input)

  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      buttonClickHandler(event)
    }
  }

  return (
    < div className="App" >

      <input value={input} onChange={e => inputHandler(e)} onKeyDown={handleKeyDown} className="border-4 border-sky-300 rounded-md p-2"></input>
      <button onClick={e => buttonClickHandler(e)} >Calculate</button>
      <div className="hidden">
        ZERO DIVISON
      </div>
    </ div>
  );
}

export default App;
