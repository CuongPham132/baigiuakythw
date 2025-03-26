import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Button, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { getAllPhongHoc, deletePhongHocByMa, PhongHoc } from '@/services/phongHoc';

const { Search } = Input;
const { Option } = Select;

const DanhSachPhongHoc: React.FC = () => {
  const history = useHistory();
  const [danhSachPhongHoc, setDanhSachPhongHoc] = useState<PhongHoc[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loaiPhongFilter, setLoaiPhongFilter] = useState<string | undefined>();

  useEffect(() => {
    fetchPhongHoc();
  }, []);

  const fetchPhongHoc = () => {
    const data = getAllPhongHoc();
    setDanhSachPhongHoc(data);
  };

  const handleDelete = (phong: PhongHoc) => {
    if (phong.soChoNgoi >= 30) {
      message.warning('Chỉ được xóa phòng dưới 30 chỗ ngồi');
      return;
    }
    deletePhongHocByMa(phong.maPhong);
    message.success('Xóa phòng học thành công');
    fetchPhongHoc();
  };

  const handleSearch = (value: string) => {
    setSearchText(value.toLowerCase());
  };

  const filteredData = danhSachPhongHoc.filter((phong) => {
    const matchesSearch =
      phong.maPhong.toLowerCase().includes(searchText) ||
      phong.tenPhong.toLowerCase().includes(searchText);
    const matchesLoai = loaiPhongFilter ? phong.loaiPhong === loaiPhongFilter : true;
    return matchesSearch && matchesLoai;
  });

  const columns = [
    {
      title: 'Mã phòng',
      dataIndex: 'maPhong',
      sorter: (a: PhongHoc, b: PhongHoc) => a.maPhong.localeCompare(b.maPhong),
    },
    {
      title: 'Tên phòng',
      dataIndex: 'tenPhong',
      sorter: (a: PhongHoc, b: PhongHoc) => a.tenPhong.localeCompare(b.tenPhong),
    },
    {
      title: 'Số chỗ ngồi',
      dataIndex: 'soChoNgoi',
      sorter: (a: PhongHoc, b: PhongHoc) => a.soChoNgoi - b.soChoNgoi,
    },
    {
      title: 'Loại phòng',
      dataIndex: 'loaiPhong',
    },
    {
      title: 'Người phụ trách',
      dataIndex: 'nguoiPhuTrach',
    },
    {
      title: 'Thao tác',
      render: (_: any, record: PhongHoc) => (
        <Space>
          <Button type="link" onClick={() => history.push(`/phong-hoc/chinh-sua/${record.maPhong}`)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record)}
            okText="Đồng ý"
            cancelText="Hủy"
          >
            <Button danger type="link">Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm mã phòng, tên phòng"
          onSearch={handleSearch}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo loại phòng"
          allowClear
          onChange={value => setLoaiPhongFilter(value)}
          style={{ width: 200 }}
        >
          <Option value="Lý thuyết">Lý thuyết</Option>
          <Option value="Thực hành">Thực hành</Option>
          <Option value="Hội trường">Hội trường</Option>
        </Select>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => history.push('/phong-hoc/them-moi')}
        >
          Thêm mới
        </Button>
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="maPhong"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default DanhSachPhongHoc;
