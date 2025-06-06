import { ArrowPathIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

function Clearall({ onClear}) {
   const [isSpinning, setIsSpinning] = useState(false);
  const handleClick = () => {
    setIsSpinning(true);       // เริ่มหมุน
    onClear();                 // เรียกฟังก์ชัน clear
    setTimeout(() => setIsSpinning(false), 500); // หยุดหมุนหลัง 1 วินาที
  };

  return (
    <div>
      <button
        className="flex bg-sky-700 text-zinc-50 rounded-md text-lg font-kanit px-3 py-3 ml-4  cursor-pointer
         w-[150px] whitespace-nowrap hover:bg-sky-900 "
        onClick={handleClick}
      >
        CLEAR-ALL  <ArrowPathIcon
          className={`h-7 w-7 ml-2 transition-transform ${
            isSpinning ? "animate-fastSpin" : ""
          }`}
        />
      </button>
    </div>
  );
}

export default Clearall;
