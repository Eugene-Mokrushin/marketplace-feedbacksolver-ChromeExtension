import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import person from "../assets/person.svg";
import excel from "../assets/excel.png";
import "../styles/content.css";

interface MainProps {
  toLogin: () => void;
}

function Main({ toLogin }: MainProps) {
  const [switchesValues, setSwitchesValues] = useState([
    { label: "Await confirmation", value: true, key: "conf" },
    { label: "Autofill entire page", value: false, key: "autofill" },
    { label: "Paginate", value: false, key: "paginte" },
    { label: "Only 5-star feedback", value: true, key: "5" },
  ]);

  const mainButtonRef = useRef<HTMLInputElement>(null);
  const [globalFile, setGlobalFile] = useState([]);

  const setSwitch = (key: string) => {
    setSwitchesValues((prev) => {
      const elements = prev.map((element) => {
        if (element.key === key) {
          return {
            ...element,
            value: !element.value,
          };
        } else return element;
      });

      return elements;
    });
  };

  const switches = switchesValues.map((element, index) => {
    const id = "switch" + index;
    return (
      <div className="switch" key={element.key}>
        <input
          type="checkbox"
          id={id}
          defaultChecked={element.value}
          onChange={() => setSwitch(element.key)}
        />
        <label className="btn" htmlFor={id}></label>
        <label htmlFor={id} className="title">
          {element.label}
        </label>
      </div>
    );
  });

  const downloadTemplate = async () => {
    try {
      await fetch("http://localhost:2001/excel/download/basic")
        .then((response) => response.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "Шаблон заполнения отзывов WB.xlsx";
          a.click();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const uploadTemplate = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      try {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file, file.name);
        const globalFile = await fetch(
          "http://localhost:2001/excel/upload/basic",
          {
            method: "POST",
            body: formData,
          }
        ).then((res) => res.json());
        setGlobalFile(globalFile);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // @ts-ignore
  const runScript = (e) => {
    console.log(globalFile);
    if (mainButtonRef.current) {
      const isPaused = mainButtonRef.current.checked;
      console.log(isPaused);
    }
  };

  return (
    <div className="content">
      <div className="header">
        <div className="basic">Basic</div>
        <div className="pro">
          <div className="text">
            <span className="fill">PRO</span> <span className="stars">✨</span>
          </div>
        </div>
        <div className="signinWrap" onClick={() => toLogin()}>
          <div className="text">Sign in</div>
          <img
            src={
              chrome.runtime
                ? chrome.runtime.getURL("assets/person.svg")
                : person
            }
            alt="percon_ico"
          />
        </div>
      </div>
      <div className="main">
        <div className="switches">
          {switches}
          <div className="help">I need help</div>
        </div>
        <div className="startUpload">
          <input
            className="startButtonChecker"
            type="checkbox"
            id="startButton"
            ref={mainButtonRef}
          />
          <label
            className="buttonStart"
            htmlFor="startButton"
            // @ts-ignore
            onClick={(e) => runScript(e)}
          >
            <svg
              className="innerStart"
              width="57"
              height="64"
              viewBox="0 0 57 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M54.7727 29.5383C56.7727 30.693 56.7727 33.5797 54.7727 34.7344L5.06818 63.4314C3.06818 64.5861 0.568181 63.1427 0.568181 60.8333L0.568183 3.43943C0.568184 1.13003 3.06818 -0.313348 5.06818 0.841352L54.7727 29.5383Z"
                fill="#E4DFD9"
              />
            </svg>
            <svg
              className="innerStop"
              width="54"
              height="66"
              viewBox="0 0 54 66"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="17" height="66" rx="3" fill="#D9D9D9" />
              <rect x="37" width="17" height="66" rx="3" fill="#D9D9D9" />
            </svg>
          </label>
          <div className="upload">
            <label className="text" htmlFor="excelUpload">
              Upload
            </label>
            <input
              type="file"
              className="inputExcel"
              name="excelUpload"
              id="excelUpload"
              onChange={(e) => uploadTemplate(e)}
            />
            <img
              src={
                chrome.runtime
                  ? chrome.runtime.getURL("assets/excel.png")
                  : excel
              }
              alt="Upload with excel"
            />
          </div>
          <div className="template" onClick={downloadTemplate}>
            Download template
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
