import { ButtonHTMLAttributes } from "react";
import '../styles/button.scss';
type ButtonType = ButtonHTMLAttributes<HTMLButtonElement>;


export function Button(props: ButtonType) {

    return(
        <button {...props}></button>
    )
}

