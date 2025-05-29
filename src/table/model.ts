import {makeAutoObservable} from "mobx";
import {nanoid} from "nanoid";
import {calc} from "./lib.ts";

type ColumnsMapValue = {
  key: string;
  value: string;
  excludeServiceFee?: boolean;
}

const persons = ['№', 'Жавлон', 'Влад', 'Максад', 'Сардор', 'Михаил', 'Элёр', 'Санжар' ]

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

  addCol() {
    this.rows.forEach((row, idx) => {
      if(row.length === 0){
        row.push({key: nanoid(), value: persons[idx] || '', excludeServiceFee: false})
      }else {
        row.push({key: nanoid(), value: '', excludeServiceFee: false})
      }
    })
  }

  addRow() {
    const columns: ColumnsMapValue[] = []

    for (let i = 0; i < this.maxColSize; i++) {
      columns.push({key: nanoid(), value: '', excludeServiceFee: false})
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

  setColumnServiceFee(colIndex: number, exclude: boolean) {
    this.rows.forEach(row => {
      if (row[colIndex]) {
        row[colIndex].excludeServiceFee = exclude;
      }
    });
  }

  get rowsSum () {
    const rows: number[] = []

    this.rows.forEach((row, idx) => {
      row.forEach((col) => {
        const value = calc(col.value)
        if(!isNaN(value)){
          rows[idx] = (rows[idx] || 0) + value
        }
      })
    })

    return rows
  }

  get serviceFeeSum() {
    return this.rows.map((row) => {
      const sum = row.reduce((acc, col) => {
        if (!col.excludeServiceFee) {
          const value = calc(col.value)
          return acc + (isNaN(value) ? 0 : value)
        }
        return acc
      }, 0)
      return sum * (this.serviceFee.value / 100)
    })
  }

  get totalRowsSum() {
    return this.rows.map((row) => {
      const regularSum = row.reduce((acc, col) => {
        const value = calc(col.value)
        return acc + (isNaN(value) ? 0 : value)
      }, 0)

      const serviceFeeSum = row.reduce((acc, col) => {
        if (!col.excludeServiceFee) {
          const value = calc(col.value)
          return acc + (isNaN(value) ? 0 : value)
        }
        return acc
      }, 0) * (this.serviceFee.value / 100)

      return regularSum + serviceFeeSum
    })
  }

  get sum(): number {
    let sum = 0
    this.rows.forEach(row => {
      let regularSum = 0
      let serviceFeeSum = 0

      row.forEach(col => {
        const value = calc(col.value)
        if(!isNaN(value)){
          regularSum += value
          if (!col.excludeServiceFee) {
            serviceFeeSum += value
          }
        }
      })

      sum += regularSum + (serviceFeeSum * (this.serviceFee.value / 100))
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