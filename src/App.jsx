import { useState } from 'react'
import './App.css'
import axios from 'axios'
import AddComponent from './add'
function App() {
  const [data, setData] = useState()
  const [description, setDescription] = useState('')
  const [search, setSearch] = useState('');
  const [add, setAdd] = useState(false)
  const [selected, setSelected] = useState('transparent')
  function handleDescription(param1) {
    setDescription(param1)
    setSearch('')
    setAdd(false)
    setSelected('primary')
  }

  function handleSearch(e) {
    const { value } = e.target;
    setSearch(value)
  }

  function handleAdd(){
    setAdd(true)
  }

  async function call_data(url) {
    try {
      const res = await axios.get(url)
      const res_data = res.data;
      console.log("Data from <App/> : ", res_data)
      setData(res_data);
    } catch (axiosError) {
      console.log(axiosError)
    }
  }
  useState(() => {
    call_data('/api/v1/getdata');
  }, [])

  return (
    <>
      <div className='container-fluid'>
        <div className='row'>
          <nav className='col-md-3 col-lg-2 d-md-block bg-light sidebar'>
            <div className='position-sticky'>
              <input type="text" className='form-control-sm m-2' placeholder='Search' value={search} onChange={(e) => handleSearch(e)} />
              <button className='btn btn-sm bg-transparent' onClick={()=> handleAdd()}>
                <strong>+Add</strong>
              </button>
              <ul className='nav flex-column'>
                {
                  search.length > 0 ? (
                    data.filter(item => {
                      return item.name.includes(search) || item.name === search;
                    })
                      .map((item, index) => (
                        <li className='nav-item' key={index}>
                          <button className='btn bg-transparent' onClick={() => handleDescription(item.name)}>{item.name.slice(0, 20)}</button>
                        </li>
                      ))
                  ) : (
                    data ? (
                      data.map((item, index) => (
                        <li className='nav-item' key={index}>
                          <button className='btn bg-transparent' onClick={() => handleDescription(item.name)}>{item.name.slice(0, 20)}</button>
                        </li>
                      ))
                    ) : <p>None found</p>
                  )
                }
              </ul>
            </div>
          </nav>
          {add ? (
            <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-2'>
              <AddComponent></AddComponent>
            </main>
          ) : (
            <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4'>
              {
                data ? (
                  data
                    .filter(item => {
                      console.log("Filter Check:", item.name, description);
                      return item.name === description;
                    })
                    .map((item, i) => (
                      <div key={i}>
                        <h1>{item.name} || created on: {item.createOn}</h1>
                        {item.description.split('\n').map((line, index)=>(
                          <p key={index}>{line}</p>
                        ))}
                      </div>
                    ))
                ) : (
                  <p>No matching data found</p>
                )
              }
            </main>
          )}

        </div>
      </div>
    </>
  )
}

export default App
