import logoImage from '../../assets/Thesoothsayer.png'; // นำเข้าโลโก้
import SearchBar from '../search/search';
import Clearall from '../clear-all/clearall';


function Header({ onLogoClick, data , searchTerm, setSearchTerm }) {
  // สร้าง autocomplete suggestions จาก data
  const allKeywords = [
    ...new Set([
      ...data.map((r) => r.PLANT).filter(Boolean),
      ...data.map((r) => r.MACHINE).filter(Boolean),
      ...data.map((r) => r.COMPONENT).filter(Boolean),
      ...data.map((r) => r.MODEL).filter(Boolean),
      // ...data.map((r) => r.HEALTHSCORE),
      // ...data.map((r) => r.Actual_Value),
      ...data.map((r) => r.UNITS).filter(Boolean),
    ]),
  ];

  const suggestions = searchTerm
    ? allKeywords.filter((kw) =>
        kw.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

const handleClear = () => {
  setSearchTerm(""); // แค่ล้างค่า searchTerm
};

 return (
   <div className="px-6 ">
     {/* logo อยู่บรรทัดแรก */}
     <div className="flex justify-center items-center h-auto p-3 mt-2 max-h-[50px]">
       <img
         src={logoImage}
         className="cursor-pointer w-42 h-auto "
         id="logolink"
         alt="logosoothsayer"
         onClick={onLogoClick}
       />
     </div>

     {/* searchbar อยู่บรรทัดถัดมา */}
     <div className="relative w-full px-4 mt-2">
       <div className="flex justify-end items-center gap-2">
         <SearchBar
           searchTerm={searchTerm}
           setSearchTerm={setSearchTerm}
           suggestions={suggestions}
         />
         <Clearall onClear={handleClear} />
       </div>
     </div>
   </div>
 );
}

export default Header;