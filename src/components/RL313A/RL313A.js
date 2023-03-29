import React, { useState, useEffect, useRef } from "react";
import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useNavigate, Link } from 'react-router-dom'
import style from './FormTambahRL313A.module.css'
import { HiSaveAs } from 'react-icons/hi'
import { RiDeleteBin5Fill, RiEdit2Fill } from 'react-icons/ri'
import { AiFillFileAdd } from 'react-icons/ai'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import Table from 'react-bootstrap/Table';
import Spinner from "react-bootstrap/esm/Spinner";
import { DownloadTableExcel } from "react-export-table-to-excel";
import Select from 'react-select'

export const RL313A = () => {
  const [tahun, setTahun] = useState('2022')
  const [namaRS, setNamaRS] = useState('')
  const [alamatRS, setAlamatRS] = useState('')
  const [namaPropinsi, setNamaPropinsi] = useState('')
  const [namaKabKota, setNamaKabKota] = useState('')
    // const [nama, setNama] = useState('')
    const [token, setToken] = useState('')
    const [expire, setExpire] = useState('')
    const [dataRL, setDataRL] = useState([]);
    const [spinner, setSpinner]= useState(false)
    const navigate = useNavigate()
    const [options, setOptions] = useState([]);
  const [optionsrs, setOptionsRS] = useState([]);
  const [idkabkota, setIdKabKota] = useState("");
  const [idrs, setIdRS] = useState("");
  const tableRef = useRef(null);
  const [namafile, setNamaFile] = useState("");
  // const [namaRS, setNamaRS] = useState("");
  const [namakabkota, setKabKota] = useState("");
  const [statusValidasi, setStatusValidasi] = useState({ value: 3, label: 'Belum divalidasi' })
  const [statusValidasiId, setStatusValidasiId] = useState(3)
  const [optionStatusValidasi, setOptionStatusValidasi] = useState([])
  const [catatan, setCatatan] = useState("")
  const [buttonStatus, setButtonStatus] = useState(true)
  const [statusDataValidasi, setStatusDataValidasi] = useState()


    useEffect(() => {
        refreshToken()
        // getCariTahun(2022)
        getDataKabkota();
        getStatusValidasi()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshToken = async () => {
        try {
          const response = await axios.get("/apisirsadmin/token");
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          setExpire(decoded.exp);
          // getDataRS(decoded.rsId);
        } catch (error) {
          if (error.response) {
            navigate("/");
          }
        }
      };
    
      const axiosJWT = axios.create();
      axiosJWT.interceptors.request.use(
        async (config) => {
          const currentDate = new Date();
          if (expire * 1000 < currentDate.getTime()) {
            const response = await axios.get("/apisirsadmin/token");
            config.headers.Authorization = `Bearer ${response.data.accessToken}`;
            setToken(response.data.accessToken);
            const decoded = jwt_decode(response.data.accessToken);
            setExpire(decoded.exp);
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
    
      const getDataKabkota = async () => {
        try {
          const response = await axiosJWT.get("/apisirsadmin/kabkota");
          const kabkotaDetails = response.data.data.map((value) => {
            return value;
          });
    
          const results = [];
          kabkotaDetails.forEach((value) => {
            // console.log(value);
            results.push({
              key: value.nama,
              value: value.id,
              nama: value.nama,
              provinsi_id : value.provinsi_id,
            });
          });
          // Update the options state
          setOptions([{ key: "Piih Kab/Kota", value: "" }, ...results]);
        } catch (error) {
          if (error.response) {
            navigate("/");
          }
        }
      };
    
    
  const getStatusValidasi = async () => {
    try {
        const response = await axios.get("/apisirsadmin/statusvalidasi")
        const statusValidasiTemplate = response.data.data.map((value, index) => {
            return {
                value: value.id,
                label: value.nama
            }
        })
        setOptionStatusValidasi(statusValidasiTemplate)
        
    } catch (error) {
        console.log(error)
    }
    // setStatusValidasi(3)
}


const searchRS = async (e) => {
    try {
    const responseRS = await axiosJWT.get(
        "/apisirsadmin/rumahsakit/" + e.target.value,
        {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        }
    );
    const DetailRS = responseRS.data.data.map((value) => {
        return value;
    });
    const resultsRS = [];

    DetailRS.forEach((value) => {
        resultsRS.push({
        key: value.RUMAH_SAKIT,
        value: value.Propinsi,
        });
    });
    // // Update the options state
    setIdKabKota(e.target.value);
    setOptionsRS([...resultsRS]);
    setKabKota(e.target.options[e.target.selectedIndex].text);
    } catch (error) {
    if (error.response) {
        console.log(error);
    }
    }
};

const changeHandlerSingle = (event) => {
    setTahun(event.target.value);
};

const changeHandlerCatatan = (event) => {
    setCatatan(event.target.value);
};

const changeHandlerRS = (event) => {
    setIdRS(event.target.value);
}

const changeHandlerStatusValidasi = (selectedOption) => {
    setStatusValidasiId(parseInt(selectedOption.value))
    setStatusValidasi(selectedOption)
    // console.log(statusValidasiId)
}

const Validasi = async (e) => {
    e.preventDefault();
    setSpinner(true);
    let date = (tahun+'-01-01');

    // getDataStatusValidasi()

    if(statusValidasiId == 3){
        alert('Silahkan pilih status validasi terlebih dahulu')
        setSpinner(false)
    } else {
        if(statusValidasiId == 2 && catatan == ""){
            alert('Silahkan isi catatan apabila laporan tidak valid')
            setSpinner(false)
        } else if (idrs == "") {
            alert('Silahkan pilih rumah sakit')
            setSpinner(false)
        } else {
            try {
                const customConfig = {
                    headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    },
                    params: {
                    rsid: idrs,
                    rlid: 13,
                    tahun: date,
                    },
                };
                const results = await axiosJWT.get(
                    "/apisirsadmin/validasi",
                    customConfig
                )
    
                if(results.data.data == null){
                    
                } else {
                    setStatusDataValidasi(results.data.data.id)
                }
            } catch (error) {
                console.log(error);
            }

            if(statusDataValidasi == null){
                try {
                    const customConfig = {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                    const result = await axiosJWT.post('/apisirsadmin/validasi',{
                        rsId: idrs,
                        rlId: 13,
                        tahun: date,
                        statusValidasiId: statusValidasiId,
                        catatan: catatan
                    }, customConfig)
                    // console.log(result.data)
                    setSpinner(false)
                    toast('Data Berhasil Disimpan', {
                        position: toast.POSITION.TOP_RIGHT
                    })
                } catch (error) {
                    toast(`Data tidak bisa disimpan karena ,${error.response.data.message}`, {
                        position: toast.POSITION.TOP_RIGHT
                    })
                    setSpinner(false)
                }
            } else {
                try {
                    const customConfig = {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                    await axiosJWT.patch('/apisirsadmin/validasi/' + statusDataValidasi, {
                        statusValidasiId: statusValidasiId,
                        catatan: catatan
                    }, customConfig);
                    setSpinner(false)
                    toast('Data Berhasil Diupdate', {
                        position: toast.POSITION.TOP_RIGHT
                    })
                } catch (error) {
                    console.log(error)
                    toast('Data Gagal Diupdate', {
                        position: toast.POSITION.TOP_RIGHT
                    })
                    setButtonStatus(false)
                    setSpinner(false)
                }
            }

            getDataStatusValidasi()
        }
    }
}

const getDataStatusValidasi = async () => {
    // e.preventDefault();
    let date = (tahun+'-01-01');

    try {
        const customConfig = {
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            params: {
            rsid: idrs,
            rlid: 13,
            tahun: date,
            },
        };
        const results = await axiosJWT.get(
            "/apisirsadmin/validasi",
            customConfig
        )

        if(results.data.data == null){
            setButtonStatus(false)
            // setStatusDataValidasi()
            setStatusValidasi({ value: 3, label: 'Belum divalidasi' })
        } else {
            setStatusValidasi({ value: results.data.data.status_validasi.id, label: results.data.data.status_validasi.nama })
            setCatatan(results.data.data.catatan)
            setButtonStatus(false)
            setStatusDataValidasi(results.data.data.id)
            // alert('hi')
        }
        // console.log(results)
    } catch (error) {
        console.log(error);
    }
}

  const Cari = async (e) => {
      e.preventDefault()
      setSpinner(true)
      try {
          const customConfig = {
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              params: {
                  koders: idrs,
                  tahun: tahun,
                  option:options,
              }
          }
          const results = await axiosJWT.get('/apisirsadmin/rltigatitiktigabelasa',
              customConfig)

          const rlTigaTitikTigaBelasADetails = results.data.data.map((value) => {
              return value.rl_tiga_titik_tiga_belas_a_details
          })

          let dataRLTigaTitikTigaBelasADetails = []
          rlTigaTitikTigaBelasADetails.forEach(element => {
              element.forEach(value => {
                dataRLTigaTitikTigaBelasADetails.push(value)
              })
          })

          setDataRL(dataRLTigaTitikTigaBelasADetails)
          setNamaFile("RL313A_" + idrs);
          setSpinner(false)
          setNamaRS(results.data.dataRS.RUMAH_SAKIT);
          console.log(dataRLTigaTitikTigaBelasADetails)
      } catch (error) {
          console.log(error)
      }
      getDataStatusValidasi()
  }
    


    return (
      <div className="container" style={{ marginTop: "70px" }}>
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title h5">Validasi RL 3.13 A</h5>
                        <form onSubmit={Validasi}>
                        {/* <div className="form-floating" style={{width:"100%", display:"inline-block"}}> */}
                            <Select
                                options={optionStatusValidasi} className="form-control" name="status_validasi_id" id="status_validasi_id"
                                onChange={changeHandlerStatusValidasi} value={statusValidasi}
                            />
                            {/* <label htmlFor="status_validasi_id">Status Validasi</label> */}
                        {/* </div> */}
                            <div className="form-floating" style={{width:"100%", display:"inline-block"}}>
                                <input name="catatan" type="text" className="form-control" id="floatingInputCatatan" 
                                    placeholder="catatan" value={catatan} onChange={e => changeHandlerCatatan(e)} />
                                <label htmlFor="floatingInputCatatan">Catatan Tidak Diterima</label>
                            </div>
                            <div className="mt-3 mb-3">
                                <ToastContainer />
                                <button type="submit" disabled={buttonStatus} className="btn btn-outline-success"><HiSaveAs size={20}/> Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <form onSubmit={Cari}>
                  <h5 className="card-title h5">
                    Filter RL 3.13 A
                  </h5>
                  <div
                    className="form-floating"
                    style={{ width: "100%", display: "inline-block" }}
                  >
                    <select
                      name="kabkota"
                      typeof="select"
                      className="form-control"
                      id="floatingselect"
                      placeholder="Kab/Kota"
                      onChange={searchRS}
                    >
                      {options.map((option) => {
                        // console.log(option)
                        return (
                          <option key={option.value} value={option.value} nama={option.nama}>
                            {option.key}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="floatingInput">Kab. Kota :</label>
                  </div>
  
                  <div
                    className="form-floating"
                    style={{ width: "100%", display: "inline-block" }}
                  >
                    <select
                      name="rumahsakit"
                      typeof="select"
                      className="form-control"
                      id="floatingselect"
                      placeholder="Rumah Sakit"
                      onChange={(e) => changeHandlerRS(e)}
                    >
                      <option value="">Pilih Rumah Sakit</option>
                      {optionsrs.map((option) => {
                        return (
                          <option key={option.value} value={option.value} nama={option.nama}>
                            {option.key}
                          </option>
                        );
                      })}
                    </select>
                    <label htmlFor="floatingInput">Rumah Sakit :</label>
                  </div>
  
                  <div
                    className="form-floating"
                    style={{ width: "100%", display: "inline-block" }}
                  >
                    <input
                      name="tahun"
                      type="text"
                      className="form-control"
                      id="floatingInput"
                      placeholder="Tahun"
                      value={tahun}
                      onChange={(e) => changeHandlerSingle(e)}
                    />
                    <label htmlFor="floatingInput">Tahun</label>
                  </div>
                  <div className="mt-3 mb-3">
                    <button type="submit" className="btn btn-outline-success">
                      <HiSaveAs /> Cari
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
            <div className="row mt-3 mb-3">
                <div className="col-md-12">
                    {/* <Link to={`/rl313a/tambah/`} style={{textDecoration: "none"}}>
                        <AiFillFileAdd size={30} style={{color:"gray",cursor: "pointer"}}/><span style={{color: "gray"}}></span>
                        <span style={{color: "gray"}}>RL 3.13 Obat Pengadaan</span>
                    </Link> */}
                    <div className="container" style={{ textAlign: "center" }}>
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                        {spinner && <Spinner animation="grow" variant="success"></Spinner>}
                    </div>
                    <DownloadTableExcel
            filename={namafile}
            sheet="data RL 313A"
            currentTableRef={tableRef.current}
          >
             <button className="btn btn-outline-success mb-2">
                        <HiSaveAs /> Export Excel
                </button>
          </DownloadTableExcel>
                    <Table className={style.rlTable} ref={tableRef}>
                        <thead>
                            <tr>
                            <th style={{"width": "8%"}}>RL</th>
                            <th>Nama RS</th>
                            <th>Tahun</th>
                            <th>Kab/Kota</th>
                                <th style={{"width": "4%"}}>No Golongan Obat</th>
                                <th>Golongan Obat</th>
                                <th>JUMLAH ITEM OBAT</th>
                                <th>JUMLAH ITEM OBAT YANG TERSEDIA DI RUMAH SAKIT</th>
                                <th>JUMLAH ITEM OBAT FORMULATORIUM TERSEDIA DIRUMAH SAKIT</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataRL.map((value, index) => {
                                return (
                                <tr key={value.id}>
                                   <td>RL 3.13 A </td>
                                  <td>{namaRS}</td>
                                  <td>{value.tahun}</td>
                                  <td>{namakabkota}</td>
                                    <td><center>{value.golongan_obat.no}</center>
                                    </td>
                                    <td>{value.golongan_obat.nama}
                                    </td>
                                    <td><center>{value.jumlah_item_obat}</center>
                                    </td>
                                    <td><center>{value.jumlah_item_obat_rs}</center>
                                    </td>
                                    <td><center>{value.jumlah_item_obat_formulatorium} </center>
                                    </td>
                                </tr>
                                )
                            }) }
                        </tbody>
                    </Table>
                </div>
            </div>
        </div>
    )
}

export default RL313A