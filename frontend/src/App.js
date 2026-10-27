import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '',
    department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc'
  });
  const [editId, setEditId] = useState(null);

  const fetchEmployees = async (query = '') => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}?search=${query}`);
      setEmployees(res.data);
    } catch (err) {
      alert('Lỗi khi tải danh sách nhân viên');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEmployees(search);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, form);
        alert('Cập nhật thành công!');
      } else {
        await axios.post(API_URL, form);
        alert('Thêm mới nhân viên thành công!');
      }
      setForm({
        employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '',
        department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc'
      });
      setEditId(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Thao tác thất bại');
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp._id);
    setForm(emp);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này không?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('Xóa nhân viên thành công!');
        fetchEmployees();
      } catch (err) {
        alert('Xóa thất bại');
      }
    }
  };

  return (
    <div className="container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>HỆ THỐNG QUẢN LÝ NHÂN SỰ - TRẦN MINH TÂM (239714)</h2>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input 
          placeholder="Tìm theo Mã NV hoặc Họ tên..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{ padding: '8px', width: '300px', marginRight: '10px' }}
        />
        <button type="submit" style={{ padding: '8px 15px' }}>Tìm kiếm</button>
      </form>

      <form onSubmit={handleSubmit} style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editId ? 'Cập Nhật Hồ Sơ Nhân Viên' : 'Thêm Hồ Sơ Nhân Viên Mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input placeholder="Mã nhân viên *" value={form.employeeId} onChange={e => setForm({...form, employeeId: e.target.value})} required disabled={!!editId} />
          <input placeholder="Họ và tên *" value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} required />
          <input placeholder="Email *" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input placeholder="Số điện thoại" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <input placeholder="Phòng ban" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
          <input placeholder="Chức vụ" value={form.position} onChange={e => setForm({...form, position: e.target.value})} />
        </div>
        <div style={{ marginTop: '10px' }}>
          <button type="submit" style={{ padding: '8px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
            {editId ? 'Lưu Cập Nhật' : 'Thêm Mới'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ employeeId: '', fullName: '', gender: 'Nam', dateOfBirth: '', department: '', position: '', email: '', phone: '', hireDate: '', status: 'Đang làm việc' }); }} style={{ padding: '8px 15px' }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {loading ? <p>Đang tải dữ liệu...</p> : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#eee' }}>
              <th>Mã NV</th><th>Họ và Tên</th><th>Phòng ban</th><th>Chức vụ</th><th>Email</th><th>Số ĐT</th><th>Trạng thái</th><th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {employees.map(emp => (
              <tr key={emp._id}>
                <td>{emp.employeeId}</td>
                <td>{emp.fullName}</td>
                <td>{emp.department}</td>
                <td>{emp.position}</td>
                <td>{emp.email}</td>
                <td>{emp.phone}</td>
                <td>{emp.status}</td>
                <td>
                  <button onClick={() => handleEdit(emp)} style={{ marginRight: '5px' }}>Sửa</button>
                  <button onClick={() => handleDelete(emp._id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', cursor: 'pointer' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;