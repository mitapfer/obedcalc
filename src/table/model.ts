import {makeAutoObservable} from "mobx";
import {nanoid} from "nanoid";

type ColumnsMapValue = {
  key: string;
  value: string;
}

const persons = ['№','Элёр', 'Жавлон', 'Санжар', 'Влад', 'Максад']

class ServiceFeeModel {
  value: number

  constructor() {
    this.value = 0
    makeAutoObservable(this, {}, {autoBind: true})
  }

  setValue (value: number) {
    this.value = Number(value)
  }
}

export class Model {
  rows: ColumnsMapValue[][]

  serviceFee: ServiceFeeModel
  constructor() {
    this.rows = [];
    this.serviceFee = new ServiceFeeModel()
    makeAutoObservable(this, {}, {autoBind: true})
  }

  get maxColSize (): number {
    let max = 0
    this.rows.forEach(cols => {
      max = Math.max(max = cols.length)
    })

    return max
  }

  addCol () {
    this.rows.forEach((row, idx) => {
      if(row.length === 0){
        row.push({key: nanoid(), value: persons[idx] || ''})
      }else {
        row.push({key: nanoid(), value: ''})
      }
    })
  }

  addRow () {
    const columns: ColumnsMapValue[] = []

    for (let i = 0; i < this.maxColSize; i++) {
      columns.push({key: nanoid(), value: ''})
    }

    this.rows.push(columns)
  }

  generate (row: number, col: number) {
    for (let i = 0; i < row; i++) {
      this.addRow()
    }

    for (let i = 0; i < col; i++) {
      this.addCol()
    }
  }

  removeRow (index: number) {
    this.rows.splice(index, 1)
  }

  removeCol (colIndex: number) {
    this.rows.forEach(row => {
      row.splice(colIndex, 1)
    })
  }

  setCellValue (rowIndex: number, colIndex: number, value: string) {
    this.rows[rowIndex][colIndex].value = value
  }

  get rowsSum () {
    const rows: number[] = []

    this.rows.forEach((row, idx) => {
      row.forEach((col) => {
        const value = Number(col.value)
        if(!isNaN(value)){
          rows[idx] = (rows[idx] || 0) + value
        }
      })
    })

    return rows
  }

  get serviceFeeSum () {
    return this.rowsSum.map(sum => (sum * (this.serviceFee.value / 100)))
  }

  get totalRowsSum () {
    console.log('==>> ',this.rowsSum)
    return this.rowsSum.map(sum => sum + sum * (this.serviceFee.value / 100))
  }

  get sum (): number {

    let sum = 0
    this.rows.forEach(row => {
      let colSum = 0
      row.forEach(col => {
        const value = Number(col.value)
        if(!isNaN(value)){
          colSum += value
        }
      })

      sum += colSum + colSum * (this.serviceFee.value / 100)
    })

    return sum
  }

  setCell (rowIndex: number, colIndex: number, value: string) {
    this.rows[rowIndex][colIndex].value = value
  }

}

export const model = new Model()

export class FormModel {

  rowsCount = 1
  colsCount = 1
  constructor() {
    makeAutoObservable(this, {}, {autoBind: true})
  }

  setRowsCount (value: number) {
    this.rowsCount = value
  }

  setColsCount (value: number) {
    this.colsCount = value
  }

  generate () {
    model.generate(this.rowsCount, this.colsCount)
  }
}