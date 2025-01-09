import React, { useState,useRef} from 'react';
import axios from 'axios';
import "./App.css"
const App: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading,setLoading] = useState<boolean>(false);
    const [uploaded,setuploaded]=useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const apiUrl = 
   window.location.hostname === "localhost"
     ? "http://localhost:5000"
     : "https://excel-sheet-importer-3k8q.vercel.app";
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files){
            setFile(e.target.files[0]);
            setFileName(e.target.files[0].name);
        } 
    };
    const triggerFileInput = (): void => {
        fileInputRef.current?.click();
      };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();     
        if (!file) {
            alert('Please select a file!');
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
       setLoading(true);
        try {
            const response = await axios.post(apiUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setuploaded(true);
            setLoading(false);
            if(response.data.duplicates>5){
                setMessage(`Your records have ${response.data.duplicates} duplicate elements ${String.fromCodePoint(0x1F622)}`)
            }
            
            // alert(`Your records have ${response.data.duplicates} duplicate elements ${String.fromCodePoint(0x1F622)}`);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'Something went wrong');
        }
    };

    return (
        <div className='d-flex flex-column main-container m-3'>
            <div className='bg-warning fw-bold p-2 d-flex w-100 flex-row justify-content-between text-center'>
                <div>
                    Add from Excel
                </div>
                <div>
                <i className="fs-4 fa-solid fa-xmark"></i>
                </div>
            </div>
            <div className='mt-5 ms-5 ps-5 fw-bold fs-4'>Add candidates to the database</div>
             
            <div  onClick={triggerFileInput} className='pt-3 pb-2 upload-place w-75 border border-2 text-center'>
                {loading? <div>loading......</div>:
                !uploaded ?
              ( <>
                <i className="rounded-circle text-white p-3 fs-2 bg-dark fa-solid fa-upload"></i>
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    ref={fileInputRef}
                    className="d-none"
                    onChange={handleFileChange}
                />
                {
                fileName?(
                    <>
                    <p>{fileName}</p>
                    <button className='bg-success text-white rounded' onClick={handleSubmit}>Submit</button>
                    </>
                ): (   
                <p className='text-black fw-2'>
                Upload a .xlx or .xlsx file here
               </p>
               )
            }
               </>
              )   
                   :
                   (
                   <>
                    <p>{message}</p>
                    <p>
                        Thank You!
                    </p>
                    <p>
                    <i className="fa-solid fa-check text-success fw-bold"></i> File Successfully Uploaded
                    </p>
                    <p>
                        Your record will be processed shortly
                    </p>
                    <button onClick={()=>{setuploaded(false);setFileName(null);setFile(null)}} className='p-2'>
                        Upload more files
                    </button>
                   </>
                    
                   )
           }
            </div>
        </div>
    );
};

export default App;
