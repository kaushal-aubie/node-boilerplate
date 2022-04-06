import { User } from '@/entity';

export default async () => {
  /*
  const user = new User();

  user.email = 'kaushal@gmail.com';
  user.password = 'Password@12';
  user.firstName = 'Kaushal';
  user.lastName = 'Shah';
  user.mobile = '1234567890';

  await user.save();
*/

  const user = User.create({
    email: 'kaushal@gmail1.com',
    password: 'Password@12',
    firstName: 'Kaushal',
    lastName: 'Shah',
    mobile: '1234567890',
  });
  await user.save();
  return user;
};
