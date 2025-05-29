
const operators = ['*', '/', '-', '+'] as const

export const calc = (val: string): number => {
  const num = Number(val.trim())

  if(!isNaN(num)){
    return num
  }

  const hasOperators = operators.some(o => val.includes(o))

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

export function navigateController(e: React.KeyboardEvent<HTMLInputElement>) {
  const isOnLeftSide =
    e.currentTarget.selectionStart === 0 && e.currentTarget.selectionEnd === 0;
  const isOnRightSide =
    e.currentTarget.selectionStart === e.currentTarget.value.length &&
    e.currentTarget.selectionEnd === e.currentTarget.value.length;

  if (
    ((e.key === "ArrowLeft" || e.key === "ArrowRight") && e.ctrlKey) ||
    (isOnLeftSide && e.key === "ArrowLeft") ||
    (isOnRightSide && e.key === "ArrowRight") ||
    e.key === "ArrowDown" ||
    e.key === "ArrowUp"
  ) {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    const id = input.id.split("-");
    const rowIdx = Number(id[1]);
    const colIdx = Number(id[2]);

    let nextRowIdx = rowIdx;
    let nextColIdx = colIdx;

    if (e.key === "ArrowDown") {
      nextRowIdx += 1;
    } else if (e.key === "ArrowUp") {
      nextRowIdx -= 1;
    } else if (e.key === "ArrowLeft") {
      nextColIdx -= 1;
    } else if (e.key === "ArrowRight") {
      nextColIdx += 1;
    }

    const nextInput = document.getElementById(
      `input-${nextRowIdx}-${nextColIdx}`
    ) as HTMLInputElement;

    if (nextInput) {
      nextInput.focus();
      nextInput.select();
    }
  }
}