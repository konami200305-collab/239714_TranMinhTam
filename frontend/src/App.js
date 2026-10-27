import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://api-239714.onrender.com/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null); // Lưu ID nhân viên đang sửa
  const [formData, setFormData] = useState({
    employeeId: '',
    fullName: '',
    gender: 'Nam',
    dateOfBirth: '',
    department: '',
    position: '',
    email: '',
    phone: '',
    hireDate: '',
    status: 'Đang làm việc'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      alert('Lỗi khi tải danh sách nhân viên');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Hàm xử lý cả Thêm mới và Cập nhật
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Gọi API PUT để cập nhật
        await axios.put(`${API_URL}/${editingId}`, formData);
        alert('Cập nhật thông tin nhân viên thành công!');
      } else {
        // Gọi API POST để thêm mới
        await axios.post(API_URL, formData);
        alert('Thêm nhân viên thành công!');
      }
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert('Thao tác thất bại');
    }
  };

  // Đổ dữ liệu nhân viên lên Form khi bấm nút "Sửa"
  const handleEdit = (emp) => {
    setEditingId(emp._id || emp.employeeId);
    setFormData({
      employeeId: emp.employeeId || '',
      fullName: emp.fullName || '',
      gender: emp.gender || 'Nam',
      dateOfBirth: emp.dateOfBirth ? emp.dateOfBirth.substring(0, 10) : '',
      department: emp.department || '',
      position: emp.position || '',
      email: emp.email || '',
      phone: emp.phone || '',
      hireDate: emp.hireDate ? emp.hireDate.substring(0, 10) : '',
      status: emp.status || 'Đang làm việc'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchEmployees();
      } catch (err) {
        alert('Xóa thất bại');
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      employeeId: '',
      fullName: '',
      gender: 'Nam',
      dateOfBirth: '',
      department: '',
      position: '',
      email: '',
      phone: '',
      hireDate: '',
      status: 'Đang làm việc'
    });
  };

  const filteredEmployees = employees.filter(emp =>
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>HỆ THỐNG QUẢN LÝ NHÂN SỰ - TRẦN MINH TÂM (239714)</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm theo Mã NV hoặc Họ tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '250px', marginRight: '10px' }}
        />
      </div>

      <form onSubmit={handleSubmit} style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
        <h3>{editingId ? 'Cập Nhật Hồ Sơ Nhân Viên' : 'Thêm Hồ Sơ Nhân Viên Mới'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input type="text" name="employeeId" placeholder="Mã nhân viên *" value={formData.employeeId} onChange={handleChange} required disabled={!!editingId} />
          <input type="text" name="fullName" placeholder="Họ và tên *" value={formData.fullName} onChange={handleChange} required />
          
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
            <option value="Khác">Khác</option>
          </select>
          
          <input type="date" name="dateOfBirth" placeholder="Ngày sinh" value={formData.dateOfBirth} onChange={handleChange} />
          <input type="text" name="department" placeholder="Phòng ban" value={formData.department} onChange={handleChange} />
          <input type="text" name="position" placeholder="Chức vụ" value={formData.position} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required />
          <input type="text" name="phone" placeholder="Số điện thoại" value={formData.phone} onChange={handleChange} />
          <input type="date" name="hireDate" placeholder="Ngày vào làm" value={formData.hireDate} onChange={handleChange} />
          
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Đang làm việc">Đang làm việc</option>
            <option value="Đã nghỉ việc">Đã nghỉ việc</option>
            <option value="Tạm nghỉ">Tạm nghỉ</option>
          </select>
        </div>

        <div style={{ marginTop: '15px' }}>
          <button type="submit" style={{ padding: '10px 20px', backgroundColor: editingId ? '#0d6efd' : '#28a745', color: '#fff', border: 'none', cursor: 'pointer', marginRight: '10px' }}>
            {editingId ? 'Cập Nhật' : 'Thêm Mới'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Hủy Sửa
            </button>
          )}
        </div>
      </form>

      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#e9ecef' }}>
            <th>Mã NV</th>
            <th>Họ và Tên</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>Phòng ban</th>
            <th>Chức vụ</th>
            <th>Email</th>
            <th>Số ĐT</th>
            <th>Ngày vào làm</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((emp) => (
            <tr key={emp._id || emp.employeeId}>
              <td>{emp.employeeId}</td>
              <td>{emp.fullName}</td>
              <td>{emp.gender || 'Nam'}</td>
              <td>{emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString('vi-VN') : ''}</td>
              <td>{emp.department}</td>
              <td>{emp.position}</td>
              <td>{emp.email}</td>
              <td>{emp.phone}</td>
              <td>{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString('vi-VN') : ''}</td>
              <td>{emp.status || 'Đang làm việc'}</td>
              <td>
                <button onClick={() => handleEdit(emp)} style={{ backgroundColor: '#ffc107', color: '#000', border: 'none', padding: '5px 10px', cursor: 'pointer', marginRight: '5px' }}>
                  Sửa
                </button>
                <button onClick={() => handleDelete(emp._id || emp.employeeId)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
