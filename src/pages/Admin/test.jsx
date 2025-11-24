
import { useState } from "react";
import mediaUpload from "../../utils/mediaUpload";

export default function Testpage() {
    const [image, setImage] = useState(null)

    

    function fileUpload() {
        mediaUpload(image).then(
            (res) => {
                console.log(res)
                }
        ).catch(
            (res) => {
                console.log(res)
                }
            )
    }
    return (
      <div>
            <input type="file"
                onChange={(e) => {
            setImage(e.target.files[0])
        }}
            />
        <button onClick={fileUpload} className="bg-green-500 text-white font-bold py-2 px-4 rounded">
          Upload
        </button>
      </div>
    );
  }
  