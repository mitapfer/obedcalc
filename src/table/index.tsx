import { FormModel, model } from "./model.ts";
import { observer } from "mobx-react-lite";
import { Fragment, ReactNode, useState } from "react";
import Input from "antd/es/input/Input";
import { Button, Tooltip } from "antd";
import { DollarOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { Calculator } from "../calculator/calculator.tsx";
import { truncateNumber } from '../utils';

export const ServiceFeeComp = observer(() => {
  return (
    <div className='mb-3'>
      <h6>Обслуга</h6>
      <Input
        type='number'
        placeholder='Обслуга'
        value={model.serviceFee.value}
        onChange={(e) => model.serviceFee.setValue(Number(e.target.value))}
      />
    </div>
  )
})

export const Table = observer(() => {
  return (
    <>
      <ServiceFeeComp />
      <div className='flex gap-2 mb-3'>
        <Button onClick={model.addRow}>
          Добавить строку
        </Button>
        <Button onClick={model.addCol}>
          Добавить колонку
        </Button>
        <Button danger onClick={model.clearAll}>
          Очистить все
        </Button>
        <Button danger onClick={model.reset}>
          Удалить все
        </Button>
      </div>
      <div>
        {
          model.rows.map((cols, rowIdx) => {
            return (
              <Fragment key={rowIdx}>
                <div className="flex align-middle">
                  <div className='flex'>
                    {
                      cols.map((col, colIdx) => {
                        return (
                          <div>
                            {
                              rowIdx === 0 && (
                                <div className={`flex justify-center gap-2 ${colIdx === 0 ? 'opacity-0' : ''}`}>
                                  <Tooltip title={colIdx === 0 ? undefined : 'Удалить колонку'}>
                                    <MinusCircleOutlined onClick={() => model.removeCol(colIdx)} />
                                  </Tooltip>
                                  <Tooltip title={colIdx === 0 ? undefined : col.excludeServiceFee ? 'Включить обслугу' : 'Выключить обслугу'}>
                                    <DollarOutlined
                                      onClick={() => model.setColumnServiceFee(colIdx, !col.excludeServiceFee)}
                                      className={col.excludeServiceFee ? 'opacity-50' : ''}
                                    />
                                  </Tooltip>
                                </div>
                              )
                            }
                            <Border key={col.key}>
                              <Input
                                type='text'
                                value={col.value}
                                onChange={(e) => {
                                  model.setCell(rowIdx, colIdx, e.target.value)
                                }}
                              />
                            </Border>
                          </div>
                        )
                      })
                    }
                    {
                      model.serviceFee.value > 0 && (
                        <div>
                          {
                            rowIdx === 0 && (
                              <div className='flex justify-center'>
                                <span className='leading-[10px]'>Обслуга</span><MinusCircleOutlined
                                style={{ opacity: 0 }} />
                              </div>
                            )
                          }
                          <Border>
                            <Input
                              type='text'
                              value={truncateNumber(model.serviceFeeSum[rowIdx])}
                              disabled
                              style={{
                                color: 'brown'
                              }}
                            />
                          </Border>
                        </div>
                      )
                    }
                    <div>
                      {
                        rowIdx === 0 && (
                          <div className='flex justify-center'>
                            <span className='leading-[10px]'>Итого</span>  <MinusCircleOutlined style={{ opacity: 0 }} />
                          </div>
                        )
                      }
                      <Border>
                        <Input
                          type='text'
                          value={truncateNumber(model.totalRowsSum[rowIdx])}
                          disabled
                          style={{
                            color: 'green'
                          }}
                        />
                      </Border>
                    </div>
                  </div>
                  <MinusCircleOutlined
                    onClick={() => model.removeRow(rowIdx)}
                  />
                </div>
              </Fragment>
            )
          })
        }
        <h1 className='flex justify-end my-2'>Общая сумма: {truncateNumber(model.sum)}</h1>
      </div>
      <Calculator />
    </>
  );
});

export function Border({ children }: { children: ReactNode }) {
  return (
    <div className='p-2 border border-black'>
      {children}
    </div>
  )
}

export const GenerateColumn = observer(() => {
  const [form] = useState(() => new FormModel())
  return (
    <div className='p-6 border border-black'>
      <h1 className='mb-2 text-center'>Генерация таблицы</h1>
      <div className="flex gap-2">
        <label>
          <div>Кол-во строк</div>
          <Input
            min={1}
            type="number"
            placeholder='Кол-во строк'
            value={form.rowsCount}
            onChange={e => form.setRowsCount(Number(e.target.value))} />
        </label>
        <label>
          <div>Кол-во колонок</div>
          <Input
            min={1}
            type="number"
            placeholder='Кол-во колонок'
            value={form.colsCount}
            onChange={e => form.setColsCount(Number(e.target.value))} />
        </label>
      </div>
      <div className="flex justify-end mt-3">
        <Button type='dashed' onClick={form.generate}>
          Генерировать
        </Button>
      </div>
    </div>
  )
})