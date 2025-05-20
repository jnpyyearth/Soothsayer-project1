function Rowselect ({ pageSize, setPageSize }){

    const row_option = [10,25,50,75,100];

    return (
      <div class="inline-flex gap-2 items-center bg-black text-white">
        <label className="text-sm text-gray-700 dark:text-neutral-300">
          Select show rows :
        </label>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {row_option.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        
      </div>
    );
}

export default Rowselect