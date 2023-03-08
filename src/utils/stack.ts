

interface IStack<T> {
    items: T[],
    isEmpty: () => boolean,
    pop: () => T | undefined,
    push: (val: T) => void,
    size: () => number
    peek: () => T | null
}

export default class Stack<T> implements IStack<T> {
    items: T[]
    constructor() {
        this.items = []
    }

    isEmpty(){
        return this.items.length === 0
    }

    pop(){
        return this.items.pop()
    }

    push(val: T){
        if (val) this.items.push(val)
    }

    size(){
        return this.items.length
    }

    peek(){
        return this.items[this.items.length - 1]
    }
}