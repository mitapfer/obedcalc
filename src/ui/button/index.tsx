import {ButtonProps} from 'antd/lib';
import {Button} from 'antd';

export interface Props extends Omit<ButtonProps, "type"> {
  kind?: "primary" | "danger" | "default";
}

export const ButtonUI = ({ kind = "primary", ...restProps }: Props) => {
  const kinds = {
    primary: "bg-[#d47001] border-0",
    danger: "bg-[#de292c] border-0",
    default: "bg-[transparent] dark:text-white text-black flex justify-center items-center",
  };

  return <Button {...restProps} className={`${kinds[kind]} text-[#fff] hover:!text-[#d8d8d8]`} />
}
