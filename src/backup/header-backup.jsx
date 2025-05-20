import logoImage from '../../assets/Thesoothsayer.png'; // นำเข้าโลโก้
import SearchBar from '../search/search';

function Header({ onLogoClick, data , searchTerm, setSearchTerm }) {
  // ย้าย state searchTerm มาไว้ใน Header
  
  // สร้าง autocomplete suggestions จาก data
  const allKeywords = [
    ...new Set([
      // ...data.map((r) => r.PLANT),
      ...data.map((r) => r.MACHINE),
      ...data.map((r) => r.COMPONENT),
      ...data.map((r) => r.MODEL),
      // ...data.map((r) => r.HEALTHSCORE),
      // ...data.map((r) => r.Actual_Value),
      ...data.map((r) => r.UNITS),
    ].filter(Boolean)),
  ];

  const suggestions = searchTerm
    ? allKeywords.filter((kw) =>
        kw.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

return (
    <div className="flex items-center justify-start px-6 py-4 gap-20 overflow-x-auto">

      {/* logo click to form */}
      <img
        src={logoImage}
        className="relative ml-20 py-6 cursor-pointer"
        id="logolink"
        alt="logosoothsayer"
        onClick={onLogoClick} // เมื่อคลิกโลโก้ จะเรียกใช้ฟังก์ชันนี้
      />

      {/* searchbar  */}
     <div className="relative w-[400px]"> 
        <SearchBar
          className="w-full"
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          suggestions={suggestions}
        />
      </div>
    </div>
  );
}

export default Header;
