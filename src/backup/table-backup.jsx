import { useEffect, useState, useRef, useMemo } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { UserGroupIcon, CalendarIcon, UserIcon ,ChatBubbleLeftEllipsisIcon  } from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import Header from "../header/header";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import ReactDOMServer from "react-dom/server";

function useMultipleOutsideClick(dropdowns) {
  useEffect(() => {
    function handleClickOutside(event) {
      let hasDropdownOpen = false;
      const newStates = {};
      Object.entries(dropdowns).forEach(([key, { ref, isOpen }]) => {
        if (isOpen) {
          hasDropdownOpen = true;
          if (ref.current && !ref.current.contains(event.target)) {
            newStates[key] = false;
          }
        }
      });
      if (hasDropdownOpen) {
        Object.entries(newStates).forEach(([key, value]) => {
          dropdowns[key].setOpen(value);
        });
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdowns]);
}

function Table() {
  const [data, setData] = useState([]);
  const [selectedRowGlobalIndex, setSelectedRowGlobalIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState("");
  const [action, setAction] = useState("0");
  const [customCaution, setCustomCaution] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const pageSize = 25; 

  const closeModalWithFade = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };

  const roleMap = {
    GSP1: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    ESP: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP2: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP3: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP4: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP5: { engineer: "Piyarach Somwatcharajit", officer: "Issarapong Tumhonyam" },
    GSP6: { engineer: "Piyarach Somwatcharajit", officer: "Issarapong Tumhonyam" },
    GPPP: { engineer: "Apichai Mekha", officer: "Issarapong Tumhonyam" },
  };

  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Select All Time");

  const dropdownRef = useRef(null);
  const [plantDropdownOpen, setPlantDropdownOpen] = useState(false);

  const [selectedPlant, setSelectedPlant] = useState("All Plants");
  const plantDropdownRef = useRef(null);

  const [machineOpen, setmachineopen] = useState(false);
  const [selectedmachine, setSelectedmachine] = useState("Select All Machine");
  const machineRef = useRef(null);

  const [componentsOpen, setComponentopen] = useState(false);
  const [selectedcomponents, setSelectedcomponents] = useState("Select All Components");
  const componentsRef = useRef(null);
  
  // option dropdown plant-machine-components
  const [plantOptions, setPlantoptions] = useState();
  const [machineOption , setMachineoptions] = useState();
  const [componentsOption , setComponentsoptions] = useState();

 // Load plants from data
  useEffect(() => {
    if (data.length > 0) {
      const plants = Array.from(new Set(data.map(row => row.PLANT))).filter(Boolean);
      setPlantoptions(plants);
    } else {
      setPlantoptions([]);
    }
  }, [data]);

  //load data
   useEffect(() => {
    if (selectedPlant && selectedPlant !== "All Plants") {
      const machines = Array.from(
        new Set(
          data
            .filter(row => row.PLANT === selectedPlant)
            .map(row => row.MACHINE)
        )
      ).filter(Boolean);
      setMachineoptions(machines);
    } else {
      setMachineoptions([]);
    }
    // Reset machine and component selection on plant change
    setSelectedmachine("Select All Machine");
    setComponentsoptions([]);
    setSelectedcomponents("Select All Components");
  }, [selectedPlant, data]);


   // Update components เมื่อเลือก machine หรือ Plant 
  useEffect(() => {
    if (
      selectedPlant &&
      selectedPlant !== "All Plants" &&
      selectedmachine &&
      selectedmachine !== "Select All Machine"
    ) {
      const components = Array.from(
        new Set(
          data
            .filter(row => row.PLANT === selectedPlant && row.MACHINE === selectedmachine)
            .map(row => row.COMPONENT)
        )
      ).filter(Boolean);
      setComponentsoptions(components);
    } else {
      setComponentsoptions([]);
    }
    // Reset component selection on machine change
    setSelectedcomponents("Select All Components");
  }, [selectedmachine, selectedPlant, data]);


  //fetch api
  const fetchData = () => {
    fetch("/get_data")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  };
  useEffect(() => {
    fetchData();
  }, []);

  // set dropdown
  const dropdowns = useMemo(
    () => ({
      timeDropdown: { ref: dropdownRef, isOpen: open, setOpen },
      plantDropdown: { ref: plantDropdownRef, isOpen: plantDropdownOpen, setOpen: setPlantDropdownOpen },
      machineDropdown: { ref: machineRef, isOpen: machineOpen, setOpen: setmachineopen },
      componentsDropdown: { ref: componentsRef, isOpen: componentsOpen, setOpen: setComponentopen },
    }),
    [open, plantDropdownOpen, machineOpen, componentsOpen]
  );

  useMultipleOutsideClick(dropdowns);

const timeRanges = [
  "00:00 - 05:59",
  "06:00 - 11:59",
  "12:00 - 17:59",
  "18:00 - 23:59",
];

  const handleSelectTime = (timeRange) => {
    setSelectedTime(timeRange);
    setOpen(false);
    setSelectedRowGlobalIndex(null);
    setCurrentPage(1);
  };

  const handleSelectPlant = (plant) => {
    setSelectedPlant(plant);
    setPlantDropdownOpen(false);
    setSelectedRowGlobalIndex(null);
    setCurrentPage(1);
  };

  const handleSelectmachine = (machine) => {
    setSelectedmachine(machine);
    setmachineopen(false);
    setSelectedRowGlobalIndex(null);
    setCurrentPage(1);
  };

  const handleSelectcomponent = (component) => {
    setSelectedcomponents(component);
    setComponentopen(false);
    setSelectedRowGlobalIndex(null);
    setCurrentPage(1);
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // กรองข้อมูล
  const filteredData = data.filter((row) => {
    const matchTime = isTimeInRange(row.TIME, selectedTime);
    const matchPlant = selectedPlant === "All Plants" || row.PLANT === selectedPlant;
    const matchComponent = selectedcomponents === "Select All Components" || row.COMPONENT === selectedcomponents;
    const matchMachine = selectedmachine === "Select All Machine" || row.MACHINE === selectedmachine;
    const lowerSearch = searchTerm.toLowerCase();
    const matchSearch =
      !searchTerm ||
      row.MODEL.toLowerCase().includes(lowerSearch) ||
      row.COMPONENT.toLowerCase().includes(lowerSearch) ||
      row.UNITS.toLowerCase().includes(lowerSearch);
    return matchTime && matchPlant && matchComponent && matchMachine && matchSearch;
  });

  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);


  const handleLogoClick = () => {
    if (selectedRowGlobalIndex !== null) {
      setShowModal(true);
    } else {
      Swal.fire({
        title: "เลือกแถวที่ต้องการก่อนนะครับ",
        text: "Please select a row before click!",
        icon: "warning",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
        },
        buttonsStyling: false,
        showClass: { popup: ` animate__animated animate__fadeInUp animate__faster ` },
        hideClass: { popup: `animate__animated animate__fadeOutDown animate__faster ` },
      });
    }
  };

  const handleSave = () => {
    let newCaution = action === "custom" ? parseFloat(customCaution) : parseFloat(action);
    if (isNaN(newCaution)) {
      Swal.fire("Invalid Input", "Please enter a valid custom value.", "warning");
      return;
    }

    fetch("http://localhost:5000/update_row", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ rowIndex: selectedRowGlobalIndex, newCaution, note }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          Swal.fire("Saved", `Updated at: ${result.acknowledge_time}`, "success").then(() => {
            fetchData();
            setShowModal(false);
            setSelectedRowGlobalIndex(null);
          });
        } else {
          Swal.fire("Error", result.message, "error");
        }
      });
  };

  const iconHtml = ReactDOMServer.renderToStaticMarkup(
    <UserGroupIcon className="inline-block w-5 h-5 mr-2 text-white" />
  );

  function normalizeTime(timeStr) {
    if (!timeStr || typeof timeStr !== "string") return null;
    const parts = timeStr.trim().split(" ");
    const timePart = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    const timeParts = timePart.split(":");
    if (timeParts.length < 2) return null;
    return timeParts[0].padStart(2, "0") + ":" + timeParts[1].padStart(2, "0");
  }

  function timeToMinutes(timeStr) {
    const norm = normalizeTime(timeStr);
    if (!norm) return -1;
    const [hh, mm] = norm.split(":").map(Number);
    if (isNaN(hh) || isNaN(mm)) return -1;
    return hh * 60 + mm;
  }

  function isTimeInRange(timeStr, rangeLabel) {
    if (rangeLabel === "Select All Time") return true;
    const timeMin = timeToMinutes(timeStr);
    if (timeMin === -1) return false;

    const [startStr, endStr] = rangeLabel.split(" - ");
    const startMin = timeToMinutes(startStr);
    const endMin = timeToMinutes(endStr);

    return timeMin >= startMin && timeMin <= endMin;
  }

  const onPageChange = (e, page) => {
    setCurrentPage(page);

  };

  return (
  <div className="p-10 flex flex-col mx-auto overflow-x-hidden" style={{ width: "100vw", maxWidth: "100%" }}>
      <div
        className="md:w-auto flex-col md:flex-row space-y-2 
      md:space-y-0 z-100 align-top"
      >
        <Header
          onLogoClick={handleLogoClick}
          data={data}
          searchTerm={searchTerm}
          setSearchTerm={handleSearchTermChange}
          className="relative"
        />
      </div>

     <table className="font-custom table-auto border-collapse border text-sm mt-10 w-full">
        
        <thead className="bg-headtable-gradient text-lg text-sky-500 ">
          <tr>
            <th className="border border-black text-sm">
              {/* Time dropdown */}
              <div className="relative inline-flex" ref={dropdownRef}>
                <button
                  type="button"
                  className="hs-dropdown-toggle w-max px-2 
                  inline-flex items-center gap-x-2 text-sm 
                  font-medium rounded-lg border border-sky-500
                   bg-black text-neutral-100 shadow-2xs focus:outline-hidden"
                  aria-haspopup="menu"
                  aria-expanded={open ? "true" : "false"}
                  aria-label="Dropdown"
                  onClick={() => setOpen(!open)}
                >
                  {selectedTime}
                  <svg
                    className={`size-4 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {open && (
                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] 
                    duration absolute right-0 z-10 mt-2 ml-5 min-w-fit origin-top-right 
                    rounded-md bg-white shadow-md dark:bg-neutral-800 
                    dark:border dark:border-neutral-700 max-h-60 overflow-auto"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-dropdown-hover-event"
                  >
                    <div className="p-1 overflow-x-auto">
                      <div className="min-w-max space-y-1">
                        {/* ปุ่มเลือกช่วงเวลาใหญ่ทั้งหมด */}
                        <button
                          onClick={() => {
                            handleSelectTime("Select All Time");
                            setOpen(false);
                          }}
                          className="block text-left px-4 py-2 text-sm text-black whitespace-nowrap hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                        >
                          Select All Time
                        </button>

                        {/* แสดงเฉพาะช่วงเวลาใหญ่ (range) */}
                        {timeRanges.map((rangeLabel) => (
                          <button
                            key={rangeLabel}
                            onClick={() => {
                              handleSelectTime(rangeLabel);
                              setOpen(false);
                            }}
                            className="block text-left px-4 py-2 text-sm font-semibold text-black whitespace-nowrap hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                          >
                            {rangeLabel}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </th>

              {/* Plant dropdown */}
            <th className=" py-2 border border-black">
              <div className="relative inline-flex" ref={plantDropdownRef}>
                <button
                  type="button"
                  className="hs-dropdown-toggle py-2 px-2 inline-flex 
                  items-center text-sm font-medium w-[200] rounded-lg 
                  border border-sky-500 bg-black text-neutral-100 shadow-white focus:outline-hidden"
                  aria-haspopup="menu"
                  aria-expanded={plantDropdownOpen ? "true" : "false"}
                  aria-label="Dropdown"
                  onClick={() => setPlantDropdownOpen(!plantDropdownOpen)}
                >
                  {selectedPlant}
                  <svg
                    className={`size-4 transition-transform ${plantDropdownOpen ? "rotate-180" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {plantDropdownOpen && (
                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration absolute 
                    right-0 z-10 mt-2 min-w-fit origin-top-right rounded-md
                     bg-white shadow-md dark:bg-neutral-800 dark:border
                      dark:border-neutral-700 max-h-60 overflow-auto"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-dropdown-hover-event"
                  >
                    <div className="p-1 space-y-1">
                      <button
                        key="all-plants"
                        onClick={() => handleSelectPlant("All Plants")}
                        className="block w-full text-left px-4 py-2 text-sm text-black whitespace-nowrap hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                      >
                        All Plants
                      </button>
                      {plantOptions.map((plant) => (
                        <button
                          key={plant}
                          onClick={() => handleSelectPlant(plant)}
                          className="block w-full text-left px-4 py-2 text-sm text-black whitespace-nowrap dark:text-neutral-400 dark:hover:bg-neutral-700"
                        >
                          {plant}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </th>

            {/* Machine dropdown */}
            <th className=" py-2 border border-black">
              <div className="relative inline-flex" ref={machineRef}>
                <button
                  type="button"
                  className="hs-dropdown-toggle py-2 px-2 inline-flex 
                  items-center gap-x-2 text-sm font-medium rounded-lg border
                   border-sky-500 bg-black text-neutral-100 shadow-2xs focus:outline-hidden "
                  aria-haspopup="menu"
                  aria-expanded={machineOpen ? "true" : "false"}
                  aria-label="Dropdown"
                  onClick={() => setmachineopen(!machineOpen)}
                >
                  {selectedmachine}
                  <svg
                    className={`size-4 transition-transform ${
                      machineOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {machineOpen && (
                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration absolute right-0 z-10 mt-2 min-w-fit origin-top-right rounded-md bg-white shadow-md dark:bg-neutral-800 dark:border dark:border-neutral-700 max-h-60 overflow-auto"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-dropdown-hover-event"
                  >
                    <div className="p-1 space-y-1">
                      <button
                        key="all-machines"
                        onClick={() =>
                          handleSelectmachine("Select All Machine")
                        }
                        className="block w-full text-left px-4 py-2 text-sm text-black whitespace-nowrap hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                      >
                        Select All Machine
                      </button>

                   {machineOption.map((machine) => (
                        <button
                          key={machine}
                          onClick={() => handleSelectmachine(machine)}
                          className="block w-full text-left px-4 py-2 text-sm text-black whitespace-nowrap hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                        >
                          {machine}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </th>

            {/* Components dropdown */}
            <th className=" py-2 border border-black">
              <div className="relative inline-flex" ref={componentsRef}>
                <button
                  type="button"
                  className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-sm 
                  font-medium rounded-lg border border-sky-500 bg-black text-neutral-100 shadow-2xs  focus:outline-hidden"
                  aria-haspopup="menu"
                  aria-expanded={componentsOpen ? "true" : "false"}
                  aria-label="Dropdown"
                  onClick={() => setComponentopen(!componentsOpen)}
                >
                  {selectedcomponents}
                  <svg
                    className={`size-4 transition-transform ${
                      componentsOpen ? "rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {componentsOpen && (
                  <div
                    className="hs-dropdown-menu transition-[opacity,margin] duration absolute right-0 z-10 mt-2 min-w-fit origin-top-right rounded-md bg-white shadow-md dark:bg-neutral-800 dark:border dark:border-neutral-700 max-h-60 overflow-auto"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="hs-dropdown-hover-event"
                  >
                    <div className="p-1 space-y-1 overflow-x-auto">
                      <div className="min-w-max">
                        <button
                          key="all-components"
                          onClick={() =>
                            handleSelectcomponent("Select All Components")
                          }
                          className="block w-full text-left px-4 py-2 text-sm text-black whitespace-nowrap hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-700 "
                        >
                          Select All Components
                        </button>

                       {componentsOption.map((component) => (
                          <button
                            key={component}
                            onClick={() => handleSelectcomponent(component)}
                            className="block w-full text-left px-4 py-2 text-sm text-black whitespace-nowrap hover:bg-blue-100 dark:text-neutral-400 dark:hover:bg-neutral-700"
                          >
                            {component}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </th>

            <th className="py-2 border border-black">Model</th>
            <th className="py-2 border border-black">Healthscore</th>
            <th className="py-2 border border-black">Actual value</th>
            <th className="py-2 border border-black">Units</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => {
            const globalIndex = (currentPage - 1) * pageSize + index;
            const isSelected = selectedRowGlobalIndex === globalIndex;
            return (
              <tr
                key={globalIndex}
                className={`cursor-pointer hover:bg-blue-500 ${
                  isSelected
                    ? "bg-purple-700 text-white"
                    : row.Caution === 1
                    ? "bg-caution-1-gradient text-white hover:bg-caution-blue-gradient"
                    : row.Caution === 0.5
                    ? "bg-caution-0.5-gradient text-black hover:bg-caution-blue-gradient"
                    : "bg-white text-black"
                }`}
                onClick={() => setSelectedRowGlobalIndex(globalIndex)}
              >
                {/* time row detail */}
                <td className="py-2 border">{row.TIME}</td>
                
                 {/* plant row detail */}
                <td className="py-2 border flex items-center">
                  <UserCircleIcon
                    className="w-6 h-5 mr-2 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      const plant = row.PLANT;
                      const tooltip = roleMap[plant];
                      const htmlContent = (
                        <div className="mt-4">
                          <p className="flex items-center gap-2 ">
                            <UserIcon className="w-5 h-5 inline-block " />
                            <strong>Machine Diagnostic Engineer</strong> :
                          </p>
                          <p
                            className="inline-flex items-center rounded-md bg-blue-800 
                          px-4 py-1 text-xs font-medium text-white ring-1 ring-gray-500/10 
                          ring-inset my-2 mx-8"
                          >
                            {" "}
                            {tooltip.engineer}
                          </p>
                          <br />
                          <p className="flex items-center gap-2 mt-2">
                            <UserIcon className="w-5 h-5 inline-block" />
                            <strong>Machine Monitoring Officer</strong> :
                          </p>
                          <p className="inline-flex items-center rounded-md bg-blue-600 px-4 py-1 text-xs font-medium text-white ring-1 ring-gray-500/10 ring-inset my-2 mx-8">
                            {tooltip.officer}
                          </p>
                        </div>
                      );
                      const htmlString =
                        ReactDOMServer.renderToStaticMarkup(htmlContent);

                      Swal.fire({
                        position: "top-end",
                        icon: undefined,
                        title: iconHtml + "Coordinator",
                        html: htmlString,
                        toast: true,
                        showCloseButton: true,
                        showConfirmButton: false,
                        background:
                          "linear-gradient(to top, oklch(13% 0.028 261.692), oklch(20.8% 0.042 265.755),oklch(27.9% 0.041 260.031),oklch(37.2% 0.044 257.287)",
                        color: "#ffffff",
                        // timer: null,
                        timer: 3000,
                        customClass: {
                          popup: "shadow-md text-sm text-start",
                          closeButton:
                            "absolute top-2 right-2 text-white text-lg",
                        },
                        showClass: {
                          popup:
                            "animate__animated animate__fadeInRight animate__faster",
                        },
                        hideClass: {
                          popup:
                            "animate__animated animate__fadeOutRight animate__faster",
                        },
                        willClose: () => {
                          document.body.style.overflow = "";
                        },
                      });
                    }}
                  />
                  {row.PLANT || "-"}
                </td>

                <td className="py-2 border">{row.MACHINE}</td>
                <td className="py-2 border">{row.COMPONENT}</td>

                <td className=" border text-center whitespace-normal">
                  <span className="flex items-center space-x-2 w-auto">
                    <span className="text-sm truncate ">{row.MODEL}</span>

                    {typeof row.Note === "string" &&
                      row.Note.trim() !== "" &&
                      row.Note.trim().toLowerCase() !== "null" &&
                      row.Note.trim().toLowerCase() !== "undefined" && (
                        <Badge color="secondary" badgeContent={0}>
                          <MailIcon
                            className="w-4 h-4 cursor-pointer text-rose-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              const acknowledge = row.Acknowledge || "N/A";
                              const noteText = row.Note || "No note";
                              const htmlContent = (
                                <div className="mt-2 w-max">
                                  <p className="flex items-center gap-2 break-words whitespace-pre-wrap ">
                                    <CalendarIcon className="w-6 h-6 inline-block" />
                                    <strong>
                                      Acknowledge Time :
                                      <span
                                        className="inline-flex items-center rounded-md 
                                     bg-blue-700 px-2 py-1 text-xs font-medium text-white ring-1
                                      ring-gray-500/10 ring-inset my-2 mx-2"
                                      >
                                        {acknowledge}
                                      </span>
                                    </strong>
                                  </p>

                                  <p className="flex items-center gap-2 break-words whitespace-pre-wrap my-1">
                                    <ChatBubbleLeftEllipsisIcon className="w-6 h-6 inline-block" />
                                    <strong> Note: </strong>
                                    <span
                                      className="inline-flex items-center rounded-md
                                     bg-green-600 px-2 py-1 text-xs font-medium text-white 
                                     ring-1 ring-gray-500/10 ring-inset ml-1"
                                    >
                                      {noteText}
                                    </span>
                                  </p>
                                </div>
                              );
                              const htmlString =
                                ReactDOMServer.renderToStaticMarkup(
                                  htmlContent
                                );

                              Swal.fire({
                                position: "top-end",
                                icon: undefined,
                                title: "Time & Acknowledge",
                                html: htmlString,
                                toast: true,
                                showCloseButton: true,
                                showConfirmButton: false,
                                background:
                                  "linear-gradient(to top, oklch(13% 0.028 261.692), oklch(20.8% 0.042 265.755),oklch(27.9% 0.041 260.031),oklch(37.2% 0.044 257.287))",
                                color: "#ffffff",
                                // timer: null,
                                timer: 3000,
                                customClass: {
                                  popup:
                                    "relative shadow-md text-sm text-start",
                                  closeButton:
                                    "absolute top-2 right-2 text-white text-lg",
                                },
                                showClass: {
                                  popup:
                                    "animate__animated animate__fadeInRight animate__faster",
                                },
                                hideClass: {
                                  popup:
                                    "animate__animated animate__fadeOutRight animate__faster",
                                },
                                willClose: () => {
                                  document.body.style.overflow = "";
                                },
                              });
                            }}
                          />
                        </Badge>
                      )}
                  </span>
                </td>
                
                <td className="py-2 border">{row.HEALTHSCORE}</td>
                <td className="py-2 border">{row.Actual_Value}</td>
                <td className="py-2 border">{row.UNITS}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {showModal && selectedRowGlobalIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`bg-white text-black p-6 rounded-lg shadow-lg w-[90%] max-w-md
          animate__animated animate__fadeInUp animate__faster  ${
            isClosing ? "animate__fadeOut" : "animate__fadeInUp"
          }
            animate__faster`}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Action Row</h3>
            <div className="mb-4">
              <label className="block font-medium mb-1 text-start">
                Select Action:
              </label>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="action-acknowledge"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="action-acknowledge"
                    type="radio"
                    name="action"
                    value="0"
                    checked={action === "0"}
                    onChange={(e) => setAction(e.target.value)}
                    className="cursor-pointer"
                  />
                  Acknowledge
                </label>
                <label
                  htmlFor="action-followup"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="action-followup"
                    type="radio"
                    name="action"
                    value="0.5"
                    checked={action === "0.5"}
                    onChange={(e) => setAction(e.target.value)}
                    className="cursor-pointer"
                  />
                  Follow-up
                </label>
                <label
                  htmlFor="action-custom"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    id="action-custom"
                    type="radio"
                    name="action"
                    value="custom"
                    checked={action === "custom"}
                    onChange={(e) => setAction(e.target.value)}
                    className="cursor-pointer"
                  />
                  Custom
                </label>
              </div>
            </div>

            {action === "custom" && (
              <div className="mb-4">
                <label className="block font-medium mb-1 text-start">
                  Enter Custom Caution Value:
                </label>
                <textarea
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-black"
                  value={customCaution}
                  onChange={(e) => setCustomCaution(e.target.value)}
                  rows={3}
                />
              </div>
            )}

            <div className="mb-4">
              <label className="block font-medium mb-1 text-start">Note:</label>
              <textarea
                className="w-full border border-gray-300 bg-white rounded px-3 py-2 text-black"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModalWithFade}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 "
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-fit mt-5 flex items-center justify-center mx-auto">
        <Stack spacing={2}>
          <Pagination
            count={Math.ceil(filteredData.length / pageSize)}
            page={currentPage}
            onChange={(e, page) => onPageChange(e, page)}
            color="primary"
            
          />
        </Stack>
      </div>
    </div>
  );
}

export default Table;
