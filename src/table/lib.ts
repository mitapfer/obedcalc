
const operators = ['*', '/', '-', '+'] as const

export const calc = (val: string): number => {
  const num = Number(val.trim())

  if(!isNaN(num)){
    return num
  }

  const hasOperators = operators.some(o => val.includes(o))

  console.log('hasOperators ', hasOperators)

  if(!hasOperators){
    return NaN
  }

  if(val.includes('*')){
    const nums = toSplit(val, '*')
    if(check(nums)){
      return NaN
    }

    return nums.reduce((acc, n) => acc *= n, 1)
  }

  if(val.includes('+')){
    const nums = toSplit(val, '+')
    if(check(nums)){
      return NaN
    }

    return nums.reduce((acc, n) => acc += n, 0)
  }


  if(val.includes('/')){
    const nums = toSplit(val, '/')
    if(check(nums)){
      return NaN
    }

    return nums.slice(1).reduce((acc, n) => {
      if(n === 0){
        return acc
      }

      acc /= n
      return acc
    }, nums[0])
  }

  if(val.includes('-')){
    const nums = toSplit(val, '-')
    if(check(nums)){
      return NaN
    }

    return nums.slice(1).reduce((acc, n) => acc - n, nums[0])
  }

  return NaN
}

function toSplit (val: string, separator: string) {
  return val.split(separator).map(Number)
}

function check (nums: number[]) {
  return nums.some(n => isNaN(n))
}