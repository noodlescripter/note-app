import { useState } from 'react'
import axios from 'axios'
import AddComponent from './add'
import './App.css'

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

  function handleAdd() {
    setAdd(true)
  }

  async function call_data(url) {
    try {
      const res = await axios.get(url)
      const res_data = res.data;
      setData(res_data);
    } catch (axiosError) {
      console.log(axiosError)
    }
  }

  useState(() => {
    call_data('/api/v1/getdata');
  }, [])

  return (
    <div className="container-fluid">
      <div className="row">
        <nav className="col-md-3 col-lg-2 bg-light sidebar">
          <div className="sidebar-sticky">
            <div className="d-flex align-items-center p-2">
              <input 
                type="text" 
                className="form-control form-control-sm me-2" 
                placeholder="Search" 
                value={search} 
                onChange={handleSearch} 
              />
              <button 
                className="btn btn-sm btn-outline-primary" 
                onClick={handleAdd}
              >
                +Add
              </button>
            </div>
            <ul className="nav flex-column mt-2">
              {search.length > 0 ? (
                data?.filter(item => 
                  item.name.toLowerCase().includes(search.toLowerCase())
                ).map((item, index) => (
                  <li className="nav-item" key={index}>
                    <button 
                      className={`nav-link btn btn-link text-start w-100 ${description === item.name ? 'active' : ''}`} 
                      onClick={() => handleDescription(item.name)}
                    >
                      {item.name.slice(0, 20)}
                    </button>
                  </li>
                ))
              ) : (
                data ? (
                  data.map((item, index) => (
                    <li className="nav-item" key={index}>
                      <button 
                        className={`nav-link btn btn-link text-start w-100 ${description === item.name ? 'active' : ''}`} 
                        onClick={() => handleDescription(item.name)}
                      >
                        {item.name.slice(0, 20)}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="nav-item">
                    <span className="nav-link text-muted">No items found</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </nav>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
  {add ? (
    <div className="mt-3">
      <AddComponent />
    </div>
  ) : (
    <div className="mt-3">
      {data ? (
        data
          .filter(item => item.name === description)
          .map((item, i) => (
            <div key={i} className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h2 className="h4 mb-0">{item.name}</h2>
                  <small className="text-muted">created on: {item.createOn}</small>
                </div>
              </div>
              <div className="card-body">
                <div 
                  className="ql-editor" 
                  dangerouslySetInnerHTML={{ __html: item.description }}
                  style={{
                    padding: '0',
                    minHeight: 'auto'
                  }}
                />
              </div>
            </div>
          ))
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <p className="text-muted mb-0">Select an item to view details</p>
          </div>
        </div>
      )}
    </div>
  )}
</main>
      </div>
    </div>
  )
}

export default App