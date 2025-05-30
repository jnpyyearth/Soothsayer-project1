import { ArrowPathIcon } from "@heroicons/react/24/solid";

function Clearall({ onReload }) {
  return (
    <div>
      <button
        className="flex bg-sky-700 text-zinc-50 rounded-full text-lg font-kanit mt-4 px-3 py-3 ml-4 cursor-pointer
         w-[150px] whitespace-nowrap hover:bg-sky-800 "
        onClick={onReload}
      >
        CLEAR-ALL <ArrowPathIcon className="h-7 w-7 ml-2"/>
      </button>
    </div>
  );
}

export default Clearall;
