import { useState } from "react";
import axios from "axios";
import loading from './gif/loading.gif';

interface Opcion {
  id: string;
  name: string;
  domains: string
}
const ComboBox = () => {
  const [opciones, setOpciones] = useState<Opcion[]>([]);
  const [ShowLoading, setShowLoading] = useState(false);
  const [showCombobox, setshowCombobox] = useState(false);
  const [selected, setSelected] = useState<string | "">("");
  const [showComboboxNoFound, setshowComboboxNoFound] = useState(false);
  const sleep = (milliseconds: any) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  const funncionesCombobox = (result: Opcion[]) => {

    if (result.length > 0) {
      setShowLoading(false)
      setshowCombobox(true)
      setshowComboboxNoFound(false)
    }
    else {
      setShowLoading(false)
      setshowCombobox(false)
      setshowComboboxNoFound(true)
    }
  }
  const eventos = async (name: string) => {
    try {
      setSelected(name)
      if (name.length >= 3) {
        const response = axios.get<Opcion[]>(`http://localhost:3001/search?name=${name}`);

        setShowLoading(true)
        setshowCombobox(false)
        setshowComboboxNoFound(false)
        //se puso un sleep para quee se note el loading
        await sleep(1000);
        const result = (await response).data
        setOpciones(result);
        funncionesCombobox(result)

      } else {
        setOpciones([])
        funncionesCombobox([])
        setshowCombobox(false)
        setshowComboboxNoFound(false)
      }


    } catch (error) {
      alert("Error obteniendo datos:" + error);
    }



  }
  const handleBlur = () => {
    if(selected != "")
      setshowCombobox(false);
  };
  const handleOnFocus = () => {
    if(opciones.length > 0)
      setshowCombobox(true);
  };
  return (
    <div className="relative w-64 mx-auto mt-10"

    >
      <label> WebSite<i className="fa-solid fa-circle-question"></i></label>
      <input
        type="text"
        placeholder="Buscar..."
        value={selected}
        onChange={
          (e) => {
            eventos(e.target.value)
          }

        }
        

        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {ShowLoading && (
        <ul id="boxselectorfound" className="absolute left-0 right-0 bg-white border rounded-lg shadow-md mt-1 max-h-40 overflow-y-auto">
          <img className="loading" src={loading} />
        </ul>
      )}
      {opciones.length == 0 && showComboboxNoFound && (
        <ul id="boxselectorfound" className="absolute left-0 right-0 bg-white border rounded-lg shadow-md mt-1 max-h-40 overflow-y-auto">
          <li id="nofound"><small>No result found</small></li>
        </ul>
      )}
      {opciones.length > 0 && showCombobox && (
        <ul id="boxselector" className="absolute left-0 right-0 bg-white border rounded-lg shadow-md mt-1 max-h-40 overflow-y-auto">
          {opciones.map((item, _index) => (
            <div className="combo-row pointer" id={item.id} onClick={(_e) => {
              setshowCombobox(false)
              setOpciones([]);
              setSelected(item.name);
            }

            } >
              <div className="combo-column1">
                <img src={'./icons/ic_' + item.id + '.svg'} />
              </div>
              <div className="combo-column2">
                <p><strong>{item.name}</strong> </p>
                <p className="sombreado">{item.domains.split(',')[0]}</p>
              </div>
            </div>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ComboBox;