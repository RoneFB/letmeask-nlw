import { ButtonHTMLAttributes } from "react";
import '../styles/button.scss';
type ButtonType = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};


export function Button({ isOutlined = false, ...props }: ButtonType) {

    return(
        <button className={`button ${isOutlined ? 'outlined' : ''}`} {...props}></button>
    )
}

