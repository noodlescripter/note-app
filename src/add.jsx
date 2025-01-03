import axios from "axios"
import { useState } from "react"
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

export default function AddComponent() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const date = new Date();
  const options = { timeZone: 'America/New_York', month: 'numeric', day: 'numeric', year: 'numeric' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  // Quill editor formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'blockquote', 'code-block',
    'color', 'background',
    'align',
    'link'
  ];

  function handleName(name) {
    setName(name)
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
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-light">
        <h5 className="card-title mb-0">Add New Item</h5>
      </div>
      <div className="card-body">
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="mb-3">
            <label htmlFor="itemName" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="itemName"
              placeholder="Enter item name"
              value={name}
              onChange={(e) => handleName(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="itemDescription" className="form-label">Description</label>
            <div style={{ height: '400px' }}> {/* Container for Quill */}
              <ReactQuill
                theme="snow"
                value={description}
                onChange={setDescription}
                modules={modules}
                formats={formats}
                style={{ height: '350px' }}
                placeholder="Enter description..."
              />
            </div>
          </div>
          
          <div className="d-flex justify-content-between align-items-center mt-5">
            <small className="text-muted">Created on: {formattedDate}</small>
            <div className="btn-group">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => window.location.reload()}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary ms-2"
                disabled={!name || !description}
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}