import { Review } from '../types';

export const mockReviews: Review[] = [
  // Reviews for Venue 1 (Sân Thể Thao Quy Nhơn Center)
  {
    id: '1',
    userId: 'user1',
    userName: 'Nguyễn Văn An',
    rating: 5,
    comment: 'Sân rất đẹp, sạch sẽ và thoáng mát. Nhân viên phục vụ rất nhiệt tình. Sẽ quay lại lần sau!',
    date: '2024-03-15T10:30:00Z',
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Trần Thị Bình',
    rating: 4,
    comment: 'Chất lượng sân tốt, giá cả hợp lý. Chỗ đậu xe hơi chật nhưng nhìn chung ok.',
    date: '2024-03-12T14:20:00Z',
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Lê Minh Cường',
    rating: 5,
    comment: 'Tuyệt vời! Hệ thống chiếu sáng rất tốt, có thể chơi tối muộn. Recommend!',
    date: '2024-03-08T18:45:00Z',
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Phạm Thị Dung',
    rating: 4,
    comment: 'Sân tennis chất lượng cao, mặt sân rất tốt. Phòng thay đồ sạch sẽ.',
    date: '2024-03-05T09:15:00Z',
  },
  
  // Reviews for Venue 2 (SportHub Bình Định)
  {
    id: '5',
    userId: 'user5',
    userName: 'Hoàng Văn Em',
    rating: 4,
    comment: 'Sân cầu lông có điều hòa rất mát, thoải mái chơi cả ngày nóng.',
    date: '2024-03-14T16:30:00Z',
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Võ Thị Phương',
    rating: 3,
    comment: 'Sân bóng rổ hơi nhỏ so với tiêu chuẩn, nhưng vẫn chơi được. Giá ok.',
    date: '2024-03-10T11:45:00Z',
  },
  {
    id: '7',
    userId: 'user7',
    userName: 'Đặng Minh Giang',
    rating: 5,
    comment: 'Rất hài lòng với chất lượng dịch vụ. Sân sạch, thiết bị đầy đủ.',
    date: '2024-03-07T20:10:00Z',
  },
  
  // Reviews for Venue 3 (Elite Sports Complex)
  {
    id: '8',
    userId: 'user8',
    userName: 'Bùi Văn Hải',
    rating: 5,
    comment: 'Đẳng cấp VIP thật sự! Từ sân bãi đến dịch vụ đều hoàn hảo. Xứng đáng với giá tiền.',
    date: '2024-03-13T15:20:00Z',
  },
  {
    id: '9',
    userId: 'user9',
    userName: 'Ngô Thị Ira',
    rating: 4,
    comment: 'Sân tennis premium rất đẹp, ghế ngồi VIP thoải mái. Hơi đắt nhưng chất lượng tốt.',
    date: '2024-03-09T13:35:00Z',
  },
  {
    id: '10',
    userId: 'user10',
    userName: 'Lý Văn Khánh',
    rating: 5,
    comment: 'Tuyệt vời! Dịch vụ 5 sao, nhân viên chuyên nghiệp. Sẽ giới thiệu cho bạn bè.',
    date: '2024-03-04T17:50:00Z',
  }
];