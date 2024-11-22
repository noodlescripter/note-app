import axios from "axios"
import { useState } from "react"

export default function AddComponent() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const date = new Date();
  const options = { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  function handleName(name) {
    setName(name)
  }
  function handleDescription(des) {
    setDescription(des)
  }

  async function handleSave() {
    const makeBod = {
      name: name,
      description: description,
      createOn: formattedDate
    }
    const res = await axios.post('/api/v1/postData', makeBod);
    if (res.status === 201) {
      window.location.reload();
    }
  }

  return (
    <div>
      <div className="row mb-2">
        <div className="col">
          <input type="text" className="form-control" placeholder="Name" value={name} onChange={(e) => handleName(e.target.value)} />
        </div>
      </div>
      <div className="row mb-2">
        <div className="col">
          <textarea type="text" className="form-control" style={{ height: '500px' }} placeholder="Description" value={description} onChange={(e) => handleDescription(e.target.value)} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <button className="btn btn-secondary" onClick={() => handleSave()}>Save</button>
        </div>
      </div>
    </div>
  )
}