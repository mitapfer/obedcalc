import {InputProps} from 'antd/lib';
import {Input} from 'antd';

export const InputUI = (props: InputProps) => {
  return <Input {...props} className="dark:bg-[var(--black)] dark:text-[#fff]" />
}
