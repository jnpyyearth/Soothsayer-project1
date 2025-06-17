import { useEffect, useState, useRef, useMemo } from "react";
import {UserGroupIcon,CalendarDaysIcon,ChatBubbleBottomCenterTextIcon,EnvelopeOpenIcon,EnvelopeIcon,
        WrenchScrewdriverIcon,ComputerDesktopIcon,CogIcon,BuildingOffice2Icon,ClockIcon} from "@heroicons/react/24/solid";
import Swal from "sweetalert2";
import Header from "../header/header";
import Badge from "@mui/material/Badge";
import Pagination from "@mui/material/Pagination";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import Stack from "@mui/material/Stack";
import ReactDOMServer from "react-dom/server";

import {FormControl,RadioGroup,FormControlLabel,Radio, ToggleButton, ToggleButtonGroup} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import "./table.css";

//usemultipleOutsideclick ควบคุมการกดนอก area ให้ปิดdropdown หรือ modal
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
  const [selectedRowGlobalIndex, setSelectedRowGlobalIndex] = useState(null); //เก็บค่าการเลือกแถว
  const [showModal, setShowModal] = useState(false);
  const [note, setNote] = useState(""); //เก็บค่าnote
  const [action, setAction] = useState("0");
  const [customCaution, setCustomCaution] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const pageSize = 25; //กำหนดให้แสดง 25 แถว
  const [selectedRowKey, setSelectedRowKey] = useState(null);

  //การเคลื่อนที่ปิด modal ใน 3 วิ
  const closeModalWithFade = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowModal(false);
      setIsClosing(false);
    }, 300);
  };
  
  //reloadpage
  const reloadPage = () => {
    setAction(""); // reset action input
    setCustomCaution(""); // reset custom caution
    setNote(""); // reset note field
    setSelectedRowGlobalIndex(null); // reset row selection
  };

  //array data engineer & officer
  const roleMap = {
    GSP1: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    ESP: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP2: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP3: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP4: { engineer: "Apichai Mekha", officer: "Paramee Srisavake" },
    GSP5: {engineer: "Piyarach Somwatcharajit",officer: "Issarapong Tumhonyam",},
    GSP6: {engineer: "Piyarach Somwatcharajit",officer: "Issarapong Tumhonyam",},
    GPPP: { engineer: "Apichai Mekha", officer: "Issarapong Tumhonyam" },
  };

  //dropdown open/close value state
  //dropdown time & date select
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Select All Time");

  //dropdown plant select
  const dropdownRef = useRef(null);
  const [plantDropdownOpen, setPlantDropdownOpen] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState("All Plants");
  const plantDropdownRef = useRef(null);

  // dropdown machine select
  const [machineOpen, setmachineopen] = useState(false);
  const [selectedmachine, setSelectedmachine] = useState(" All Machine");
  const machineRef = useRef(null);

  // dropdown components select
  const [componentsOpen, setComponentopen] = useState(false);
  const [selectedcomponents, setSelectedcomponents] = useState("Select All Components");
  const componentsRef = useRef(null);

  // option ใน select dropdown plant/machine/components ใช้ในการ filter ค่ารายการที่เลือก
  const [plantOptions, setPlantoptions] = useState([]);
  const [machineOption, setMachineoptions] = useState([]);
  const [componentsOption, setComponentsoptions] = useState([]);


  // updateOptions และ Selected ค่าที่เลือก ✅
function updateOptionsAndSelected(options, selected, setOptions) {
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelected = typeof selected === "string" ? selected : "";

  const isAllOption = ["All Plants", "Select All Machine", "All Components"].includes(safeSelected);

  const finalOptions = isAllOption
    ? safeOptions
    : safeOptions.includes(safeSelected)
      ? safeOptions
      : [...safeOptions, safeSelected];

  setOptions(finalOptions);
}

  //set start page show all option ✅
  useEffect(() => {
    if (data.length > 0) {
      const allPlants = [...new Set(data.map((row) => row.PLANT))].filter( Boolean);
      const allMachines = [...new Set(data.map((row) => row.MACHINE))].filter(Boolean);
      const allComponents = [...new Set(data.map((row) => row.COMPONENT)),].filter(Boolean);
      setPlantoptions(allPlants);
      setMachineoptions(allMachines);
      setComponentsoptions(allComponents);
      // เซ็ตค่าเริ่มต้นด้วย ไม่งั้น useState ยังไม่มีค่าตอน filter
      setSelectedPlant("All Plants");
      setSelectedmachine("Select All Machine");
      setSelectedcomponents("All Components");
    }
  }, [data]);


  // ฟิลเตอร์เมื่อเลือก COMPONENT dropdown ✅
useEffect(() => {
  if (selectedmachine === "Select All Machine") return;

  const filteredData = data.filter(
    (row) =>
      row.MACHINE === selectedmachine &&
      (selectedPlant === "All Plants" || row.PLANT === selectedPlant)
  );

  const components = [...new Set(filteredData.map(row => row.COMPONENT))].filter(Boolean);

  // รีค่า selectedcomponents ถ้าอันเก่าไม่อยู่ใน options ใหม่
  if (!components.includes(selectedcomponents)) {
    setSelectedcomponents("All Components");
  }

  updateOptionsAndSelected(components, selectedcomponents, setComponentsoptions);
}, [selectedmachine, selectedPlant, data, selectedcomponents]);



  // ฟิลเตอร์เมื่อเลือก PLANT dropdown ✅
useEffect(() => {
  const filteredData = data.filter(
    (row) => selectedPlant === "All Plants" || row.PLANT === selectedPlant
  );

  const filteredMachines = [...new Set(filteredData.map((row) => row.MACHINE))].filter(Boolean);
  const filteredComponents = [...new Set(filteredData.map((row) => row.COMPONENT))].filter(Boolean);

  updateOptionsAndSelected(filteredMachines, selectedmachine, setMachineoptions);
  updateOptionsAndSelected(filteredComponents, selectedcomponents, setComponentsoptions);

  const allPlants = [...new Set(data.map((row) => row.PLANT))].filter(Boolean);
  updateOptionsAndSelected(allPlants, selectedPlant, setPlantoptions);
}, [selectedPlant, data, selectedmachine, selectedcomponents]);



  // ฟิลเตอร์เมื่อเลือก MACHINE dropdown ✅
 useEffect(() => {
  if (selectedmachine === "Select All Machine") return;

  const filteredData = data.filter((row) =>
    row.MACHINE === selectedmachine
  );

  const components = [...new Set(filteredData.map(row => row.COMPONENT))].filter(Boolean);
  updateOptionsAndSelected(components, selectedcomponents, setComponentsoptions);

  const allPlants = [...new Set(data.map((row) => row.PLANT))].filter(Boolean);
  updateOptionsAndSelected(allPlants, selectedPlant, setPlantoptions);
}, [selectedmachine, data, selectedcomponents, selectedPlant]);


  
  //fetch api
  const fetchData = () => {
    fetch("/get_data")
      .then((res) => res.json())
      .then((json) => {
        console.log("Fetched data: ", json); // ตรวจสอบข้อมูลที่ได้จาก API
        setData(json); // อัปเดต state 'data' กับข้อมูลใหม่
      })
      .catch((err) => console.error("Error fetching data:", err)); // ตรวจสอบ error ในการดึงข้อมูล
  };

  useEffect(() => {
    fetchData();
  }, []);

  //รีเฟรชหน้าอัตโนมัติทุกครั้งที่นาฬิกาเดินถึง “นาทีที่ 31 วินาทีที่ 0”
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getMinutes() === 31 && now.getSeconds() === 0) {
        window.location.reload();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);


  // ตั้งค่า dropdown โดยใช้ Hook "useMemo" ให้จดจำค่าที่รับจากตัวแปรหรือค่าของarray
  //ในกรณีนี้จะเก็บค่าของ plant machine และ components ที่มีข้อมูลที่เชื่อมโยงซึ่งกันและกัน
  // หากเลือก plant มา ข้อมูลของmachine จะนำค่าข้อมูลที่มีอยู่ในplant นั้นมาแสดงทั้งหมดใน dropdownlist และสำหรับcomponent ก็ใช้หลักการเดียวกัน
  const dropdowns = useMemo(
    () => ({
      timeDropdown: { ref: dropdownRef, isOpen: open, setOpen },
      plantDropdown: {
        ref: plantDropdownRef,
        isOpen: plantDropdownOpen,
        setOpen: setPlantDropdownOpen,
      },
      machineDropdown: {
        ref: machineRef,
        isOpen: machineOpen,
        setOpen: setmachineopen,
      },
      componentsDropdown: {
        ref: componentsRef,
        isOpen: componentsOpen,
        setOpen: setComponentopen,
      },
    }),
    [open, plantDropdownOpen, machineOpen, componentsOpen]
  );

  useMultipleOutsideClick(dropdowns); //ฟังก์ชั่นเมื่อคลิกนอกบริเวณให้ปิดพวกmodal dropdownlist โดยอัตโนมัติ

  //ช่วงเวลาของ dropdown 4 ช่วง ช่วงละ 6 ชั่วโมง
  const timeRanges = [
    "00:00 - 05:59",
    "06:00 - 11:59",
    "12:00 - 17:59",
    "18:00 - 23:59",
  ];

  //setting  การคลิกเลือกเปิดdropdown
  const handleSelectTime = (timeRange) => {
    setSelectedTime(timeRange);
    setOpen(false);
    setSelectedRowGlobalIndex(null);
    setCurrentPage(1);
  };


  //handleselect plant✅
const handleSelectPlant = (plant) => {
  setSelectedPlant(plant);
  setPlantDropdownOpen(false);
  setSelectedRowGlobalIndex(null);
  setCurrentPage(1);

  if (plant === "All Plants") {
    // รีเซ็ต machine และ component เมื่อเลือก All Plants
    setSelectedmachine("Select All Machine");
    setSelectedcomponents("All Components");

    const allMachines = [...new Set(data.map(row => row.MACHINE))].filter(Boolean);
    const allComponents = [...new Set(data.map(row => row.COMPONENT))].filter(Boolean);
    setMachineoptions(allMachines);
    setComponentsoptions(allComponents);
  } else {
    //  กรอง machine และ component ที่อยู่ภายใน plant นั้น
    const filteredByPlant = data.filter(row => row.PLANT === plant);

    // ถ้ามี machine/component ที่เลือกไว้ แต่ไม่อยู่ใน plant ใหม่ → รีเซ็ต
    const validMachines = [...new Set(filteredByPlant.map(row => row.MACHINE))].filter(Boolean);
    const validComponents = [...new Set(filteredByPlant.map(row => row.COMPONENT))].filter(Boolean);

    if (!validMachines.includes(selectedmachine)) {
      setSelectedmachine("Select All Machine");
    }
    if (!validComponents.includes(selectedcomponents)) {
      setSelectedcomponents("All Components");
    }

    setMachineoptions(validMachines);
    setComponentsoptions(validComponents);
  }
};

//handleselectmachine ✅
const handleSelectmachine = (machine) => {
  setSelectedmachine(machine);
  setmachineopen(false);
  setSelectedRowGlobalIndex(null);
  setCurrentPage(1);

  // รีเซ็ต Component ทันทีเมื่อเปลี่ยน Machine
  setSelectedcomponents("All Components");

  if (machine === "Select All Machine") {
    const filteredData = data.filter(
      (row) => selectedPlant === "All Plants" || row.PLANT === selectedPlant
    );
    const allComponents = [...new Set(filteredData.map(row => row.COMPONENT))].filter(Boolean);
    setComponentsoptions(allComponents);
  } else {
    const filteredByMachine = data.filter(row => row.MACHINE === machine);

    // Auto select plant หากยังเป็น All
    if (selectedPlant === "All Plants" && filteredByMachine.length > 0) {
      setSelectedPlant(filteredByMachine[0].PLANT);
    }

    const filteredComponents = filteredByMachine
      .filter(row => selectedPlant === "All Plants" || row.PLANT === selectedPlant)
      .map(row => row.COMPONENT);

    const uniqueComponents = [...new Set(filteredComponents)].filter(Boolean);
    setComponentsoptions(uniqueComponents);
  }
};



//handle select component ✅
const handleSelectcomponent = (component) => {
  setSelectedcomponents(component);
  setComponentopen(false);
  setSelectedRowGlobalIndex(null);
  setCurrentPage(1);

  if (component === "All Components") {
    const filteredData = data.filter(
      (row) => selectedPlant === "All Plants" || row.PLANT === selectedPlant
    );
    const allMachines = [...new Set(filteredData.map(row => row.MACHINE))].filter(Boolean);
    setMachineoptions(allMachines);
  } else {
    const filteredByComponent = data.filter(row => row.COMPONENT === component);

    // ถ้า Plant ยังเป็น All ให้เซ็ต Plant ตาม Component แรกที่เจอ
    if (selectedPlant === "All Plants" && filteredByComponent.length > 0) {
      const newPlant = filteredByComponent[0].PLANT;
      setSelectedPlant(newPlant);
    }

    // กรอง Machines ตาม component ที่เลือกและ plant ที่เลือกอยู่
    const filteredMachines = filteredByComponent
      .filter(row => selectedPlant === "All Plants" || row.PLANT === selectedPlant)
      .map(row => row.MACHINE);

    const uniqueMachines = [...new Set(filteredMachines)].filter(Boolean);
    setMachineoptions(uniqueMachines);
  }
};


  //setting การเสิร์ช
  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  // กรองข้อมูลตามไฟล์ มาไว้ในแต่ละคอลัมน์ แต่ละแถวในตาราง
  const filteredData = data
    .filter((row) => {
      const matchTime = isTimeInRange(row.TIME, selectedTime);
      let rowDateOnly = "";

      if (row.TIME) {
        // ใช้ new Date() แปลง 'row.TIME' ที่มีรูปแบบ 'YYYY-MM-DD HH:mm:ss' ให้เป็น Date object
        const date = new Date(row.TIME); // แปลงจาก '2025-05-10 22:00:00' เป็น Date object

        // ตรวจสอบว่า 'row.TIME' ถูกแปลงเป็น Date ได้ถูกต้องหรือไม่
        if (!isNaN(date.getTime())) {
          // แปลงเป็น 'YYYY-MM-DD' โดยไม่สนใจเวลา
          rowDateOnly = date.toISOString().split("T")[0]; // จะได้ '2025-05-10'
        } else {
          console.error(`Invalid date format: ${row.TIME}`);
        }
      }

      const matchDate = selectedDate === "" || rowDateOnly === selectedDate;

      const matchPlant =
        selectedPlant === "All Plants" || row.PLANT === selectedPlant;

      const matchMachine =
        selectedmachine === "Select All Machine" ||
        row.MACHINE === selectedmachine;

      const matchComponent =
        selectedcomponents === "All Components" ||
        row.COMPONENT === selectedcomponents;

      const lowerSearch = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        row.MODEL.toLowerCase().includes(lowerSearch) ||
        row.COMPONENT.toLowerCase().includes(lowerSearch) ||
        row.UNITS.toLowerCase().includes(lowerSearch);

      return (
        matchDate &&
        matchTime &&
        matchPlant &&
        matchComponent &&
        matchMachine &&
        matchSearch
      );
    })
    .sort((a, b) => {
      // ฟังก์ชั่นการเรียงข้อมูลตามวันและเวลา (ล่าสุดก่อน)
      const dateA = new Date(a.TIME);
      const dateB = new Date(b.TIME);

      if (dateB.getTime() !== dateA.getTime()) {
        return dateB - dateA; // เรียงจากวันที่ล่าสุดก่อน
      }

      const timeA =
        new Date(a.TIME).getHours() * 60 + new Date(a.TIME).getMinutes();
      const timeB =
        new Date(b.TIME).getHours() * 60 + new Date(b.TIME).getMinutes();

      return timeB - timeA; // ถ้าวันเดียวกัน เรียงจากเวลา (ชั่วโมงล่าสุดก่อน)
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  //กำหนดการคลิกlogo แล้วฟอร์ม
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
          popup: "font-kanit",
          confirmButton:
            "w-[100px] bg-blue-600 hover:bg-blue-700 text-white font-bold font-kanit py-2 px-4 rounded",
        },
        buttonsStyling: false,
        showClass: {
          popup: ` animate__animated animate__fadeInUp animate__faster `,
        },
        hideClass: {
          popup: `animate__animated animate__fadeOutDown animate__faster `,
        },
      });
    }
  };

  //save ข้อมูล caution model ใหม่ และ Post ไปที่ API
  const handleSave = () => {
    let newCaution =
      action === "custom" ? parseFloat(customCaution) : parseFloat(action);

    if (isNaN(newCaution)) {
      Swal.fire(
        "Invalid Input",
        "Please enter a valid custom value.",
        "warning"
      );
      return;
    }

    const selectedRow = data.find((r) => getRowKey(r) === selectedRowKey);
    if (!selectedRow) {
      Swal.fire("Error", "Cannot find selected row.", "error");
      return;
    }

    const originalNote = selectedRow.Note?.trim() || "";
    const currentNote = note?.trim() || "";

    if (selectedRow.Caution === newCaution && currentNote === originalNote) {
      Swal.fire({
        icon: "info",
        title: "No Changes",
        text: "ไม่มีการเปลี่ยนแปลง กรุณาแก้ไขข้อมูลก่อนบันทึก",
        confirmButtonText: "OK",
        customClass: {
          confirmButton:
            "bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-5 py-2 rounded",
          popup: "font-kanit",
        },
      });
      return;
    }

    fetch("http://localhost:5000/update_row", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        time: selectedRow.TIME,
        model: selectedRow.MODEL,
        machine: selectedRow.MACHINE,
        component: selectedRow.COMPONENT,
        newCaution: String(newCaution),
        note: note || data[selectedRowGlobalIndex]?.Note || "",
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setData((prevData) => {
            const newData = [...prevData];
            const rowIndex = newData.findIndex(
              (r) => getRowKey(r) === selectedRowKey
            );
            if (rowIndex !== -1) {
              newData[rowIndex] = {
                ...newData[rowIndex],
                Caution: newCaution,
                Note: note,
                Acknowledge: result.acknowledge_time,
              };
            }
            return newData;
          });

          Swal.fire({
            title: "Saved",
            text: `Updated at: ${result.acknowledge_time}`,
            icon: "success",
            confirmButtonText: "Save",
            buttonsStyling: false,
            customClass: {
              confirmButton:
                "bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded",
              popup: "font-kanit",
            },
          }).then(() => {
            setShowModal(false);
            setSelectedRowGlobalIndex(null);
          });
        } else {
          Swal.fire("Error", result.message, "error");
        }
      })
      .catch((err) => {
        console.error("Error details: ", err);
        Swal.fire("Error", err.message || "Unknown error occurred", "error");
      });

    setAction("");
    setCustomCaution("");
    setNote("");

    // ปิด modal
    closeModalWithFade();
  };

  //คีย์เฉพาะของแถว เช่น TIME + PLANT + MACHINE + COMPONENT
  const getRowKey = (row) =>
    `${row.TIME}||${row.PLANT}||${row.MACHINE}||${row.COMPONENT}`;

  //สร้าง html icon ที่จะเรียกใช้แสดงใน swal.fire
  const iconHtml = ReactDOMServer.renderToStaticMarkup(
    <UserGroupIcon className="inline-block w-5 h-5 mr-2 text-white" />
  );
  const iconnoteHtml = ReactDOMServer.renderToStaticMarkup(
    <EnvelopeOpenIcon className="inline-block w-5 h-5 mr-2 text-white" />
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

  //setting การchange ของ page
  const onPageChange = (e, page) => {
    setCurrentPage(page);
  };

  //กดปุ่ม next (->) และ previous (<-) ของ pagination บนคีย์บอร์ดได้
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else if (
        e.key === "ArrowRight" &&
        currentPage < Math.ceil(filteredData.length / pageSize)
      ) {
        setCurrentPage((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, filteredData.length]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden m-0 p-0">
      <div
        className="p-10 flex flex-col font-kanit w-screen "
        style={{ tableLayout: "fixed" }}
      >
        <div
          className="md:w-auto flex-none  py-1 text-center md:flex-row 
      md:space-y-0 z-100 align-top"
        >
          <Header
            onLogoClick={handleLogoClick}
            onReload={reloadPage}
            data={data}
            searchTerm={searchTerm}
            setSearchTerm={handleSearchTermChange}
            setSelectedPlant={setSelectedPlant}
            setSelectedmachine={setSelectedmachine}
            setSelectedcomponents={setSelectedcomponents}
            className="relative"
            setSelectedRowGlobalIndex={setSelectedRowGlobalIndex}
          />
        </div>

        <div className="flex-none px-4 py-1">
          <table
            className="w-full table-auto text-[10px] leading-tight sm:text-sm md:text-base overflow-visible md:overflow-x-visible 
       overflow-x-auto font-kanit "
          >
            <thead className="bg-head-column text-lg text-white ">
              <tr className="h-[20px]">
                <th className="min-w-[10rem] p-1 border border-cyan-950 md:text-sm lg:text-base">
                  {/* Time dropdown */}
                  <div className="inline-flex space-x-2 items-center">
                    {/* ปุ่มเลือกช่วงเวลา (dropdown) */}
                    <div
                      className="relative inline-flex max-w-[180px] "
                      ref={dropdownRef}
                    >
                      <button
                        type="button"
                        className="hs-dropdown-toggle w-max px-3 py-2
                     inline-flex items-center gap-x-2 text-lg 
                       rounded-lg border-2 border-sky-300
                      bg-cyan-950 text-white shadow-2xs focus:outline-hidden"
                        aria-haspopup="menu"
                        aria-expanded={open ? "true" : "false"}
                        aria-label="Dropdown"
                        onClick={() => setOpen(!open)}
                      > 
                        <ClockIcon className="h-"/>
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
                          className="hs-dropdown-menu transition-[opacity,margin] duration 
                      absolute right-0 z-10 mt-2
                      rounded-md bg-white shadow-md dark:bg-indigo-950
                      dark:border dark:border-neutral-700 max-h-60 overflow-auto min-w-[180px]
                      "
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="hs-dropdown-hover-event"
                        >
                          <div className="p-3">
                            <button
                              onClick={() => {
                                handleSelectTime("Select All Time");
                                setOpen(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-base
                           text-teal-400 whitespace-nowrap 
                             dark:hover:bg-neutral-600"
                            >
                              Select All Time
                            </button>

                            {timeRanges.map((rangeLabel) => (
                              <button
                                key={rangeLabel}
                                onClick={() => {
                                  handleSelectTime(rangeLabel);
                                  setOpen(false);
                                }}
                                className="block w-full text-left px-4 py-2 
                            text-base font-semibold whitespace-nowrap
                             hover:bg-blue-100 dark:text-blue-200 dark:hover:bg-neutral-700"
                              >
                                {rangeLabel}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="font-kanit text-base"> | </div>

                    {/* ปุ่มเลือกวันที่ */}
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        setCurrentPage(1);
                        setSelectedRowGlobalIndex(null);
                      }}
                      className="px-3 py-2 rounded-lg border-2 border-sky-300 bg-cyan-950 text-white
                  shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 cursor-pointer text-lg"
                      aria-label="Select Date"
                    />
                  </div>
                </th>

                {/* Plant dropdown */}
                <th className="min-w-[10rem] p-1 border border-cyan-950 text-xs md:text-sm lg:text-base">
                  <div className="relative inline-flex" ref={plantDropdownRef}>
                    <button
                      type="button"
                      className="hs-dropdown-toggle py-2 px-5 inline-flex 
                  items-center text-lg font-medium w-[200] rounded-lg gap-x-2 
                  border border-sky-500 bg-cyan-950 text-white  shadow-white 
                  focus:outline-hidden "
                      aria-haspopup="menu"
                      aria-expanded={plantDropdownOpen ? "true" : "false"}
                      aria-label="Dropdown"
                      onClick={() => setPlantDropdownOpen(!plantDropdownOpen)}
                    >
                      <BuildingOffice2Icon className="h-7 w-7 text-lime-300" />
                      {selectedPlant}

                      <svg
                        className={`size-4 transition-transform ml-1 ${
                          plantDropdownOpen ? "rotate-180" : ""
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

                    {plantDropdownOpen && (
                      <div
                        className="hs-dropdown-menu transition-[opacity,margin] duration absolute 
                   left-1/2 -translate-x-[43%]
                    z-10 mt-12 min-w-[300px] origin-top-right rounded-md shadow-md
                     dark:bg-indigo-950
                    max-h-60 overflow-auto"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="hs-dropdown-hover-event"
                      >
                        <div className="p-1 grid grid-cols-2 gap-2 max-h-60 overflow-auto">
                          <button
                            key="all-plants"
                            onClick={() => handleSelectPlant("All Plants")}
                            className="block w-full text-center px-2 py-2 text-base
                          whitespace-nowrap hover:bg-blue-100
                          text-teal-400 dark:hover:bg-neutral-700"
                          >
                            All Plants
                          </button>
                          {plantOptions.map((plant) => (
                            <button
                              key={plant}
                              onClick={() => handleSelectPlant(plant)}
                              className="block w-full px-2 py-2 
                          text-base  whitespace-nowrap text-blue-200
                           dark:hover:bg-neutral-700 text-center"
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
                <th className="min-w-[10rem] p-1 border border-cyan-950 text-xs md:text-sm lg:text-base">
                  <div className="relative inline-flex" ref={machineRef}>
                    <button
                      type="button"
                      className="hs-dropdown-toggle py-2 px-3 inline-flex 
                  items-center gap-x-2 text-lg font-medium rounded-lg border-2 border-sky-300 bg-cyan-950 text-white shadow-2xs focus:outline-hidden "
                      aria-haspopup="menu"
                      aria-expanded={machineOpen ? "true" : "false"}
                      aria-label="Dropdown"
                      onClick={() => setmachineopen(!machineOpen)}
                    >
                      <PrecisionManufacturingIcon
                        sx={{ fontSize: 28, color: "#bef264" }}
                      />
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
                        className="hs-dropdown-menu transition-[opacity,margin] duration absolute 
                    left-1/2 -translate-x-[20%] z-10 mt-12 min-w-fit origin-top-right rounded-md bg-white shadow-md
                     dark:bg-indigo-950 dark:border dark:border-neutral-700 max-h-65 overflow-visible"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="hs-dropdown-hover-event"
                      >
                        <div className="p-1 space-y-1">
                          <div className="min-w-max">
                            <div
                              className="grid gap-1 p-1 max-h-80 overflow-auto"
                              style={{
                                gridTemplateColumns: `repeat(${
                                  machineOption.length <= 5 ? 1 : 5
                                }, 1fr)`, // ถ้ามี 4 หรือ น้อยกว่านั้น ให้แสดง 1 คอลัมน์
                                // ถ้ามีมากกว่า 4 ตัว ให้แสดง 2 คอลัมน์
                              }}
                            >
                              <button
                                key="all-machines"
                                onClick={() =>
                                  handleSelectmachine("Select All Machine")
                                }
                                className="block w-full text-left px-4 py-2
                        text-base text-teal-400 whitespace-nowrap hover:bg-blue-100  dark:hover:bg-neutral-700"
                              >
                                Select All Machine
                              </button>

                              {machineOption.map((machine) => (
                                <button
                                  key={machine}
                                  onClick={() => handleSelectmachine(machine)}
                                  className="block w-full text-left px-4 py-2 text-base text-blue-200 whitespace-nowrap
                           hover:bg-blue-100  dark:hover:bg-neutral-700"
                                >
                                  {machine}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </th>

                {/* Components dropdown */}
                <th className="min-w-[10rem] p-1 border border-cyan-950 text-xs md:text-sm lg:text-base">
                  <div className="relative inline-flex" ref={componentsRef}>
                    <button
                      type="button"
                      className="hs-dropdown-toggle py-2 px-3 inline-flex items-center gap-x-2 text-lg
                  font-medium rounded-lg border border-sky-500 bg-cyan-950 text-white  shadow-2xs  focus:outline-hidden"
                      aria-haspopup="menu"
                      aria-expanded={componentsOpen ? "true" : "false"}
                      aria-label="Dropdown"
                      onClick={() => setComponentopen(!componentsOpen)}
                    >
                      <CogIcon className="h-8 w-8  text-lime-300 " />
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
                        className="hs-dropdown-menu transition-[opacity,margin] duration absolute z-10 
                    mt-2 min-w-fit origin-top-center h-auto
             rounded-md bg-white shadow-md dark:bg-indigo-950 dark:border dark:border-neutral-700 max-h-auto overflow-visible"
                        role="menu"
                        aria-orientation="vertical"
                        aria-labelledby="hs-dropdown-hover-event"
                        style={{ left: "50%", transform: "translateX(-50%)" }}
                      >
                        <div className="p-1 space-y-1 overflow-x-auto ">
                          <div className="min-w-max">
                            <div
                              className="grid gap-1 p-1 max-h-80 overflow-auto"
                              style={{
                                gridTemplateColumns: `repeat(${
                                  (componentsOption.length <= 5 ? 1 : 4,
                                  componentsOption.length <= 5 ? 1 : 4)
                                }, 1fr)`, // ถ้ามี 4 หรือ น้อยกว่านั้น ให้แสดง 1 คอลัมน์,
                                // ถ้ามากกว่า4 ให้แสดง 2 คอลัมน์
                                //ใช้การประกาศเงื่อนไขแบบ ternary operator
                              }}
                            >
                              <button
                                key="all-components"
                                onClick={() =>
                                  handleSelectcomponent("All Components")
                                }
                                className="block w-full text-left px-4 py-2 text-base
                            whitespace-nowrap hover:bg-blue-100
                     text-teal-400 dark:hover:bg-neutral-700 "
                              >
                                All Components
                              </button>

                              {componentsOption.map((component) => (
                                <button
                                  key={component}
                                  onClick={() =>
                                    handleSelectcomponent(component)
                                  }
                                  className="block w-full text-left px-4 py-2 text-base text-blue-200 whitespace-nowrap hover:bg-blue-100  dark:hover:bg-neutral-700"
                                >
                                  {component}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </th>

                <th className="min-w-[10rem] p-1 border border-cyan-950 text-xs md:text-sm lg:text-base">
                  Model
                </th>
                <th className="min-w-[10rem] p-1 border border-cyan-950 text-xs md:text-sm lg:text-base">
                  Healthscore
                </th>
                <th className="min-w-[10rem] p-1 border border-cyan-950 text-xs md:text-sm lg:text-base">
                  Actual value
                </th>
                <th className="min-w-[10rem] p-1 border border-cyan-950 text-xs md:text-sm lg:text-base">
                  Units
                </th>
              </tr>
            </thead>

            {/* data in row */}
            <tbody className=" overflow-y-hidden">
              {paginatedData.map((row, index) => {
                const globalIndex = (currentPage - 1) * pageSize + index;
                const isSelected = selectedRowGlobalIndex === globalIndex;
                return (
                  <tr
                    key={globalIndex}
                    className={`cursor-pointer  sm:text-base md:text-lg h-[28px] ${
                      isSelected
                        ? "bg-emerald-600 text-white "
                        : row.Caution === 1
                        ? "bg-caution-1 text-white hover:bg-caution-blue-gradient text-lg font-medium font-kanit"
                        : row.Caution === 0.5
                        ? "bg-yellow-500 text-black hover:bg-caution-blue-gradient text-lg font-medium "
                        : "bg-caution-0 : text-black hover:bg-caution-blue-gradient font-light text-base"
                    }`}
                    onClick={() => setSelectedRowGlobalIndex(globalIndex)}
                    // เลือกแถว + เปิด modal edit ทันที
                    onDoubleClick={() => {
                      setSelectedRowGlobalIndex(globalIndex);
                      setShowModal(true);
                      setSelectedRowKey(getRowKey(row));
                    }}
                  >
                    {/* time row detail */}
                    <td className="px-0.5 py-0.5 border-2 border-cyan-950 text-lg ">
                      {row.TIME}
                    </td>
                    {/* plant row detail */}
                    <td className="px-0.5 py-0.5 border-2 border-cyan-950  text-lg ">
                      <div className="flex items-center space-x-2 h-full justify-center">
                        <UserGroupIcon
                          className="w-7 h-7  md:w-7 md:h-7 cursor-pointer rounded-full p-1 bg-blue-600 text-white ml-3"
                          onClick={(e) => {
                            e.stopPropagation();
                            const plant = row.PLANT;
                            const tooltip = roleMap[plant];
                            const htmlContent = (
                              <div className="mt-2 flex flex-col font-kanit">
                                <div className="flex items-center gap-2 text-lg font-kanit">
                                  <WrenchScrewdriverIcon
                                    className="w-9 h-9 bg-blue-600
                              text-white p-1 rounded-full"
                                  />
                                  <strong className="whitespace-nowrap">
                                    Machine Diagnostic Engineer :
                                  </strong>
                                  <span
                                    className="inline-flex items-center justify-center rounded-full
                                 bg-rose-700 px-4 py-1 text-base font-medium text-white
                                 ring-1 ring-gray-500/10 ring-inset
                                 max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis"
                                  >
                                    {tooltip.engineer}
                                  </span>
                                </div>
                                <br />
                                <div className="flex items-center gap-2 text-lg font-kanit">
                                  <ComputerDesktopIcon className="w-9 h-9 bg-blue-600 text-white p-1 rounded-full" />
                                  <strong className="whitespace-nowrap">
                                    Machine Monitoring Officer :
                                  </strong>
                                  <span
                                    className="inline-flex items-center justify-center rounded-full
                                bg-rose-600 px-4 py-1 text-base font-medium text-white
                              ring-1 ring-gray-500/10 ring-inset
                              max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis"
                                  >
                                    {tooltip.officer}
                                  </span>
                                </div>
                              </div>
                            );
                            const htmlString =
                              ReactDOMServer.renderToStaticMarkup(htmlContent);

                            Swal.fire({
                              position: "top-start",
                              icon: undefined,
                              html: `
                          <div class="rounded-md overflow-hidden shadow-lg w-full max-w-xl">
                      <div class="flex items-center justify-between bg-modal-gradient p-4">
                       <div class="flex items-center space-x-2">
                       <svg class="w-8 h-8 text-white inline-block bg-green-600 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24">
                  ${iconHtml}
                  </svg>
                     <span class="text-white text-2xl font-bold font-kanit">Coordinator</span>
                        </div>
                       <button id="swalCloseBtn" class="text-white text-5xl font-bold focus:outline-none">&times;</button>
                         </div>
                                 <div class="px-5 py-8 bg-pink-200 text-black ">
                                        ${htmlString}
                                  </div>
                         </div>
                          `,
                              toast: false,
                              showCloseButton: false, // ปิดปุ่ม Close ของ Swal
                              showConfirmButton: false,
                              background: "transparent",
                              color: "#ffffff",
                              timer: null,
                              customClass: {
                                popup: "shadow-none p-0 max-w-xl w-full ",
                              },
                              didOpen: () => {
                                // ผูก event ให้ปุ่ม Close ที่เราสร้างเอง
                                const closeBtn =
                                  document.getElementById("swalCloseBtn");
                                if (closeBtn) {
                                  closeBtn.addEventListener("click", () =>
                                    Swal.close()
                                  );
                                }
                              },
                              showClass: {
                                popup:
                                  "animate__animated animate__fadeInLeft animate__faster",
                              },
                              hideClass: {
                                popup:
                                  "animate__animated animate__fadeOutLeft animate__faster",
                              },
                              willClose: () => {
                                document.body.style.overflow = "";
                              },
                            });
                          }}
                        />
                        <span>{row.PLANT || "-"}</span>
                      </div>
                    </td>
                    <td className="px-0.5 py-0.5 border text-lg border-cyan-950">
                      {row.MACHINE}
                    </td>
                    <td className="px-0.5 py-0.5 border text-base border-cyan-950">
                      {row.COMPONENT}
                    </td>
                    <td className="px-0.5 py-0.5 border  text-center whitespace-normal border-cyan-950 ">
                      <span className="flex items-center space-x-2 w-auto">
                        <span className="text-base py-2 mx-2 truncate break-words">
                          {row.MODEL}
                        </span>
                        {typeof row.Note === "string" &&
                          row.Note.trim() !== "" &&
                          row.Note.trim().toLowerCase() !== "null" &&
                          row.Note.trim().toLowerCase() !== "undefined" && (
                            <Badge color="secondary" badgeContent={0}>
                              <EnvelopeIcon
                                className="w-6 h-6 cursor-pointer text-green-900 animate-fadeInSlideIn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const acknowledge = row.Acknowledge || "N/A";
                                  const noteText = row.Note || "No note";
                                  const htmlContent = (
                                    <div className="mt-2 w-max font-kanit">
                                      <p className="flex items-center gap-2 break-words whitespace-pre-wrap">
                                        <CalendarDaysIcon className="w-9 h-9 inline-block bg-blue-600 text-white p-1 rounded-full" />
                                        <strong>
                                          Acknowledge Time :
                                          <span className="inline-flex items-center  px-2 py-1 text-lg font-bold text-rose-700  my-2 mx-2">
                                            {acknowledge}
                                          </span>
                                        </strong>
                                      </p>

                                      <p className="flex items-start gap-2 break-words whitespace-pre-wrap my-2 ">
                                        <ChatBubbleBottomCenterTextIcon className="w-9 h-9 inline-block bg-blue-600 text-white p-1 rounded-full" />
                                        <strong> Note: </strong>
                                        <span
                                          className="inline-flex font-kanit text-start items-start rounded-md bg-emerald-700 px-3 py-1 text-lg font-medium text-white ring-1
                                          break-words whitespace-pre-wrap ring-gray-500/10 ring-inset ml-1 max-w-[600px] "
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
                                    position: "top-start",
                                    icon: undefined,
                                    width: "auto",
                                    html: `
                  <div class="rounded-md overflow-hidden shadow-lg w-fit max-w-[90vw]">
                    <div class="flex items-center justify-between bg-modal-gradient p-4">
                      <div class="flex items-center space-x-2">
                        <svg class="w-8 h-8 text-white inline-block bg-green-600 rounded-full p-1" fill="currentColor" viewBox="0 0 24 24">
                          ${iconnoteHtml}
                        </svg>
                        <span class="text-white text-xl font-bold font-kanit">Time & Acknowledge</span>
                      </div>
                      <button id="swalCloseBtn" class="text-white text-4xl font-bold focus:outline-none">&times;</button>
                    </div>
                  <div class="p-4 bg-violet-100 text-black w-full max-w-full break-words">
                        ${htmlString}
                    </div>
                  </div>
                `,
                                    toast: false,
                                    showCloseButton: false, // ใช้ปุ่ม close เองแทน
                                    showConfirmButton: false,
                                    background: "transparent",
                                    color: "#ffffff",
                                    timer: null,
                                    customClass: {
                                      popup: "shadow-none p-0",
                                    },
                                    didOpen: () => {
                                      const closeBtn =
                                        document.getElementById("swalCloseBtn");
                                      if (closeBtn) {
                                        closeBtn.addEventListener("click", () =>
                                          Swal.close()
                                        );
                                      }
                                    },
                                    showClass: {
                                      popup:
                                        "animate__animated animate__fadeInLeft animate__faster",
                                    },
                                    hideClass: {
                                      popup:
                                        "animate__animated animate__fadeOutLeft animate__faster",
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

                    <td className="px-0.5 py-0.5 border text-base border-cyan-950 ">
                      {row.HEALTHSCORE}
                    </td>
                    <td className="px-0.5 py-0.5 border text-base border-cyan-950">
                      {row.Actual_Value}
                    </td>
                    <td className="px-0.5 py-0.5 border text-base border-cyan-950">
                      {row.UNITS}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center h-[1px] px-2">
        <Stack spacing={1}>
          <Pagination
            count={Math.ceil(filteredData.length / pageSize)}
            page={currentPage}
            onChange={(e, page) => onPageChange(e, page)}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mt: 4,
              mb: 4 , // ระยะห่างด้านบน
              transform: "translateY(-8px)",

              "& .MuiPaginationItem-root": {
                color: "white",
                backgroundColor: "#1e40af",
                borderRadius: "50%",
                fontWeight: "bold",
                fontSize: "20px",
                minWidth: "44px",
                height: "44px",
                padding: "5px",
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                color: "#1e40af",
                backgroundColor: "white",
                border: "2px solid #1e40af",
              },
              "& .MuiPaginationItem-root:hover": {
                backgroundColor: "#2563eb",
                color: "white",
              },
              "& .MuiPagination-ul": {
                padding: 0,
                margin: 0,
                gap: "5px",
              },
            }}
          />
        </Stack>
      </div>

      {showModal && selectedRowGlobalIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div
            className={`bg-pink-200 rounded-xl shadow-xl w-[95%] max-w-2xl p-6 transition-all transform duration-300 
        animate__animated ${
          isClosing ? "animate__fadeOutDown" : "animate__fadeInUp"
        } font-kanit`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 border-b border-white pb-4 bg-modal-gradient rounded-2xl px-6 py-4">
              <h2 className="text-3xl font-bold text-white">
                Edit Caution Row
              </h2>
              <button
                onClick={closeModalWithFade}
                className="text-white hover:text-red-300 text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Radio Section */}
            <div className="mb-6 text-black text-lg">
              <div className="mb-3 text-xl text-black text-center">
                Select Tag
              </div>

              <ToggleButtonGroup
                value={action}
                exclusive
                disableRipple
                disableFocusRipple
                onChange={(e, newValue) => {
                  if (newValue !== null) {
                    setAction(newValue);
                  }
                }}
                sx={{
                  "& .MuiToggleButton-root": {
                    borderRadius: "8px !important",
                  },
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                }}
              >
                {/* Acknowledge (Red) */}
                <ToggleButton
                  className="rounded-md"
                  value="1"
                  sx={{
                    fontSize: "1.25rem",
                    fontFamily: "kanit , sans-serif",
                    px: 3,
                    py: 1.5,
                    border: "1px solid #ccc",
                    color: "#FFFF",
                    backgroundColor: "#C5172E",
                    borderRadius: "12px",

                    "&.Mui-selected": {
                      backgroundColor: "#C5172E",
                      border: "4px solid #06D001",
                      color: "white",
                      "&:hover": { backgroundColor: "#A31D1D" },
                    },
                    "&:hover": { backgroundColor: "#A31D1D" },
                    "&:focus": { outline: "none", boxShadow: "none" },
                    "&.Mui-focusVisible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  Acknowledge
                </ToggleButton>

                {/* Follow-up (Yellow) */}
                <ToggleButton
                  value="0.5"
                  sx={{
                    fontSize: "1.25rem",
                    fontFamily: "kanit , sans-serif",
                    px: 4,
                    py: 1.5,
                    border: "1px solid #ccc",
                    color: "#FFFF",
                    backgroundColor: "#f2bb05",
                    borderRadius: "12px",
                    "&.Mui-selected": {
                      backgroundColor: "#E9A319",
                      border: "4px solid #06D001",
                      color: "white",
                      "&:hover": { backgroundColor: "#FFB22C" },
                    },
                    "&:hover": { backgroundColor: "#E9A319" },
                    "&:focus": { outline: "none", boxShadow: "none" },
                    "&.Mui-focusVisible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  Follow-up
                </ToggleButton>

                {/* Normal (White) */}
                <ToggleButton
                  value="0"
                  sx={{
                    fontSize: "1.25rem",
                    fontFamily: "kanit , sans-serif",
                    px: 5,
                    py: 1.5,
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    color: "black",
                    backgroundColor: "#f8f9fa",
                    "&.Mui-selected": {
                      backgroundColor: "#f8f9fa",
                      border: "4px solid #06D001",
                      color: "black",
                      "&:hover": { backgroundColor: "#f6fff8" },
                    },
                    "&:hover": { backgroundColor: "#f6fff8" },
                    "&:focus": { outline: "none", boxShadow: "none" },
                    "&.Mui-focusVisible": {
                      outline: "none",
                      boxShadow: "none",
                    },
                  }}
                >
                  Normal
                </ToggleButton>
              </ToggleButtonGroup>
            </div>

            {/* Note Input */}
            <div className="mb-6">
              <label className="block text-xl font-semibold text-black mb-2 ml-2 text-start">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 bg-cyan-50 px-4 py-3 rounded-lg text-black text-xl focus:ring-2 focus:ring-sky-400 outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <button
                onClick={closeModalWithFade}
                className="bg-red-600 text-white text-lg px-6 py-3 mb-2 rounded-md hover:bg-red-700 w-[140px]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const selectedRow = data[selectedRowGlobalIndex];
                  const newCaution = parseFloat(action);
                  const currentCaution = selectedRow?.Caution;
                  const originalNote = selectedRow?.Note || "";
                  const noteChanged =
                    note.trim() !== "" && note.trim() !== originalNote.trim();

                  // ถ้าเลือก caution เดิม และไม่ได้เปลี่ยน note → ให้เตือน
                  if (newCaution === currentCaution && !noteChanged) {
                    Swal.fire({
                      icon: "warning",
                      confirmButtonText: "OK",
                      customClass: {
                        confirmButton:
                          "bg-yellow-500 hover:bg-yellow-600 text-white font-bold px-5 py-2 rounded",
                        popup: "font-kanit",
                      },
                      html: '<div class="text-xl">ค่า Caution ซ้ำ กรุณาเลือกค่าใหม่หรือใส่ Note</div>',
                    });
                    return;
                  }

                  handleSave();
                }}
                className="bg-green-600 text-white text-lg px-6 py-3 mb-2 mr-2 rounded-md hover:bg-green-700 w-[140px]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
