import logoImage from '../../assets/Thesoothsayer.png'; // นำเข้าโลโก้
import SearchBar from '../search/search';

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

 return (
  <div className="px-6 py-4">
    {/* logo อยู่บรรทัดแรก */}
     <div className="flex justify-center items-center h-auto">
      <img
        src={logoImage}
        className="cursor-pointer w-50 h-auto mx-auto"
        id="logolink"
        alt="logosoothsayer"
        onClick={onLogoClick}
      />
    </div>

    {/* searchbar อยู่บรรทัดถัดมา */}
    <div className="relative w-full max-w-md mt-10">
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
