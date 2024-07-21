import React from "react";
// import "../../styles.css"
type Props = {
    type: "native" | "token";
    tokenSymbol?: string;
    tokenBalance?: string;
    current: string;
    setValue: (value: string) => void;
    max?: string;
    value: string;
};

export default function SwapToken({
    type,
    tokenSymbol,
    tokenBalance,
    setValue,
    value,
    current,
    max,
}: Props) {
    const truncate = (value: string) => {
        if (value === undefined) return;
        if (value.length > 5) {
            return value.slice(0, 5);
        }
        return value;
    };

    return (
        <div className="thin-border p-4 rounded-lg ">
           <input 
                type="number"
                placeholder="0.0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={current !== type} 
                className="bg-transparent"
            /> 
            
        </div>
    )
}