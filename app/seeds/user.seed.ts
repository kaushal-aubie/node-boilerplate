import { User } from '@/models';

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
  const userObj = {
    email: 'kaushal@gmail1.com',
    password: 'Password@12',
    firstName: 'Kaushal',
    lastName: 'Shah',
    mobile: '1234567890',
  };

  const user = User.build(userObj);
  await user.save();
  return user;
};
